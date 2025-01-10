package com.ecommerce.UserService.controller;

import com.ecommerce.UserService.model.UserRequest;
import com.ecommerce.UserService.model.UserResponse;
import com.ecommerce.UserService.service.UserService;
import com.ecommerce.UserService.util.FileUploadUtil;
import jakarta.annotation.security.PermitAll;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponse> createUser(@ModelAttribute @Valid UserRequest userRequest) throws IOException {
        MultipartFile file = userRequest.getFile();
        UserResponse userResponse;
        if (file != null && !file.isEmpty()) {
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            userRequest.setPhotos(fileName);
            userResponse = service.createUser(userRequest);
            String uploadDir = "user-photos/" + userResponse.getId();
            FileUploadUtil.saveFile(uploadDir, fileName, file);
        } else {
            userResponse = service.createUser(userRequest);
        }
        return ResponseEntity.ok(userResponse);
    }


    @GetMapping
    public ResponseEntity<Page<UserResponse>> findAll(@RequestParam(value = "page", defaultValue = "1") int pageNum,
                                                      @RequestParam(value = "limit", defaultValue = "4") int pageSize,
                                                      @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                                      @RequestParam(value = "sortDir", defaultValue = "asc") String sortDir,
                                                      @RequestParam(value = "keyword", required = false) String keyword) {
        return ResponseEntity.ok(service.listByPage(pageNum, pageSize, sortBy, sortDir, keyword));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponse> updateUser(@PathVariable("id") Long id,
                                                   @ModelAttribute UserRequest userRequest) throws IOException {
        UserResponse userResponse = service.updateUser(id, userRequest);
        return ResponseEntity.ok(userResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.deleteUser(id));
    }

    @PutMapping("/{id}/enable/{enable}")
    public ResponseEntity<String> updateUserStatus(@PathVariable("id") Long id,
                                                   @PathVariable("enable") boolean enable) {
        return ResponseEntity.ok(service.updateUserStatus(id, enable));
    }


    @GetMapping("/me")
    public ResponseEntity<UserResponse> getUserInfo(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("sub");
        return ResponseEntity.ok(service.findByEmail(email));
    }

}
