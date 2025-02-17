package com.ecommerce.ProductService.service;

import com.ecommerce.ProductService.client.BrandClient;
import com.ecommerce.ProductService.client.CategoryClient;
import com.ecommerce.ProductService.entity.Product;
import com.ecommerce.ProductService.entity.ProductDetail;
import com.ecommerce.ProductService.entity.ProductImage;
import com.ecommerce.ProductService.error.InvalidBrandException;
import com.ecommerce.ProductService.error.InvalidCategoryException;
import com.ecommerce.ProductService.error.ProductAlreadyExistsException;
import com.ecommerce.ProductService.model.*;
import com.ecommerce.ProductService.repository.ProductRepository;
import com.ecommerce.ProductService.util.FileUploadUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {
    private final ProductRepository repository;
    private final CategoryClient categoryClient;
    private final BrandClient brandClient;
    private final Mapper mapper;

    @Override
    public ProductResponse createProduct(ProductRequest request) throws JsonProcessingException {
        try {
            categoryClient.getCategory(request.getCategoryId());
        } catch (FeignException.NotFound e) {
            throw new InvalidCategoryException("Category with ID " + request.getCategoryId() + " does not exist.");
        } catch (Exception e) {
            throw new InvalidCategoryException("An error occurred while validating Category ID: " + request.getCategoryId());
        }

        try {
            brandClient.getBrand(request.getBrandId());
        } catch (FeignException.NotFound e) {
            throw new InvalidBrandException("Brand with ID " + request.getBrandId() + " does not exist.");
        } catch (Exception e) {
            throw new InvalidBrandException("An error occurred while validating Brand ID: " + request.getBrandId());
        }

        boolean existByName = repository.existsByName(request.getName());
        if (existByName) {
            throw new ProductAlreadyExistsException("Duplicate name!");
        }
        Product product = mapper.toProduct(request);
        List<ProductDetailDTO> details = new ObjectMapper().readValue(request.getDetails(),
                new TypeReference<>() {
                });

        setProductDetails(details, product);

        repository.save(product);
        return mapper.fromProduct(product);
    }

    private void setProductDetails(List<ProductDetailDTO> details, Product product) {
        if (details == null || details.isEmpty()) return;

        Map<Long, ProductDetail> existingDetailsById = product.getDetails().stream()
                .collect(Collectors.toMap(ProductDetail::getId, Function.identity()));

        product.getDetails().removeIf(detail ->
                detail.getId() != null && details.stream().noneMatch(d -> d.getId() != null && d.getId().equals(detail.getId()))
        );

        for (ProductDetailDTO detailDTO : details) {
            if (!detailDTO.getName().isBlank() && !detailDTO.getValue().isEmpty()) {
                if (detailDTO.getId() != null) {
                    ProductDetail existingDetail = existingDetailsById.get(detailDTO.getId());
                    if (existingDetail != null) {
                        existingDetail.setName(detailDTO.getName());
                        existingDetail.setValue(detailDTO.getValue());
                    }
                } else {
                    product.addDetail(detailDTO.getName(), detailDTO.getValue());
                }
            }
        }
    }

    @Override
    public Page<ProductResponse> getAll(int pageNum, int pageSize, String sortBy, String sortDir, String keyword, Long categoryId) {
        Sort sort = Sort.by(sortBy);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(pageNum - 1, pageSize, sort);
        Page<Product> products;
        if (keyword == null){
            products = repository.findAll(pageable);
        } else if(categoryId != 0){
            List<CategoryResponse> categories = categoryClient.getCateAndSub(categoryId);
            List<Long> categoryIds = categories.stream().map(CategoryResponse::getId).toList();
            products = repository.findByCategoryIdIn(categoryIds, pageable);
        } else {
            products = repository.findAll(keyword, pageable);
        }

        return products.map(mapper::fromProduct);
    }

    @Override
    public String updateStatus(Long id, boolean enable) {
        boolean existsById = repository.existsById(id);
        if (!existsById) {
            throw new EntityNotFoundException("Product not found with ID: " + id);
        }
        repository.updateEnableStatus(id, enable);
        return String.format("Product with ID: %s has been %s successfully", id, enable ? "enabled" : "disabled");
    }

    @Override
    public String deleteProduct(Long id) {
        boolean existsById = repository.existsById(id);
        if (!existsById) {
            throw new EntityNotFoundException("Product not found with ID: " + id);
        }
        repository.deleteById(id);
        return String.format("Product with ID %s has been deleted successfully!", id);
    }

    @Override
    public String updateProduct(Long id, ProductRequest request) throws IOException {
        Product product = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with ID: " + id));
        updateProductOverview(product, request);
        updateMainImage(product, request);
        updateExtraImages(product, request);
        List<ProductDetailDTO> details = new ObjectMapper().readValue(request.getDetails(),
                new TypeReference<>() {
                });

        setProductDetails(details, product);
        repository.save(product);
        return "Product has been updated successfully!";
    }


    private void updateMainImage(Product product, ProductRequest request) throws IOException {
        MultipartFile file = request.getMainImageFile();
        if (file != null && !file.isEmpty()) {
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            product.setMainImage(fileName);
            String uploadDir = "product-images/" + product.getId();
            FileUploadUtil.cleanDir(uploadDir);
            FileUploadUtil.saveFile(uploadDir, fileName, file);
        }
    }

    private void updateExtraImages(Product product, ProductRequest request) throws IOException {
        Set<ProductImage> images = product.getImages();
        Set<String> extraImageNames = request.getExtraImages().stream()
                .map(path -> Paths.get(path).getFileName().toString())
                .collect(Collectors.toSet());
        images.removeIf(image -> !extraImageNames.contains(image.getName()));
        product.setImages(images);

        String uploadDir = "product-images/" + product.getId() + "/extras";
        Path dirPath = Paths.get(uploadDir);

        try {
            Files.list(dirPath).forEach(file -> {
                String fileName = file.toFile().getName();
                if (!extraImageNames.contains(fileName)) {
                    try {
                        Files.delete(file);
                    } catch (IOException e) {
                        log.error(e.getMessage());
                    }
                }
            });
        } catch (IOException e) {
            log.error(e.getMessage());
        }

        List<MultipartFile> files = request.getExtraImageFiles();
        if (files != null && files.size() > 0) {

            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;
                String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                product.addExtraImage(fileName);
                FileUploadUtil.saveFile(uploadDir, fileName, file);
            }
        }
    }

    private void updateProductOverview(Product product, ProductRequest request) {
        product.setName(request.getName());
        product.setAlias(request.getAlias());
        product.setShortDescription(request.getShortDescription());
        product.setLongDescription(request.getLongDescription());
        product.setEnable(request.isEnable());
        product.setStock(request.getStock());
        product.setPrice(request.getPrice());
        product.setDiscountPercent(request.getDiscountPercent());
        product.setLength(request.getLength());
        product.setWidth(request.getWidth());
        product.setHeight(request.getHeight());
        product.setWeight(request.getWeight());
        product.setBrandId(request.getBrandId());
        product.setCategoryId(request.getCategoryId());
    }
}
