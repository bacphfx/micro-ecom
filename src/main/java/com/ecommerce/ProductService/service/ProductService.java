package com.ecommerce.ProductService.service;

import com.ecommerce.ProductService.model.ProductRequest;
import com.ecommerce.ProductService.model.ProductResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.data.domain.Page;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductRequest request) throws JsonProcessingException;

    Page<ProductResponse> getAll(int pageNum, int pageSize, String sortBy, String sortDir, String keyword, Long categoryId);

    String updateStatus(Long id, boolean enable);

    String deleteProduct(Long id);

    String updateProduct(Long id, ProductRequest request) throws IOException;
}
