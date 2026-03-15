package com.retail.billing_service.dto.request;

import lombok.Data;

@Data
public class GenerateInvoiceRequestDto {
    private Long orderId;
}
