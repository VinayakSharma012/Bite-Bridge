package com.bitebridge.service;

import com.bitebridge.dto.request.CreateOrderRequest;
import com.bitebridge.dto.request.OrderItemRequest;
import com.bitebridge.model.Order;
import com.bitebridge.model.OrderItem;
import com.bitebridge.model.User;
import com.bitebridge.repository.OrderRepository;
import com.bitebridge.repository.UserRepository;
import com.bitebridge.utils.AppConstants;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class OrderService {

    private static final Logger logger = Logger.getLogger(OrderService.class.getName());

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public Order createOrder(CreateOrderRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : null;

        Optional<User> currentUser = email == null ? Optional.empty() : userRepository.findByEmail(email);
        String customerId = currentUser.map(User::getId).orElse("guest");

        Order order = new Order();
        order.setOrderNumber("ORD-" + System.currentTimeMillis());
        order.setCustomerId(customerId);
        order.setRestaurantId(request.getRestaurantId());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setStatus(AppConstants.ORDER_STATUS_OUT_FOR_DELIVERY);

        List<OrderItem> items = request.getItems().stream().map(this::toOrderItem).toList();
        order.setItems(items);

        double subtotal = items.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum();
        double taxAmount = Math.round(subtotal * 0.05 * 100.0) / 100.0;
        double deliveryFee = 30.0;
        double totalAmount = subtotal + taxAmount + deliveryFee;

        order.setSubtotal(subtotal);
        order.setTaxAmount(taxAmount);
        order.setDeliveryFee(deliveryFee);
        order.setDiscountAmount(0.0);
        order.setTotalAmount(totalAmount);

        order.setSpecialInstructions(request.getSpecialInstructions());
        order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(25));
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        logger.info("Creating order for customerId: " + customerId + " with items: " + items.size());
        return orderRepository.save(order);
    }

    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }

    public List<Order> getMyOrders() {
        String email = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : null;

        if (email == null) {
            return List.of();
        }

        String customerId = userRepository.findByEmail(email)
                .map(User::getId)
                .orElse("");

        if (customerId.isEmpty()) {
            return List.of();
        }

        return orderRepository.findByCustomerId(customerId).stream()
                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                .toList();
    }

    public List<Order> getOrdersByCustomer(String customerId) {
        return orderRepository.findByCustomerId(customerId).stream()
                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                .toList();
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll().stream()
                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                .toList();
    }

    public Order updateStatus(String orderId, String status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());

        if (AppConstants.ORDER_STATUS_DELIVERED.equalsIgnoreCase(status)) {
            order.setActualDeliveryTime(LocalDateTime.now());
        }

        return orderRepository.save(order);
    }

    public Order cancelOrder(String orderId) {
        return updateStatus(orderId, AppConstants.ORDER_STATUS_CANCELLED);
    }

    private OrderItem toOrderItem(OrderItemRequest itemRequest) {
        OrderItem item = new OrderItem();
        item.setMenuItemId(itemRequest.getMenuItemId());
        item.setName(itemRequest.getName());
        item.setPrice(itemRequest.getPrice());
        item.setQuantity(itemRequest.getQuantity());
        item.setCustomizations(List.of());
        return item;
    }
}
