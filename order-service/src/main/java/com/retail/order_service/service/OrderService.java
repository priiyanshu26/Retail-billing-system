package com.retail.order_service.service;

import com.retail.order_service.dto.request.OrderItemRequestDto;
import com.retail.order_service.dto.request.OrderRequestDto;
import com.retail.order_service.dto.response.OrderResponseDto;

import java.util.List;

public interface OrderService {

    OrderResponseDto createOrder(OrderRequestDto request);

    OrderResponseDto addItem(Long orderId, OrderItemRequestDto request);

    OrderResponseDto removeItem(Long orderId, Long itemId);

    OrderResponseDto getOrderById(Long id);

    List<OrderResponseDto> getOrdersByUser(String username);
    
    

    void cancelOrder(Long id);

	List<OrderResponseDto> getAllOrders();
}
