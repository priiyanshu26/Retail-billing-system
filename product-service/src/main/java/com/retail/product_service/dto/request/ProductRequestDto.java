package com.retail.product_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;


public class ProductRequestDto {

    @NotBlank
    private String name;

    @Positive
    private double price;

    @Positive
    private int quantity;

    private Long categoryId;
    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    
}
