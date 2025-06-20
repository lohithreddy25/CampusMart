package com.ecommerce.project.repositories;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ecommerce.project.model.Order;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find orders by user email with pagination
    Page<Order> findByEmailOrderByOrderDateDesc(String email, Pageable pageable);

    // Find orders by user email without pagination
    List<Order> findByEmailOrderByOrderDateDesc(String email);

    // Find orders by user email and order status
    @Query("SELECT o FROM Order o WHERE o.email = ?1 AND o.orderStatus = ?2 ORDER BY o.orderDate DESC")
    Page<Order> findByEmailAndOrderStatus(String email, String orderStatus, Pageable pageable);

    // Find orders by user ID with pagination
    @Query("SELECT o FROM Order o JOIN o.address a JOIN a.user u WHERE u.userId = ?1 ORDER BY o.orderDate DESC")
    Page<Order> findByUserIdOrderByOrderDateDesc(Long userId, Pageable pageable);

    // Find orders by user ID without pagination
    @Query("SELECT o FROM Order o JOIN o.address a JOIN a.user u WHERE u.userId = ?1 ORDER BY o.orderDate DESC")
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    // Find orders by user ID and order status
    @Query("SELECT o FROM Order o JOIN o.address a JOIN a.user u WHERE u.userId = ?1 AND o.orderStatus = ?2 ORDER BY o.orderDate DESC")
    Page<Order> findByUserIdAndOrderStatus(Long userId, String orderStatus, Pageable pageable);

}