package com.retail.order_service.dto.response;

import lombok.Data;

@Data
public class ApiResponse<T> {
    private boolean success;
    private T data;
}
