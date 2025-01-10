package com.ecommerce.CategoryService.service;

import com.ecommerce.CategoryService.model.CategoryRequest;
import com.ecommerce.CategoryService.model.CategoryResponse;
import com.ecommerce.CategoryService.model.PageCategories;
import org.springframework.data.domain.Page;

import java.io.IOException;
import java.util.List;

public interface CategoryService {

    CategoryResponse createCategory(CategoryRequest request);

    CategoryResponse findById(Long id);

    PageCategories getAll(int pageNum, int pageSize, String sortDir, String keyword);

    List<CategoryResponse> listCategoriesInForm();

    CategoryResponse updateCategory(Long id, CategoryRequest request) throws IOException;

    String updateStatus(Long id, boolean enable);

    String deleteCategory(Long id);
}
