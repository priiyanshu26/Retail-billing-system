package com.retail.billing_service.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class InvoiceResponseDto {
    private Long id;
    private Long orderId;
    private String username;
    private double subtotal;
    private double tax;
    private double discount;
    private double totalAmount;
    private String status;
    private List<InvoiceItemResponseDto> items;
}


