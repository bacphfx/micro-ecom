package com.ecommerce.BrandService.client;

import com.ecommerce.BrandService.model.CategoryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "category-service")
public interface CategoryClient {
    @GetMapping("/{id}")
    CategoryResponse getCategory(@PathVariable("id") Long id);
}
