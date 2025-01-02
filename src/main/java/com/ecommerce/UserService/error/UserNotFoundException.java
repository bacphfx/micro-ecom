package com.ecommerce.UserService.error;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class UserNotFoundException extends RuntimeException{
    private String message;

    public UserNotFoundException(String message) {
        this.message = message;
    }
}
