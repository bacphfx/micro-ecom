package com.ecommerce.BrandService.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "brands")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 128, unique = true, nullable = false)
    private String name;
    private String logo;

    @ElementCollection
    @CollectionTable(name = "brand_categories", joinColumns = @JoinColumn(name = "brand_id"))
    private Set<Long> categoryIds = new HashSet<>();

    @Transient
    public String getLogoPath(){
        if (logo == null || logo.isBlank()) return null;
        return "brand-logos/" + id + "/" + logo;
    }
}
