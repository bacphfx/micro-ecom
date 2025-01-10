package com.ecommerce.CategoryService.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PageCategories {
    private List<CategoryResponse> content;
    private int totalPages;
    private long totalElements;
}
