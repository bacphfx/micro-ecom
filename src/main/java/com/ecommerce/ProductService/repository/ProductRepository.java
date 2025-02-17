package com.ecommerce.ProductService.repository;

import com.ecommerce.ProductService.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByName(String name);

    @Query("UPDATE Product p SET p.enable = ?2 WHERE p.id = ?1")
    @Modifying
    void updateEnableStatus(Long id, boolean enable);

    @Query("SELECT p FROM Product p WHERE p.name LIKE %?1% OR " +
            "p.alias LIKE %?1%")
    Page<Product> findAll(String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.categoryId IN ?1 ")
    Page<Product> findByCategoryIdIn(List<Long> categoryIds, Pageable pageable);
}
