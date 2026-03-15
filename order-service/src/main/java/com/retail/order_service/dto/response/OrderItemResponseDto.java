package com.retail.order_service.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemResponseDto {

    private Long id;
    private Long productId;
    private String productName;
    private double price;
    private int quantity;
    private double lineTotal;
}
