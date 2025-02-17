package com.ecommerce.ProductService.error;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class InvalidBrandException extends RuntimeException {
    public InvalidBrandException(String message) {
        super(message);
    }
}
