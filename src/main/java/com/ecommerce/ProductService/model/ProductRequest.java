package com.ecommerce.ProductService.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ProductRequest {
    private Long id;
    @NotBlank(message = "Product name cannot blank")
    @Size(max = 256, message = "Max length of product name is 256")
    private String name;
    @Size(max = 256, message = "Max length of alias is 256")
    private String alias;
    @Size(max = 512, message = "Max length of short description is 512")
    private String shortDescription;
    @Size(max = 4096, message = "Max length of long description is 4096")
    private String longDescription;
    private boolean enable;
    private Long stock;
    private float price;
    private float discountPercent;
    private float length;
    private float width;
    private float height;
    private float weight;
    private Long categoryId;
    private Long brandId;
    private String mainImage;
    private MultipartFile mainImageFile;
    private List<String> extraImages = new ArrayList<>();
    private List<MultipartFile> extraImageFiles;
    private String details;

    public void addExtraImage(String extraImage){
        extraImages.add(extraImage);
    }
}
