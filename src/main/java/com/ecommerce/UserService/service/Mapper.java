package com.ecommerce.UserService.service;

import com.ecommerce.UserService.entity.User;
import com.ecommerce.UserService.model.UserRequest;
import com.ecommerce.UserService.model.UserResponse;
import org.springframework.stereotype.Service;

@Service
public class Mapper {
    public UserResponse fromUser(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .photos(user.getPhotosImagePath())
                .enable(user.isEnable())
                .roles(user.getRoles())
                .build();
    }

    public User toUser(UserRequest userRequest) {
        return User.builder()
                .id(userRequest.getId())
                .email(userRequest.getEmail())
                .firstName(userRequest.getFirstName())
                .lastName(userRequest.getLastName())
                .photos(userRequest.getPhotos())
                .enable(userRequest.isEnable())
                .roles(userRequest.getRoles())
                .build();
    }
}
