package com.bitebridge.repository;

import com.bitebridge.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByCustomerId(String customerId);
    List<Order> findByRestaurantId(String restaurantId);
    List<Order> findByDeliveryAgentId(String deliveryAgentId);
    List<Order> findByStatus(String status);
}
