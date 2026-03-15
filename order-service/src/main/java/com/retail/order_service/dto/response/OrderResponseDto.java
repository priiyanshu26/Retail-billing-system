package com.retail.order_service.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrderResponseDto {

    private Long id;
    private String username;
    private double totalAmount;
    private String status;
    private List<OrderItemResponseDto> items;
}
