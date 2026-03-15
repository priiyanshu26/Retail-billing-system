package com.retail.order_service.service;

import com.retail.order_service.client.ProductClient;

import com.retail.order_service.dto.request.OrderItemRequestDto;
import com.retail.order_service.dto.request.OrderRequestDto;
import com.retail.order_service.dto.response.OrderItemResponseDto;
import com.retail.order_service.dto.response.OrderResponseDto;
import com.retail.order_service.entity.Order;
import com.retail.order_service.entity.OrderItem;
import com.retail.order_service.exception.ResourceNotFoundException;
import com.retail.order_service.repository.OrderItemRepository;
import com.retail.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductClient productClient;

    @Override
    public OrderResponseDto createOrder(OrderRequestDto request) {

        Order order = Order.builder()
                .username(request.getCustomerName())
                .status("CREATED")
                .totalAmount(0)
                .createdAt(LocalDateTime.now())
                .build();

        return map(orderRepository.save(order));
    }

//    @Override
//    public OrderResponseDto addItem(Long orderId, OrderItemRequestDto request) {
//
////        Order order = orderRepository.findById(orderId)
////                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
//    	Order order = orderRepository.findByIdWithItems(orderId)
//    	        .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
//
//
//        ProductClient.ProductResponse product =
//                productClient.getProductById(request.getProductId());
//
//        OrderItem item = OrderItem.builder()
//        	    .productId(product.getId())
//        	    .productName(product.getName())
//        	    .price(product.getPrice())
//        	    .quantity(request.getQuantity())
//        	    .lineTotal(product.getPrice() * request.getQuantity())
//        	    .order(order)
//        	    .build();
//
//
//        order.getItems().add(item);
//        order.setTotalAmount(order.getTotalAmount() + item.getLineTotal());
//
//        orderRepository.save(order);
//        return map(order);
//    }
    @Transactional
    @Override
    public OrderResponseDto addItem(Long orderId, OrderItemRequestDto request) {

        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

//        ProductClient.ProductResponse product =
//                productClient.getProductById(request.getProductId());
        ProductClient.ProductResponse product =
                productClient.getProductById(request.getProductId()).getData();

        if (product == null || product.getId() == null) {
            throw new RuntimeException("Product not found or unavailable");
        }

        OrderItem item = OrderItem.builder()
                .productId(product.getId())
                .productName(product.getName())
                .price(product.getPrice())
                .quantity(request.getQuantity())
                .lineTotal(product.getPrice() * request.getQuantity())
                .order(order)
                .build();

        // ✅ SAFE because list is initialized
        order.getItems().add(item);

        // ✅ MISSING LINE (THIS WAS THE BUG)
        order.setTotalAmount(order.getTotalAmount() + item.getLineTotal());

        // ✅ SAVE
        orderRepository.saveAndFlush(order);

        // ✅ RELOAD (safe mapping)
        Order savedOrder = orderRepository.findByIdWithItems(order.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        return map(savedOrder);
    }



    @Transactional
    @Override
    public OrderResponseDto removeItem(Long orderId, Long itemId) {

        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        OrderItem item = order.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        // ✅ 1. Update total
        order.setTotalAmount(order.getTotalAmount() - item.getLineTotal());

        // ✅ 2. REMOVE FROM COLLECTION (MOST IMPORTANT)
        order.getItems().remove(item);

        // ✅ 3. Save order (orphanRemoval=true deletes item)
        orderRepository.save(order);

        // ✅ 4. Reload fresh data
        Order savedOrder = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        return map(savedOrder);
    }



    @Override
    public OrderResponseDto getOrderById(Long id) {

        Order order = orderRepository.findByIdWithItems(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        return map(order);
    }


    @Override
    public List<OrderResponseDto> getOrdersByUser(String username) {

        return orderRepository.findByUsernameWithItems(username)
                .stream()
                .map(this::map)
                .toList();
    }



    @Override
    public void cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }

    private OrderResponseDto map(Order order) {
        return OrderResponseDto.builder()
                .id(order.getId())
                .username(order.getUsername())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .items(order.getItems() == null ? List.of() :
                        order.getItems().stream().map(i ->
                                OrderItemResponseDto.builder()
                                        .id(i.getId())
                                        .productId(i.getProductId())
                                        .productName(i.getProductName())
                                        .price(i.getPrice())
                                        .quantity(i.getQuantity())
                                        .lineTotal(i.getLineTotal())
                                        .build()
                        ).toList())
                .build();
    }
    @Override
    public List<OrderResponseDto> getAllOrders() {

        return orderRepository.findAllWithItems()
                .stream()
                .map(this::map)
                .toList();
    }
}
