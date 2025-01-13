package com.ecommerce.BrandService.model;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BrandRequest {
    private Long id;
    @Size(min = 2, max = 128, message = "Name must be between 2 and 128 characters")
    private String name;
    private String logo;
    private Set<Long> categoryIds;
    private MultipartFile file;
}
