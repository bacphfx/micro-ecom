package com.ecommerce.ProductService.client;

import com.ecommerce.ProductService.model.CategoryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "category-service")
public interface CategoryClient {
    @GetMapping("/{id}")
    CategoryResponse getCategory(@PathVariable("id") Long id);

    @GetMapping("/getSubCategories/{id}")
    List<CategoryResponse> getCateAndSub(@PathVariable("id") Long id);
}
