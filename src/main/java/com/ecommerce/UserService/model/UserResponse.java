package com.ecommerce.UserService.model;
import com.ecommerce.UserService.entity.Role;
import lombok.*;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String photos;
    private boolean enable;
    private Set<Role> roles;
}
