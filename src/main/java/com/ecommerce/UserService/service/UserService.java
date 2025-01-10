package com.ecommerce.UserService.service;

import com.ecommerce.UserService.model.UserRequest;
import com.ecommerce.UserService.model.UserResponse;
import org.springframework.data.domain.Page;

import java.io.IOException;
import java.util.List;

public interface UserService {
    Page<UserResponse> listByPage(int pageNum, int pageSize, String sortBy, String sortDir, String keyword);

    UserResponse createUser(UserRequest userRequest);

    String deleteUser(Long id);

    String updateUserStatus(Long id, boolean enable);

    UserResponse updateUser(Long id, UserRequest userRequest) throws IOException;

    List<UserResponse> listAll();

    UserResponse findByEmail(String email);
}
