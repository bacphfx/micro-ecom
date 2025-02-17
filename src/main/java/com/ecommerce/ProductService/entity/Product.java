package com.ecommerce.ProductService.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "products")
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String name;
    @Column(unique = true)
    private String alias;
    @Column(length = 512)
    private String shortDescription;
    @Column(length = 4096)
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

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductImage> images = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductDetail> details = new ArrayList<>();

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdTime;
    @LastModifiedDate
    @Column(nullable = false)
    private Date updatedTime;



    public Product() {
        this.images = new HashSet<>();
    }

    public void addExtraImage(String imageName){
        this.images.add(new ProductImage(imageName, this));
    }


    public void addDetail(String name, String value){
        this.details.add(new ProductDetail(name, value, this));
    }

    @Transient
    public String getMainImagePath(){
        if (mainImage == null || mainImage.equals("")) return null;
        return "/product-images/" + id + "/" + mainImage;
    }

    public void addDetail(Long id, String name, String value) {
        this.details.add(new ProductDetail(id, name, value, this));
    }
}
