//package com.retail.product_service.controller;
//
//import com.retail.product_service.dto.request.ProductRequestDto;
//import com.retail.product_service.service.ProductService;
//import com.retail.product_service.util.ApiResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/products")
//@RequiredArgsConstructor
//public class ProductController {
//
//    private final ProductService service;
//
//    @PostMapping
//    public ApiResponse<?> create(@RequestBody ProductRequestDto request) {
//        return ApiResponse.success(service.create(request));
//    }
//
//    @GetMapping("/search")
//    public ApiResponse<?> search(@RequestParam String name) {
//        return ApiResponse.success(service.searchByName(name));
//    }
//    @GetMapping
//    public ApiResponse<?> getAll() {
//        return ApiResponse.success(service.getAll());
//    }
//
//    @GetMapping("/{id}")
//    public ApiResponse<?> getById(@PathVariable Long id) {
//        return ApiResponse.success(service.getById(id));
//    }
//
//    @PutMapping("/{id}")
//    public ApiResponse<?> update(
//            @PathVariable Long id,
//            @RequestBody ProductRequestDto request) {
//        return ApiResponse.success(service.update(id, request));
//    }
//
//    @DeleteMapping("/{id}")
//    public ApiResponse<?> delete(@PathVariable Long id) {
//        service.delete(id);
//        return ApiResponse.success("Product deleted successfully");
//    }
//
//    @GetMapping("/category/{categoryId}")
//    public ApiResponse<?> getByCategory(@PathVariable Long categoryId) {
//        return ApiResponse.success(service.getByCategory(categoryId));
//    }
//
//}
package com.retail.product_service.controller;

import com.retail.product_service.dto.request.ProductRequestDto;
import com.retail.product_service.service.ProductService;
import com.retail.product_service.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    // ✅ ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<?> create(@RequestBody ProductRequestDto request) {
        return ApiResponse.success(service.create(request));
    }

    // ✅ ADMIN + USER
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/search")
    public ApiResponse<?> search(@RequestParam String name) {
        return ApiResponse.success(service.searchByName(name));
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
            @RequestBody ProductRequestDto request) {
        return ApiResponse.success(service.update(id, request));
    }

    // ✅ ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.success("Product deleted successfully");
    }

    // ✅ ADMIN + USER
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/category/{categoryId}")
    public ApiResponse<?> getByCategory(@PathVariable Long categoryId) {
        return ApiResponse.success(service.getByCategory(categoryId));
    }
}
