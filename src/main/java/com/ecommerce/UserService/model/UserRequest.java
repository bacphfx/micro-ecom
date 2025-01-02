package com.ecommerce.UserService.model;
import com.ecommerce.UserService.entity.Role;
import jakarta.validation.constraints.Email;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UserRequest {
    private Long id;
    @Length(max = 128, message = "Invalid email")
    @Email(message = "Invalid email")
    private String email;
    @Length(min = 6, max = 64, message = "Password must have between 6 and 64 characters")
    private String password;
    @Length(min = 2, max = 64, message = "First name must have between 6 and 64 characters")
    private String firstName;
    @Length(min = 2, max = 64, message = "Last name must have between 6 and 64 characters")
    private String lastName;
    private String photos;
    private boolean enable;
    private Set<Role> roles;
    private MultipartFile file;
}
