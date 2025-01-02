package com.ecommerce.UserService.service;

import com.ecommerce.UserService.model.UserRequest;
import com.ecommerce.UserService.model.UserResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserService {
    List<UserResponse> listAll();

    UserResponse createUser(UserRequest userRequest);

    String deleteUser(Long id);

    String updateUserStatus(Long id, boolean enable);

    UserResponse updateUser(Long id, UserRequest userRequest) throws IOException;
}
