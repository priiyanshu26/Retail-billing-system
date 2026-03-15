package com.retail.product_service.dto.response;

import lombok.Data;

@Data
public class ProductResponseDto {

    private Long id;
    private String name;
    private double price;
    private int quantity;
    private String categoryName;
}
