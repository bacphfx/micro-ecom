package com.ecommerce.BrandService.model;

import lombok.*;

import java.util.Set;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class BrandResponse {
    private Long id;
    private String name;
    private String logo;
    private Set<CategoryResponse> categories;
}
