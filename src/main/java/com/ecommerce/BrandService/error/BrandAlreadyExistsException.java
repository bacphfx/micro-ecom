package com.ecommerce.BrandService.error;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class BrandAlreadyExistsException extends RuntimeException {
    public BrandAlreadyExistsException(String message) {
        super(message);
    }

}
