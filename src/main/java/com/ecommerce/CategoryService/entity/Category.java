package com.ecommerce.CategoryService.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "categories")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String alias;
    private String image;
    private boolean enable;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent")
    private Set<Category> children = new HashSet<>();

    @Transient
    private boolean hasChildren;

    public Category(Long id) {
        this.id = id;
    }

    public static Category copyIdAndName(Long id, String name) {
        Category copyCategory = new Category();
        copyCategory.setId(id);
        copyCategory.setName(name);
        return copyCategory;
    }

    public static Category copyFull(Category category){
        Category copyCategory = new Category();
        copyCategory.setId(category.getId());
        copyCategory.setName(category.getName());
        copyCategory.setImage(category.getImage());
        copyCategory.setAlias(category.getAlias());
        copyCategory.setEnable(category.isEnable());
        copyCategory.setParent(category.getParent());
        copyCategory.setHasChildren(category.getChildren().size() >0);
        return copyCategory;
    }

    public static Category copyFull(Category category, String name){
        Category copyCategory = Category.copyFull(category);
        copyCategory.setName(name);
        return copyCategory;
    }

    @Transient
    public String getImagePath(){
        if (this.image == null || this.image.equals("")) return null;
        return "/category-images/" + this.id + "/" + this.image;
    }
}
