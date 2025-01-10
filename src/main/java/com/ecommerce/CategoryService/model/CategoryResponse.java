package com.ecommerce.CategoryService.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryResponse {
    private Long id;
    private String name;
    private String alias;
    private String image;
    private boolean enable;
    private Long parentId;
    private boolean hasChildren;
}
