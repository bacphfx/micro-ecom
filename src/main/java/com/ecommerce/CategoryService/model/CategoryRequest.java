package com.ecommerce.CategoryService.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryRequest {
    private Long id;
    @NotBlank(message = "Category name is not blank")
    @Size(max = 128, message = "Category name must have lest than 64 characters")
    private String name;

    @NotBlank(message = "Category name is not blank")
    @Size(max = 64, message = "Alias must have lest than 64 characters")
    private String alias;
    private String image;
    private boolean enable;
    private Long parentId;
    private MultipartFile file;
}
