//package com.retail.billing_service.client;
//
//import org.springframework.cloud.openfeign.FeignClient;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//
//@FeignClient(name = "order-service", url = "http://localhost:8082")
//public interface OrderClient {
//
//    @GetMapping("/api/orders/{id}")
//    OrderResponse getOrderById(@PathVariable Long id);
//
//    class OrderResponse {
//        private Long id;
//        private String username;
//        private double totalAmount;
//        private String status;
//
//        public Long getId() { return id; }
//        public String getUsername() { return username; }
//        public double getTotalAmount() { return totalAmount; }
//        public String getStatus() { return status; }
//    }
//}
package com.retail.billing_service.client;

import com.retail.billing_service.dto.response.ApiResponse;
import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "order-service", url = "http://localhost:8082")
public interface OrderClient {

    @GetMapping("/api/orders/{id}")
    ApiResponse<OrderResponse> getOrderById(@PathVariable Long id);

    @Data
    class OrderResponse {
        private Long id;
        private String username;
        private double totalAmount;
        private String status;
    }
}
