package com.retail.order_service.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class OrderRequestDto {

//    @NotBlank
//    private String username;
	@NotBlank
    private String customerName;

    @NotEmpty
    private List<OrderItemRequestDto> items;
}
