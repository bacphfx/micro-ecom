package com.ecommerce.BrandService.service;

import com.ecommerce.BrandService.model.BrandRequest;
import com.ecommerce.BrandService.model.BrandResponse;
import org.springframework.data.domain.Page;

import java.io.IOException;

public interface BrandService {
    BrandResponse createBrand(BrandRequest request);

    Page<BrandResponse> getAll(int pageNum, int pageSize, String sortBy, String sortDir, String keyword);

    String updateBrand(Long id, BrandRequest request) throws IOException;

    String deleteBrand(Long id);
}
