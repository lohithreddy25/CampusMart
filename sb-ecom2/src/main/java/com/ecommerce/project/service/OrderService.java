package com.ecommerce.project.service;

import com.ecommerce.project.payload.OrderDTO;
import com.ecommerce.project.payload.OrderResponse;
import jakarta.transaction.Transactional;

import java.util.List;

public interface OrderService {
    @Transactional
    OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage);

    // Get user's orders with pagination (by email - for current user)
    OrderResponse getUserOrders(String email, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    // Get user's orders without pagination (by email - for current user)
    List<OrderDTO> getUserOrdersList(String email);

    // Get user's orders by status (by email - for current user)
    OrderResponse getUserOrdersByStatus(String email, String orderStatus, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    // Get orders by user ID with pagination (for admin or specific user access)
    OrderResponse getOrdersByUserId(Long userId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    // Get orders by user ID without pagination (for admin or specific user access)
    List<OrderDTO> getOrdersListByUserId(Long userId);

    // Get orders by user ID and status (for admin or specific user access)
    OrderResponse getOrdersByUserIdAndStatus(Long userId, String orderStatus, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
}
