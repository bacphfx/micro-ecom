package com.ecommerce.ProductService.service;

import com.ecommerce.ProductService.client.BrandClient;
import com.ecommerce.ProductService.client.CategoryClient;
import com.ecommerce.ProductService.entity.Product;
import com.ecommerce.ProductService.entity.ProductImage;
import com.ecommerce.ProductService.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class Mapper {
    private final CategoryClient categoryClient;
    private final BrandClient brandClient;

    public Product toProduct(ProductRequest request) {
        String alias;
        if (request.getAlias() == null || request.getAlias().isEmpty()) {
            alias = request.getName().replaceAll(" ", "-");
        } else {
            alias = request.getAlias().replaceAll(" ", "-");
        }
        Product product = new Product();
        product.setId(request.getId());
        product.setName(request.getName());
        product.setAlias(alias);
        product.setShortDescription(request.getShortDescription());
        product.setLongDescription(request.getLongDescription());
        product.setEnable(request.isEnable());
        product.setStock(request.getStock());
        product.setPrice(request.getPrice());
        product.setDiscountPercent(request.getDiscountPercent());
        product.setCategoryId(request.getCategoryId());
        product.setBrandId(request.getBrandId());
        product.setLength(request.getLength());
        product.setWidth(request.getWidth());
        product.setHeight(request.getHeight());
        product.setWeight(request.getWeight());
        product.setMainImage(request.getMainImage());
        for (String fileName : request.getExtraImages()) {
            product.addExtraImage(fileName);
        }
        return product;
    }

    public ProductResponse fromProduct(Product product) {
        CategoryResponse category = categoryClient.getCategory(product.getCategoryId());
        BrandResponse brand = brandClient.getBrand(product.getBrandId());
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .alias(product.getAlias())
                .shortDescription(product.getShortDescription())
                .longDescription(product.getLongDescription())
                .enable(product.isEnable())
                .stock(product.getStock())
                .price(product.getPrice())
                .discountPercent(product.getDiscountPercent())
                .category(category)
                .brand(brand)
                .length(product.getLength())
                .width(product.getWidth())
                .height(product.getHeight())
                .weight(product.getWeight())
                .mainImage(product.getMainImagePath())
                .extraImages(product.getImages().stream().map(ProductImage::getImagePath).collect(Collectors.toList()))
                .details(product.getDetails().stream().map(detail -> new ProductDetailDTO(detail.getId(), detail.getName(), detail.getValue())).toList())
                .build();
    }
}
