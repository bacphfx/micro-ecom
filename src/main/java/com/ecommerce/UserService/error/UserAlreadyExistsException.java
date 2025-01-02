package com.ecommerce.UserService.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class UserAlreadyExistsException extends RuntimeException{
    private String message;

    public UserAlreadyExistsException(String message) {
        this.message = message;
    }

}
