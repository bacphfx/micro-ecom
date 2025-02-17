package com.ecommerce.ProductService.client;

import com.ecommerce.ProductService.model.BrandResponse;
import com.ecommerce.ProductService.model.CategoryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "brand-service")
public interface BrandClient {
    @GetMapping("/{id}")
    BrandResponse getBrand(@PathVariable("id") Long id);
}
