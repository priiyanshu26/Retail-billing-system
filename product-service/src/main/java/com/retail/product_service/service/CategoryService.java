package com.retail.product_service.service;

import com.retail.product_service.dto.request.CategoryRequestDto;
import com.retail.product_service.dto.response.CategoryResponseDto;

import java.util.List;

public interface CategoryService {

    CategoryResponseDto create(CategoryRequestDto request);

    List<CategoryResponseDto> getAll();
   // CategoryResponseDto getById(Long id);
    CategoryResponseDto update(Long id, CategoryRequestDto request);
    void delete(Long id);

	CategoryResponseDto getById(Long id);

}
