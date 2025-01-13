package com.ecommerce.BrandService.service;

import com.ecommerce.BrandService.client.CategoryClient;
import com.ecommerce.BrandService.entity.Brand;
import com.ecommerce.BrandService.model.BrandRequest;
import com.ecommerce.BrandService.model.BrandResponse;
import com.ecommerce.BrandService.model.CategoryResponse;
import com.ecommerce.BrandService.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class Mapper {
    private final CategoryClient categoryClient;

    public Brand toBrand(BrandRequest request) {
        return Brand.builder()
                .id(request.getId())
                .name(request.getName())
                .logo(request.getLogo())
                .categoryIds(request.getCategoryIds())
                .build();
    }

    public BrandResponse fromBrand(Brand brand) {
        Set<CategoryResponse> categories = new HashSet<>();
        if (brand.getCategoryIds() != null && !brand.getCategoryIds().isEmpty()) {
            brand.getCategoryIds().forEach(categoryId -> {
                CategoryResponse categoryResponse = categoryClient.getCategory(categoryId);
                categories.add(categoryResponse);
            });
        }
        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .logo(brand.getLogoPath())
                .categories(categories)
                .build();
    }
}
