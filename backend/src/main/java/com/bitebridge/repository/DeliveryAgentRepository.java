package com.bitebridge.repository;

import com.bitebridge.model.DeliveryAgent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryAgentRepository extends MongoRepository<DeliveryAgent, String> {
    Optional<DeliveryAgent> findByUserId(String userId);
    Optional<DeliveryAgent> findByCurrentOrderId(String orderId);
}
