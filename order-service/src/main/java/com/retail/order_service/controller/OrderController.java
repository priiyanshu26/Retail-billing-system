package com.retail.order_service.controller;

import com.retail.order_service.dto.request.OrderItemRequestDto;
import com.retail.order_service.dto.request.OrderRequestDto;
import com.retail.order_service.service.OrderService;
import com.retail.order_service.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ApiResponse<?> create(@RequestBody OrderRequestDto request) {
        return ApiResponse.success(service.createOrder(request));
    }

    @PostMapping("/{id}/items")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ApiResponse<?> addItem(
            @PathVariable Long id,
            @RequestBody OrderItemRequestDto request) {
        return ApiResponse.success(service.addItem(id, request));
    }

    @DeleteMapping("/{id}/items/{itemId}")
   @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ApiResponse<?> removeItem(
            @PathVariable Long id,
            @PathVariable Long itemId) {
        return ApiResponse.success(service.removeItem(id, itemId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ApiResponse<?> getById(@PathVariable Long id) {
        return ApiResponse.success(service.getOrderById(id));
    }

    @GetMapping("/user/{username}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ApiResponse<?> getByUser(@PathVariable String username) {
        return ApiResponse.success(service.getOrdersByUser(username));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<?> cancel(@PathVariable Long id) {
        service.cancelOrder(id);
        return ApiResponse.success("Order cancelled");
        
        
    }
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ApiResponse<?> getAllOrders() {
        return ApiResponse.success(service.getAllOrders());
    }
}
