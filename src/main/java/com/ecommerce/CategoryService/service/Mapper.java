package com.ecommerce.CategoryService.service;

import com.ecommerce.CategoryService.entity.Category;
import com.ecommerce.CategoryService.model.CategoryRequest;
import com.ecommerce.CategoryService.model.CategoryResponse;
import com.ecommerce.CategoryService.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class Mapper {
    private final CategoryRepository repository;

    public Category toCategory(CategoryRequest request) {
        Category category = new Category();
        category.setId(request.getId());
        category.setName(request.getName());
        category.setAlias(request.getAlias());
        if (request.getImage() != null && !request.getImage().equals("")) {
            category.setImage(request.getImage());
        }
        category.setEnable(request.isEnable());

        if (request.getParentId() != null) {
            Category parent = repository.findById(request.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid parent Id"));
            category.setParent(parent);
        }
        return category;
    }

    public CategoryResponse fromCategory(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getAlias(),
                category.getImagePath(),
                category.isEnable(),
                category.getParent() != null ? category.getParent().getId() : null,
                category.isHasChildren()
        );
    }
}
