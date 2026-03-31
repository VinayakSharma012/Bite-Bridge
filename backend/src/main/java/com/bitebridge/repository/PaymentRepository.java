package com.bitebridge.repository;

import com.bitebridge.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByOrderId(String orderId);
    Optional<Payment> findByTransactionId(String transactionId);
}
