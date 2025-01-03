package com.ecommerce.UserService.service;

import com.ecommerce.UserService.entity.Role;
import com.ecommerce.UserService.entity.User;
import com.ecommerce.UserService.error.UserAlreadyExistsException;
import com.ecommerce.UserService.model.UserRequest;
import com.ecommerce.UserService.model.UserResponse;
import com.ecommerce.UserService.repository.UserRepository;
import com.ecommerce.UserService.util.FileUploadUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository repository;
    private final Mapper mapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Page<UserResponse> listAll(int pageNum, int pageSize, String sortBy, String sortDir, String keyword) {
        Sort sort = Sort.by(sortBy);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();

        Pageable pageable = PageRequest.of(pageNum - 1, pageSize, sort);
        Page<User> users;
        if (keyword != null && !keyword.equals("")) {
            users = repository.findAll(keyword, pageable);
        }else {
            users = repository.findAll(pageable);
        }
        return users.map(mapper::fromUser);
    }

    @Override
    public UserResponse createUser(UserRequest userRequest) {
        User userInDB = repository.findByEmail(userRequest.getEmail());
        if (userInDB != null) {
            throw new UserAlreadyExistsException(String.format("Email %s is already in use", userRequest.getEmail()));
        }

        User user = mapper.toUser(userRequest);
        user.getRoles().add(Role.ROLE_USER);
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        repository.save(user);
        return mapper.fromUser(user);
    }

    @Override
    public String deleteUser(Long id) {
        Long countById = repository.countById(id);
        if (countById == null || countById == 0) {
            throw new EntityNotFoundException("User not found with ID: " + id);
        }
        repository.deleteById(id);
        return String.format("User with ID: %s has been deleted successfully", id);
    }

    @Override
    public String updateUserStatus(Long id, boolean enable) {
        Long countById = repository.countById(id);
        if (countById == null || countById == 0) {
            throw new EntityNotFoundException("User not found with ID: " + id);
        }
        repository.updateEnableStatus(id, enable);
        return String.format("User with ID: %s has been %s successfully", id, enable ? "enabled" : "disabled");
    }

    @Override
    public UserResponse updateUser(Long id, UserRequest userRequest) throws IOException {
        User user = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + id));
        updateUserDetails(user, userRequest);
        MultipartFile file = userRequest.getFile();
        if (file != null && !file.isEmpty()) {
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            user.setPhotos(fileName);

            String uploadDir = "user-photos/" + user.getId();
            FileUploadUtil.cleanDir(uploadDir);
            FileUploadUtil.saveFile(uploadDir, fileName, file);
        }

        repository.save(user);
        return mapper.fromUser(user);

    }

    private void updateUserDetails(User user, UserRequest userRequest) {
        user.setEmail(userRequest.getEmail());
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setEnable(userRequest.isEnable());
        user.setRoles(userRequest.getRoles());

        if (userRequest.getPassword() != null && !userRequest.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        }
    }
}
