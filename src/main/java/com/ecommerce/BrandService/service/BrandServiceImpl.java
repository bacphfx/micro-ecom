package com.ecommerce.BrandService.service;

import com.ecommerce.BrandService.client.CategoryClient;
import com.ecommerce.BrandService.entity.Brand;
import com.ecommerce.BrandService.error.BrandAlreadyExistsException;
import com.ecommerce.BrandService.error.InvalidCategoryException;
import com.ecommerce.BrandService.model.BrandRequest;
import com.ecommerce.BrandService.model.BrandResponse;
import com.ecommerce.BrandService.model.CategoryResponse;
import com.ecommerce.BrandService.repository.BrandRepository;
import com.ecommerce.BrandService.util.FileUploadUtil;
import feign.FeignException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BrandServiceImpl implements BrandService {
    private final BrandRepository repository;
    private final Mapper mapper;
    private final CategoryClient categoryClient;

    @Override
    public BrandResponse createBrand(BrandRequest request) {
        boolean existsByName = repository.existsByName(request.getName());
        if (existsByName) {
            throw new BrandAlreadyExistsException("Duplicate name! Name must be unique");
        }
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            request.getCategoryIds().forEach(categoryId -> {
                try {
                    CategoryResponse category = categoryClient.getCategory(categoryId);
                } catch (FeignException.NotFound e) {
                    throw new InvalidCategoryException("Category with ID " + categoryId + " does not exist.");
                } catch (Exception e) {
                    throw new InvalidCategoryException("An error occurred while validating Category ID: " + categoryId);
                }
            });
        }
        Brand brand = mapper.toBrand(request);
        repository.save(brand);
        return mapper.fromBrand(brand);
    }

    @Override
    public Page<BrandResponse> getAll(int pageNum, int pageSize, String sortBy, String sortDir, String keyword) {
        Sort sort = Sort.by(sortBy);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(pageNum - 1, pageSize, sort);
        Page<Brand> brandPage;
        if (keyword == null && keyword.isEmpty()) {
             brandPage   = repository.findAll(pageable);
        } else {
            brandPage = repository.findAll(keyword, pageable);
        }

        return brandPage.map(mapper::fromBrand);
    }

    @Override
    public String updateBrand(Long id, BrandRequest request) throws IOException {
        Brand brand = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Brand not found with ID: " + id));
        boolean existsByName = repository.existsByName(request.getName());
        if (existsByName && !request.getName().equals(brand.getName())) {
            throw new BrandAlreadyExistsException("Duplicate name! Name must be unique");
        }
        brand.setName(request.getName());
        brand.setCategoryIds(request.getCategoryIds());
        MultipartFile file = request.getFile();
        if (file != null && !file.isEmpty()) {
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            brand.setLogo(fileName);
            String uploadDir = "brand-logos/" + id;
            FileUploadUtil.cleanDir(uploadDir);
            FileUploadUtil.saveFile(uploadDir, fileName, file);
        }
        repository.save(brand);
        return String.format("Brand with ID %s has been updated successfully", id);
    }

    @Override
    public String deleteBrand(Long id) {
        boolean existsById = repository.existsById(id);
        if (!existsById) {
            throw new EntityNotFoundException("Brand not found with ID: " + id);
        }
        repository.deleteById(id);
        return String.format("Brand with ID %s has been deleted successfully!", id);
    }
}
