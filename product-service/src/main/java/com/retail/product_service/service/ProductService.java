package com.retail.product_service.service;

import com.retail.product_service.dto.request.ProductRequestDto;
import com.retail.product_service.dto.response.ProductResponseDto;

import java.util.List;

public interface ProductService {

    ProductResponseDto create(ProductRequestDto request);

    List<ProductResponseDto> searchByName(String name);
    List<ProductResponseDto> getAll();
    ProductResponseDto getById(Long id);
    ProductResponseDto update(Long id, ProductRequestDto request);
    void delete(Long id);
    List<ProductResponseDto> getByCategory(Long categoryId);

}
