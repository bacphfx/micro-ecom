package com.ecommerce.ProductService.model;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String alias;
    private String shortDescription;
    private String longDescription;
    private boolean enable;
    private Long stock;
    private float price;
    private float discountPercent;
    private float length;
    private float width;
    private float height;
    private float weight;
    private CategoryResponse category;
    private BrandResponse brand;
    private String mainImage;
    private List<String> extraImages;
    private List<ProductDetailDTO> details;
}
