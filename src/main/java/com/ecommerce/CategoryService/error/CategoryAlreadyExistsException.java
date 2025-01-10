package com.ecommerce.CategoryService.error;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class CategoryAlreadyExistsException extends RuntimeException{
    private String message;

    public CategoryAlreadyExistsException(String message) {
        this.message = message;
    }

}
