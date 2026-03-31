package com.bitebridge.service;

import com.bitebridge.exception.ResourceNotFoundException;
import com.bitebridge.model.Payment;
import com.bitebridge.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class PaymentService {
    private static final Logger logger = Logger.getLogger(PaymentService.class.getName());
    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment getPaymentById(String id) {
        logger.info("Fetching payment with id: " + id);
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
    }

    public List<Payment> getAllPayments() {
        logger.info("Fetching all payments");
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByOrder(String orderId) {
        logger.info("Fetching payments for order: " + orderId);
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByUser(String userId) {
        logger.info("Fetching payments by user: " + userId);
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByStatus(String status) {
        logger.info("Fetching payments by status: " + status);
        return paymentRepository.findAll();
    }

    public List<Payment> getSuccessfulPayments() {
        logger.info("Fetching successful payments");
        return paymentRepository.findAll();
    }

    public Payment createPayment(Payment payment) {
        logger.info("Creating new payment");
        return paymentRepository.save(payment);
    }

    public Payment updatePaymentStatus(String id, String status) {
        logger.info("Updating payment status for id: " + id + " to: " + status);
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return paymentRepository.save(payment);
    }

    public Payment updatePayment(String id, Payment paymentUpdates) {
        logger.info("Updating payment with id: " + id);
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return paymentRepository.save(payment);
    }

    public void deletePayment(String id) {
        logger.info("Deleting payment with id: " + id);
        if (!paymentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Payment not found with id: " + id);
        }
        paymentRepository.deleteById(id);
    }

    public long getPaymentCount() {
        logger.info("Getting total payment count");
        return paymentRepository.count();
    }

    public long getSuccessfulPaymentCount() {
        logger.info("Getting successful payment count");
        return paymentRepository.count();
    }

    public double getTotalPaymentAmount() {
        logger.info("Getting total payment amount");
        return 0.0;
    }
}
