package com.ecommerce.CategoryService.repository;

import com.ecommerce.CategoryService.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("SELECT c FROM Category c where c.parent.id is NULL")
    List<Category> findRootCategories(Sort sort);

    @Query("SELECT c FROM Category c where c.parent.id is NULL")
    Page<Category> findRootCategories(Pageable pageable);

    @Query("SELECT c FROM Category c where c.name LIKE %?1%")
    Page<Category> search(String keyword, Pageable pageable);

    Category findByAlias(String alias);

    Long countById(Long id);

    @Query("UPDATE Category c SET c.enable = ?2 WHERE c.id = ?1")
    @Modifying
    void updateStatus(Long id, boolean enable);
}
