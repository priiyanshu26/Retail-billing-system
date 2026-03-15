//package com.retail.order_service.repository;
//
//import com.retail.order_service.entity.Order;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.List;
//
//public interface OrderRepository extends JpaRepository<Order, Long> {
//
//    List<Order> findByUsername(String username);
//}
package com.retail.order_service.repository;

import com.retail.order_service.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // ✅ FIX: fetch items along with order
    @Query("""
        SELECT o FROM Order o
        LEFT JOIN FETCH o.items
        WHERE o.id = :id
    """)
    Optional<Order> findByIdWithItems(@Param("id") Long orderId);

    //List<Order> findByUsername(String username);
    @Query("""
            SELECT DISTINCT o FROM Order o
            LEFT JOIN FETCH o.items
            WHERE o.username = :username
        """)
        List<Order> findByUsernameWithItems(@Param("username") String username);
	

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items")
    List<Order> findAllWithItems();
	
}
