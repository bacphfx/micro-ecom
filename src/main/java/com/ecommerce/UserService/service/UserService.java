package com.ecommerce.UserService.service;

import com.ecommerce.UserService.model.UserRequest;
import com.ecommerce.UserService.model.UserResponse;
import org.springframework.data.domain.Page;

import java.io.IOException;

public interface UserService {
    Page<UserResponse> listAll(int pageNum, int pageSize, String sortBy, String sortDir, String keyword);

    UserResponse createUser(UserRequest userRequest);

    String deleteUser(Long id);

    String updateUserStatus(Long id, boolean enable);

    UserResponse updateUser(Long id, UserRequest userRequest) throws IOException;
}
