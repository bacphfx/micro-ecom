package com.ecommerce.BrandService.error;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class InvalidCategoryException extends RuntimeException {
    public InvalidCategoryException(String message) {
        super(message);
    }
}
