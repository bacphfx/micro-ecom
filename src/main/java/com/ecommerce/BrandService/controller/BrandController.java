package com.ecommerce.BrandService.controller;

import com.ecommerce.BrandService.model.BrandRequest;
import com.ecommerce.BrandService.model.BrandResponse;
import com.ecommerce.BrandService.service.BrandService;
import com.ecommerce.BrandService.util.FileUploadUtil;
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
public class BrandController {
    private final BrandService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createBrand(@Valid @ModelAttribute BrandRequest request) throws IOException {
        MultipartFile file = request.getFile();
        BrandResponse brandResponse;
        if (file != null && !file.isEmpty()) {
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            request.setLogo(fileName);
            brandResponse = service.createBrand(request);
            String uploadDir = "brand-logos/" + brandResponse.getId();
            FileUploadUtil.saveFile(uploadDir, fileName, file);
        } else {
            brandResponse = service.createBrand(request);
        }
        return ResponseEntity.ok("Brand has been created successfully with ID: " + brandResponse.getId());
    }

    @GetMapping
    public ResponseEntity<Page<BrandResponse>> getAll(@RequestParam(value = "page", defaultValue = "1") int pageNum,
                                                      @RequestParam(value = "limit", defaultValue = "4") int pageSize,
                                                      @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                                      @RequestParam(value = "sortDir", defaultValue = "asc") String sortDir,
                                                      @RequestParam(value = "keyword", required = false) String keyword) {
        return ResponseEntity.ok(service.getAll(pageNum, pageSize, sortBy, sortDir, keyword));
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateBrand(@PathVariable("id") Long id,
                                              @Valid @ModelAttribute BrandRequest request) throws IOException {

        return ResponseEntity.ok(service.updateBrand(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBrand(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.deleteBrand(id));
    }
}
