//package com.retail.product_service.controller;
//
//import com.retail.product_service.dto.request.CategoryRequestDto;
//import com.retail.product_service.service.CategoryService;
//import com.retail.product_service.util.ApiResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/categories")
//@RequiredArgsConstructor
//public class CategoryController {
//
//    private final CategoryService service;
//
//    @PostMapping
//    public ApiResponse<?> create(@RequestBody CategoryRequestDto request) {
//        return ApiResponse.success(service.create(request));
//    }
//
//    @GetMapping
//    public ApiResponse<?> getAll() {
//        return ApiResponse.success(service.getAll());
//        
//        
//    }
//    @GetMapping("/{id}")
//    public ApiResponse<?> getById(@PathVariable Long id) {
//        return ApiResponse.success(service.getById(id));
//    }
//
//    @PutMapping("/{id}")
//    public ApiResponse<?> update(
//            @PathVariable Long id,
//            @RequestBody CategoryRequestDto request) {
//        return ApiResponse.success(service.update(id, request));
//    }
//
//    @DeleteMapping("/{id}")
//    public ApiResponse<?> delete(@PathVariable Long id) {
//        service.delete(id);
//        return ApiResponse.success("Category deleted successfully");
//    }
//
//}
package com.retail.product_service.controller;

import com.retail.product_service.dto.request.CategoryRequestDto;
import com.retail.product_service.service.CategoryService;
import com.retail.product_service.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService service;

    // ✅ ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<?> create(@RequestBody CategoryRequestDto request) {
        return ApiResponse.success(service.create(request));
    }

    // ✅ ADMIN + USER
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public ApiResponse<?> getAll() {
        return ApiResponse.success(service.getAll());
    }

    // ✅ ADMIN + USER
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/{id}")
    public ApiResponse<?> getById(@PathVariable Long id) {
        return ApiResponse.success(service.getById(id));
    }

    // ✅ ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<?> update(
            @PathVariable Long id,
            @RequestBody CategoryRequestDto request) {
        return ApiResponse.success(service.update(id, request));
    }

    // ✅ ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.success("Category deleted successfully");
    }
}
