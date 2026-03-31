package com.bitebridge.controller;

import com.bitebridge.dto.request.CreateOrderRequest;
import com.bitebridge.dto.response.ApiResponse;
import com.bitebridge.model.Order;
import com.bitebridge.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private static final Logger logger = Logger.getLogger(OrderController.class.getName());

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        logger.info("Create order request received for restaurantId: " + request.getRestaurantId());
        Order created = orderService.createOrder(request);
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully", created, 200));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable String id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success("Order retrieved successfully", order, 200));
    }

    @GetMapping("/customer/my-orders")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders() {
        List<Order> orders = orderService.getMyOrders();
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders, 200));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<Order>>> getOrdersByCustomer(@PathVariable String customerId) {
        List<Order> orders = orderService.getOrdersByCustomer(customerId);
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders, 200));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders, 200));
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Map<String, String>>> getOrderStatus(@PathVariable String id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success("Order status retrieved successfully", Map.of("status", order.getStatus()), 200));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable String id,
            @RequestParam(value = "status", required = false) String status,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String resolvedStatus = status != null ? status : body != null ? body.get("status") : null;
        if (resolvedStatus == null || resolvedStatus.isBlank()) {
            throw new IllegalArgumentException("Status is required");
        }

        Order updated = orderService.updateStatus(id, resolvedStatus);
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", updated, 200));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Order>> cancelOrder(@PathVariable String id) {
        Order updated = orderService.cancelOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", updated, 200));
    }
}
