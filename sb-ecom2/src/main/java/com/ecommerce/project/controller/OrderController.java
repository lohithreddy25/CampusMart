package com.ecommerce.project.controller;

import com.ecommerce.project.config.AppConstants;
import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.payload.CODOrderRequestDTO;
import com.ecommerce.project.payload.OrderDTO;
import com.ecommerce.project.payload.OrderRequestDTO;
import com.ecommerce.project.payload.OrderResponse;
import com.ecommerce.project.service.OrderService;
import com.ecommerce.project.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private AuthUtil authUtil;




    // Place order with Cash on Delivery (COD) payment method - Simplified endpoint
    @PostMapping("/order/users/cod")
    public ResponseEntity<OrderDTO> orderProductsCOD(@Valid @RequestBody CODOrderRequestDTO codOrderRequestDTO) {
        String emailId = authUtil.loggedInEmail();
        System.out.println("COD Order Request - Address ID: " + codOrderRequestDTO.getAddressId());

        // Validate that addressId is provided
        if (codOrderRequestDTO.getAddressId() == null) {
            throw new APIException("Address ID is required for placing an order");
        }

        // Use CASH_ON_DELIVERY as payment method (meets 4+ character validation requirement)
        String paymentMethod = "CASH_ON_DELIVERY";

        OrderDTO order = orderService.placeOrder(
                emailId,
                codOrderRequestDTO.getAddressId(),
                paymentMethod,
                "CASH_ON_DELIVERY", // pgName - Cash on Delivery
                "COD_" + System.currentTimeMillis(), // pgPaymentId - Generate unique COD ID
                "PENDING", // pgStatus - COD orders start as pending
                "Cash on Delivery - Payment will be collected upon delivery"
        );
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    // Place order with Cash on Delivery (COD) - Full DTO support for backward compatibility
    @PostMapping("/order/users/cod-full")
    public ResponseEntity<OrderDTO> orderProductsCODFull(@RequestBody OrderRequestDTO orderRequestDTO) {
        String emailId = authUtil.loggedInEmail();
        System.out.println("COD Order Request (Full DTO): " + orderRequestDTO);

        // Validate that addressId is provided
        if (orderRequestDTO.getAddressId() == null) {
            throw new APIException("Address ID is required for placing an order");
        }

        // Use CASH_ON_DELIVERY as payment method (meets 4+ character validation requirement)
        String paymentMethod = "CASH_ON_DELIVERY";

        OrderDTO order = orderService.placeOrder(
                emailId,
                orderRequestDTO.getAddressId(),
                paymentMethod,
                "CASH_ON_DELIVERY", // pgName - Cash on Delivery
                "COD_" + System.currentTimeMillis(), // pgPaymentId - Generate unique COD ID
                "PENDING", // pgStatus - COD orders start as pending
                "Cash on Delivery - Payment will be collected upon delivery"
        );
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    // Legacy endpoint for backward compatibility (redirects to COD)
    @PostMapping("/order/users/payments/{paymentMethod}")
    public ResponseEntity<OrderDTO> orderProducts(@PathVariable String paymentMethod, @RequestBody OrderRequestDTO orderRequestDTO) {
        String emailId = authUtil.loggedInEmail();
        System.out.println("orderRequestDTO DATA: " + orderRequestDTO);
        System.out.println("Payment method '" + paymentMethod + "' redirected to CASH_ON_DELIVERY as card payment is not implemented");

        // Validate that addressId is provided
        if (orderRequestDTO.getAddressId() == null) {
            throw new APIException("Address ID is required for placing an order");
        }

        // Force CASH_ON_DELIVERY payment method regardless of what's passed (meets 4+ character validation)
        String actualPaymentMethod = "CASH_ON_DELIVERY";

        OrderDTO order = orderService.placeOrder(
                emailId,
                orderRequestDTO.getAddressId(),
                actualPaymentMethod,
                "CASH_ON_DELIVERY", // pgName - Cash on Delivery
                "COD_" + System.currentTimeMillis(), // pgPaymentId - Generate unique COD ID
                "PENDING", // pgStatus - COD orders start as pending
                "Cash on Delivery - Payment will be collected upon delivery"
        );
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    // Get user's orders with pagination
    @GetMapping("/user/orders")
    public ResponseEntity<OrderResponse> getUserOrders(
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) Integer pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) Integer pageSize,
            @RequestParam(value = "sortBy", defaultValue = "orderDate", required = false) String sortBy,
            @RequestParam(value = "sortOrder", defaultValue = "desc", required = false) String sortOrder) {

        String email = authUtil.loggedInEmail();
        OrderResponse orderResponse = orderService.getUserOrders(email, pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(orderResponse, HttpStatus.OK);
    }

    // Get user's orders without pagination
    @GetMapping("/user/orders/all")
    public ResponseEntity<List<OrderDTO>> getUserOrdersList() {
        String email = authUtil.loggedInEmail();
        List<OrderDTO> orders = orderService.getUserOrdersList(email);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // Get user's orders by status
    @GetMapping("/user/orders/status/{orderStatus}")
    public ResponseEntity<OrderResponse> getUserOrdersByStatus(
            @PathVariable String orderStatus,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) Integer pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) Integer pageSize,
            @RequestParam(value = "sortBy", defaultValue = "orderDate", required = false) String sortBy,
            @RequestParam(value = "sortOrder", defaultValue = "desc", required = false) String sortOrder) {

        String email = authUtil.loggedInEmail();
        OrderResponse orderResponse = orderService.getUserOrdersByStatus(email, orderStatus, pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(orderResponse, HttpStatus.OK);
    }

    // ===== NEW ENDPOINTS FOR USER ID BASED QUERIES =====

    // Get orders by user ID with pagination
    @GetMapping("/orders/user/{userId}")
    public ResponseEntity<OrderResponse> getOrdersByUserId(
            @PathVariable Long userId,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) Integer pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) Integer pageSize,
            @RequestParam(value = "sortBy", defaultValue = "orderDate", required = false) String sortBy,
            @RequestParam(value = "sortOrder", defaultValue = "desc", required = false) String sortOrder) {

        OrderResponse orderResponse = orderService.getOrdersByUserId(userId, pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(orderResponse, HttpStatus.OK);
    }

    // Get orders by user ID without pagination
    @GetMapping("/orders/user/{userId}/all")
    public ResponseEntity<List<OrderDTO>> getOrdersListByUserId(@PathVariable Long userId) {
        List<OrderDTO> orders = orderService.getOrdersListByUserId(userId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // Get orders by user ID and status
    @GetMapping("/orders/user/{userId}/status/{orderStatus}")
    public ResponseEntity<OrderResponse> getOrdersByUserIdAndStatus(
            @PathVariable Long userId,
            @PathVariable String orderStatus,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) Integer pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) Integer pageSize,
            @RequestParam(value = "sortBy", defaultValue = "orderDate", required = false) String sortBy,
            @RequestParam(value = "sortOrder", defaultValue = "desc", required = false) String sortOrder) {

        OrderResponse orderResponse = orderService.getOrdersByUserIdAndStatus(userId, orderStatus, pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(orderResponse, HttpStatus.OK);
    }

}
