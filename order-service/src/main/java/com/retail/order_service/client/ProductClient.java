//package com.retail.order_service.client;
//
//import org.springframework.cloud.openfeign.FeignClient;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//
//@FeignClient(name = "product-service", url = "http://localhost:8083")
//public interface ProductClient {
//
//    @GetMapping("/api/products/{id}")
//    ProductResponse getProductById(@PathVariable("id") Long id);
//
//    // ✅ INNER RESPONSE TYPE (this is what you are missing)
//    class ProductResponse {
//        private Long id;
//        private String name;
//        private double price;
//        private int quantity;
//
//        public Long getId() { return id; }
//        public String getName() { return name; }
//        public double getPrice() { return price; }
//        public int getQuantity() { return quantity; }
//    }
//}
package com.retail.order_service.client;

import com.retail.order_service.dto.response.ApiResponse;
import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "product-service", url = "http://localhost:8083")
public interface ProductClient {

    @GetMapping("/api/products/{id}")
    ApiResponse<ProductResponse> getProductById(@PathVariable Long id);

    @Data
    class ProductResponse {
        private Long id;
        private String name;
        private double price;
        private int quantity;
    }
}
