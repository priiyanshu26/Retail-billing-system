package com.retail.product_service.exception;

import com.retail.product_service.util.ApiResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadRequestException.class)
    public ApiResponse<?> handleBadRequest(BadRequestException ex) {
        return ApiResponse.failure(ex.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ApiResponse<?> handleNotFound(ResourceNotFoundException ex) {
        return ApiResponse.failure(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ApiResponse<?> handleGeneral(Exception ex) {
        return ApiResponse.failure("Internal server error");
    }
}
