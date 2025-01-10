package com.ecommerce.CategoryService.service;

import com.ecommerce.CategoryService.entity.Category;
import com.ecommerce.CategoryService.error.CategoryAlreadyExistsException;
import com.ecommerce.CategoryService.error.CategoryNotFoundException;
import com.ecommerce.CategoryService.model.CategoryRequest;
import com.ecommerce.CategoryService.model.CategoryResponse;
import com.ecommerce.CategoryService.model.PageCategories;
import com.ecommerce.CategoryService.repository.CategoryRepository;
import com.ecommerce.CategoryService.util.FileUploadUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository repository;
    private final Mapper mapper;

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        Category categoryInDB = repository.findByAlias(request.getAlias());
        if (categoryInDB != null) {
            throw new CategoryAlreadyExistsException("Duplicate alias! Alias must be unique");
        }
        Category category = mapper.toCategory(request);
        repository.save(category);
        return mapper.fromCategory(category);
    }

    @Override
    public CategoryResponse findById(Long id) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with ID: " + id));
        return mapper.fromCategory(category);
    }

    @Override
    public PageCategories getAll(int pageNum, int pageSize, String sortDir, String keyword) {
        Sort sort = Sort.by("name");
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(pageNum - 1, pageSize, sort);

        Page<Category> pageCategories = null;
        if (keyword != null && !keyword.isEmpty()) {
            pageCategories = repository.search(keyword, pageable);
        } else {
            pageCategories = repository.findRootCategories(pageable);
        }

        if (keyword != null && !keyword.isEmpty()) {
            List<Category> searchResult = pageCategories.getContent();
            List<CategoryResponse> categoryResponses = new ArrayList<>();
            for (Category category : searchResult) {
                category.setHasChildren(category.getChildren().size() > 0);
                categoryResponses.add(mapper.fromCategory(category));
            }
            return new PageCategories(categoryResponses, pageCategories.getTotalPages(), pageCategories.getTotalElements());
        } else {
            List<Category> rootCategories = pageCategories.getContent();
            List<CategoryResponse> hierarchicalCategories = listHierarchicalCategories(rootCategories, sortDir);
            return new PageCategories(hierarchicalCategories, pageCategories.getTotalPages(), pageCategories.getTotalElements());
        }
    }


    private List<CategoryResponse> listHierarchicalCategories(List<Category> rootCategories, String sortDir) {
        List<CategoryResponse> categoryResponses = new ArrayList<>();
        for (Category rootCategory : rootCategories) {
            listSubHierarchicalCategories(categoryResponses, rootCategory, 0, sortDir);
        }
        return categoryResponses;
    }

    private void listSubHierarchicalCategories(List<CategoryResponse> categoryResponses, Category parent, int level, String sortDir) {
        String name = "";
        for (int i = 0; i < level; i++) {
            name += "--";
        }
        categoryResponses.add(mapper.fromCategory(Category.copyFull(parent, name + parent.getName())));
        Set<Category> children = sortSubCategories(parent.getChildren(), sortDir);
        for (Category child : children) {
            listSubHierarchicalCategories(categoryResponses, child, level + 1, sortDir);
        }
    }

    @Override
    public List<CategoryResponse> listCategoriesInForm() {
        List<CategoryResponse> categoriesUsedInForm = new ArrayList<>();
        List<Category> rootCategories = repository.findRootCategories(Sort.by("name").ascending());
        for (Category category : rootCategories) {
            listChildren(categoriesUsedInForm, category, 0);

        }
        return categoriesUsedInForm;
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest request) throws IOException {
        Category categoryInDB = repository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + id));
        if (!categoryInDB.getAlias().equals(request.getAlias())) {
            Category categoryByAlias = repository.findByAlias(request.getAlias());
            if (categoryByAlias != null) {
                throw new CategoryAlreadyExistsException("Duplicate alias! Alias must be unique");
            }
        }
//        Category category = mapper.toCategory(request);
        categoryInDB.setName(request.getName());
        categoryInDB.setAlias(request.getAlias());
        categoryInDB.setEnable(request.isEnable());
        if (request.getParentId() != null) {
            Category parent = repository.findById(request.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid parent Id"));
            categoryInDB.setParent(parent);
        } else {
            categoryInDB.setParent(null);
        }
        MultipartFile file = request.getFile();
        if (file != null && !file.isEmpty()) {
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            categoryInDB.setImage(fileName);
            String uploadDir = "category-images/" + id;
            FileUploadUtil.cleanDir(uploadDir);
            FileUploadUtil.saveFile(uploadDir, fileName, file);
        }
        repository.save(categoryInDB);
        return mapper.fromCategory(categoryInDB);
    }

    @Override
    public String updateStatus(Long id, boolean enable) {
        Long countById = repository.countById(id);
        if (countById == null || countById == 0) {
            throw new CategoryNotFoundException("Category not found with ID: " + id);
        }
        repository.updateStatus(id, enable);
        return String.format("Category with ID %s has been %s successfully!", id, enable ? "enabled" : "disabled");
    }

    @Override
    public String deleteCategory(Long id) {
        Long countById = repository.countById(id);
        if (countById == null || countById == 0) {
            throw new CategoryNotFoundException("Category not found with ID: " + id);
        }
        repository.deleteById(id);
        String categoryDir = "category-images/" + id;
        FileUploadUtil.removeDir(categoryDir);
        return String.format("Category with ID %s has been deleted successfully!", id);
    }

    private void listChildren(List<CategoryResponse> categoriesUsedInForm, Category category, int level) {
        String name = "";
        for (int i = 0; i < level; i++) {
            name += "--";
        }
        categoriesUsedInForm.add(mapper.fromCategory(Category.copyIdAndName(category.getId(), name + category.getName())));

        Set<Category> children = sortSubCategories(category.getChildren());
        for (Category child : children) {
            listChildren(categoriesUsedInForm, child, level + 1);
        }
    }

    private Set<Category> sortSubCategories(Set<Category> children) {
        return sortSubCategories(children, "asc");
    }

    private Set<Category> sortSubCategories(Set<Category> children, String sortDir) {
        SortedSet<Category> sortedChildren = new TreeSet<>(new Comparator<Category>() {
            @Override
            public int compare(Category cat1, Category cat2) {
                if (sortDir.equals("asc")) {

                    return cat1.getName().compareTo(cat2.getName());
                } else {
                    return cat2.getName().compareTo(cat1.getName());
                }
            }
        });
        sortedChildren.addAll(children);
        return sortedChildren;
    }
}
