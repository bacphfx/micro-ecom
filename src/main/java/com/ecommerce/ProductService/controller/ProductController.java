package com.ecommerce.ProductService.controller;
import com.ecommerce.ProductService.model.ProductRequest;
import com.ecommerce.ProductService.model.ProductResponse;
import com.ecommerce.ProductService.service.ProductService;
import com.ecommerce.ProductService.util.FileUploadUtil;

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
public class ProductController {
    private final ProductService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createProduct(@Valid @ModelAttribute ProductRequest request) throws IOException {
        MultipartFile mainImageFile = request.getMainImageFile();
        setMainImageName(mainImageFile, request);

        List<MultipartFile> extraImageFiles = request.getExtraImageFiles();
        setExtraImageNames(extraImageFiles, request);


        ProductResponse product = service.createProduct(request);

        saveUploadedImages(mainImageFile, extraImageFiles, product);


        return ResponseEntity.ok("Product created successfully with ID: " + product.getId());
    }

    private void saveUploadedImages(MultipartFile mainImageFile, List<MultipartFile> extraImageFiles, ProductResponse product) throws IOException {
        if (mainImageFile != null && !mainImageFile.isEmpty()){
            String fileName = StringUtils.cleanPath(mainImageFile.getOriginalFilename());
            String uploadDir = "product-images/" + product.getId();
            FileUploadUtil.cleanDir(uploadDir);
            FileUploadUtil.saveFile(uploadDir, fileName, mainImageFile);
        }

        if (extraImageFiles != null && extraImageFiles.size() > 0){
            String uploadDir = "product-images/" + product.getId() + "/extras";
            for (MultipartFile file: extraImageFiles){
                if (file.isEmpty()) continue;
                String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                FileUploadUtil.saveFile(uploadDir, fileName, file);
            }
        }
    }

    private void setExtraImageNames(List<MultipartFile> extraImageFiles, ProductRequest request) {
        if (extraImageFiles != null && extraImageFiles.size() > 0){
            for (MultipartFile file: extraImageFiles){
                if (!file.isEmpty()){
                    String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                    request.addExtraImage(fileName);
                }
            }
        }
    }

    private void setMainImageName(MultipartFile mainImageFile, ProductRequest request) {
        if (mainImageFile != null && !mainImageFile.isEmpty()){
            String fileName = StringUtils.cleanPath(mainImageFile.getOriginalFilename());
            request.setMainImage(fileName);
        }
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAll(@RequestParam(value = "page", defaultValue = "1") int pageNum,
                                                        @RequestParam(value = "limit", defaultValue = "4") int pageSize,
                                                        @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                                        @RequestParam(value = "sortDir", defaultValue = "asc") String sortDir,
                                                        @RequestParam(value = "keyword", required = false) String keyword,
                                                        @RequestParam(value = "categoryId", required = false) Long categoryId){
        return ResponseEntity.ok(service.getAll(pageNum, pageSize, sortBy, sortDir, keyword, categoryId));
    }

    @PutMapping("/{id}/enable/{enable}")
    public ResponseEntity<String> updateProductStatus(@PathVariable("id") Long id,
                                                      @PathVariable("enable") boolean enable){
        return ResponseEntity.ok(service.updateStatus(id, enable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") Long id){
        return ResponseEntity.ok(service.deleteProduct(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable("id") Long id,
                                                @Valid @ModelAttribute ProductRequest request) throws IOException {
        return ResponseEntity.ok(service.updateProduct(id, request));
    }
}
