package com.ecommerce.CategoryService.controller;

import com.ecommerce.CategoryService.model.CategoryRequest;
import com.ecommerce.CategoryService.model.CategoryResponse;
import com.ecommerce.CategoryService.model.PageCategories;
import com.ecommerce.CategoryService.service.CategoryService;
import com.ecommerce.CategoryService.util.FileUploadUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryResponse> createCategory(@Valid @ModelAttribute CategoryRequest request) throws IOException {
        MultipartFile file = request.getFile();
        CategoryResponse categoryResponse;
        if (file != null && !file.isEmpty()){
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            request.setImage(fileName);
            categoryResponse = service.createCategory(request);
            String uploadDir = "category-images/" + categoryResponse.getId();
            FileUploadUtil.saveFile(uploadDir, fileName, file);
        } else {
            categoryResponse = service.createCategory(request);
        }
        return ResponseEntity.ok(categoryResponse);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryResponse> updateCategory(@PathVariable("id") Long id,
                                                           @ModelAttribute CategoryRequest request) throws IOException {
        return ResponseEntity.ok(service.updateCategory(id, request));
    }

    @PutMapping("/{id}/enable/{enable}")
    public ResponseEntity<String> updateCategoryStatus(@PathVariable("id") Long id,
                                                                 @PathVariable("enable") boolean enable){
        return ResponseEntity.ok(service.updateStatus(id, enable));
    }

    @GetMapping
    public ResponseEntity<PageCategories> getAll(@RequestParam(value = "page", defaultValue = "1") int pageNum,
                                                 @RequestParam(value = "limit", defaultValue = "4") int pageSize,
                                                 @RequestParam(value = "sortDir", defaultValue = "asc") String sortDir,
                                                 @RequestParam(value = "keyword", required = false) String keyword){
        return ResponseEntity.ok(service.getAll(pageNum, pageSize, sortDir, keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategory(@PathVariable Long id){
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/hierarchical")
    public ResponseEntity<List<CategoryResponse>> getCategoriesInForm(){
        return ResponseEntity.ok(service.listCategoriesInForm());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable("id") Long id){
        return ResponseEntity.ok(service.deleteCategory(id));
    }
}
