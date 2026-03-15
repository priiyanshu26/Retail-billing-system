package com.retail.product_service.util;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "SUCCESS", data);
    }

    public static ApiResponse<?> failure(String message) {
        return new ApiResponse<>(false, message, null);
    }
}
