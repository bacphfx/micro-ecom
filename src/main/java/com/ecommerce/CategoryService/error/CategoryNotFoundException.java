package com.ecommerce.CategoryService.error;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class CategoryNotFoundException extends RuntimeException{
    private String message;

    public CategoryNotFoundException(String message) {
        this.message = message;
    }
}
