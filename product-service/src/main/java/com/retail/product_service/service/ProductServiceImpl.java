package com.retail.product_service.service;

import com.retail.product_service.dto.request.ProductRequestDto;
import com.retail.product_service.dto.response.ProductResponseDto;
import com.retail.product_service.entity.Category;
import com.retail.product_service.entity.Product;
import com.retail.product_service.exception.ResourceNotFoundException;
import com.retail.product_service.repository.CategoryRepository;
import com.retail.product_service.repository.ProductRepository;
import com.retail.product_service.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductResponseDto create(ProductRequestDto request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = new Product(
                null,
                request.getName(),
                request.getPrice(),
                request.getQuantity(),
                category
        );

        Product saved = productRepository.save(product);

        ProductResponseDto response = new ProductResponseDto();
        response.setId(saved.getId());
        response.setName(saved.getName());
        response.setPrice(saved.getPrice());
        response.setQuantity(saved.getQuantity());
        response.setCategoryName(category.getName());

        return response;
    }

    @Override
    public List<ProductResponseDto> searchByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(p -> {
                    ProductResponseDto dto = new ProductResponseDto();
                    dto.setId(p.getId());
                    dto.setName(p.getName());
                    dto.setPrice(p.getPrice());
                    dto.setQuantity(p.getQuantity());
                    dto.setCategoryName(p.getCategory().getName());
                    return dto;
                }).toList();
    }

	@Override
	public List<ProductResponseDto> getAll() {
		 return productRepository.findAll().stream().map(this::mapToDto).toList();
	}

	@Override
	public ProductResponseDto getById(Long id) {
		 Product product = productRepository.findById(id)
		            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		    return mapToDto(product);
	}

	@Override
	public ProductResponseDto update(Long id, ProductRequestDto request) {
		Product product = productRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

	    Category category = categoryRepository.findById(request.getCategoryId())
	            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

	    product.setName(request.getName());
	    product.setPrice(request.getPrice());
	    product.setQuantity(request.getQuantity());
	    product.setCategory(category);

	    Product updated = productRepository.save(product);
	    return mapToDto(updated);
	}

	@Override
	public void delete(Long id) {
		Product product = productRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

	    productRepository.delete(product);
		
	}

	@Override
	public List<ProductResponseDto> getByCategory(Long categoryId) {
		return productRepository.findByCategoryId(categoryId)
	            .stream()
	            .map(this::mapToDto)
	            .toList();
	}
	private ProductResponseDto mapToDto(Product product) {
	    ProductResponseDto dto = new ProductResponseDto();
	    dto.setId(product.getId());
	    dto.setName(product.getName());
	    dto.setPrice(product.getPrice());
	    dto.setQuantity(product.getQuantity());
	    dto.setCategoryName(product.getCategory().getName());
	    return dto;
	}
}
