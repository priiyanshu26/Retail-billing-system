package com.retail.product_service.service;

import com.retail.product_service.dto.request.CategoryRequestDto;
import com.retail.product_service.dto.response.CategoryResponseDto;
import com.retail.product_service.entity.Category;
import com.retail.product_service.exception.BadRequestException;
import com.retail.product_service.exception.ResourceNotFoundException;
import com.retail.product_service.repository.CategoryRepository;
import com.retail.product_service.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repository;

    @Override
    public CategoryResponseDto create(CategoryRequestDto request) {

        if (repository.existsByName(request.getName())) {
            throw new BadRequestException("Category already exists");
        }

        Category category = new Category(null, request.getName(), request.getDescription());
        Category saved = repository.save(category);

        CategoryResponseDto response = new CategoryResponseDto();
        response.setId(saved.getId());
        response.setName(saved.getName());
        response.setDescription(saved.getDescription());

        return response;
    }

    @Override
    public List<CategoryResponseDto> getAll() {
        return repository.findAll().stream().map(cat -> {
            CategoryResponseDto dto = new CategoryResponseDto();
            dto.setId(cat.getId());
            dto.setName(cat.getName());
            dto.setDescription(cat.getDescription());
            return dto;
        }).toList();
        
        
        
    }

	@Override
	public CategoryResponseDto getById(Long id) {
		Category category = repository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

	    CategoryResponseDto dto = new CategoryResponseDto();
	    dto.setId(category.getId());
	    dto.setName(category.getName());
	    dto.setDescription(category.getDescription());
	    return dto;
	}

	@Override
	public CategoryResponseDto update(Long id, CategoryRequestDto request) {
		Category category = repository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

	    category.setName(request.getName());
	    category.setDescription(request.getDescription());

	    Category updated = repository.save(category);

	    CategoryResponseDto dto = new CategoryResponseDto();
	    dto.setId(updated.getId());
	    dto.setName(updated.getName());
	    dto.setDescription(updated.getDescription());
	    return dto;
	}

	@Override
	public void delete(Long id) {
		Category category = repository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

	    repository.delete(category);
		
	}
}
