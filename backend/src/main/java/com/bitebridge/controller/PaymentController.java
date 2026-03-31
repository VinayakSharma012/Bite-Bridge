package com.bitebridge.controller;

import com.bitebridge.dto.response.ApiResponse;
import com.bitebridge.model.Payment;
import com.bitebridge.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/payments")
@Tag(name = "Payments", description = "Payment management endpoints")
public class PaymentController {

    private static final Logger logger = Logger.getLogger(PaymentController.class.getName());
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    @Operation(summary = "Get all payments", description = "Retrieve all payments")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Payments retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<Payment>>> getAllPayments() {
        logger.info("Get all payments request");
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", payments, 200));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get payment by ID", description = "Retrieve payment details by ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Payment found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Payment not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Payment>> getPaymentById(@PathVariable String id) {
        logger.info("Get payment request for id: " + id);
        Payment payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(ApiResponse.success("Payment retrieved successfully", payment, 200));
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get payments by order", description = "Retrieve all payments for an order")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Payments retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<Payment>>> getPaymentsByOrder(@PathVariable String orderId) {
        logger.info("Get payments by order request for orderId: " + orderId);
        List<Payment> payments = paymentService.getPaymentsByOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", payments, 200));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get payments by user", description = "Retrieve all payments made by a user")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Payments retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<Payment>>> getPaymentsByUser(@PathVariable String userId) {
        logger.info("Get payments by user request for userId: " + userId);
        List<Payment> payments = paymentService.getPaymentsByUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", payments, 200));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get payments by status", description = "Retrieve payments by status")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Payments retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<Payment>>> getPaymentsByStatus(@PathVariable String status) {
        logger.info("Get payments by status request for status: " + status);
        List<Payment> payments = paymentService.getPaymentsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", payments, 200));
    }

    @GetMapping("/successful")
    @Operation(summary = "Get successful payments", description = "Retrieve all successful payments")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successful payments retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<Payment>>> getSuccessfulPayments() {
        logger.info("Get successful payments request");
        List<Payment> payments = paymentService.getSuccessfulPayments();
        return ResponseEntity.ok(ApiResponse.success("Successful payments retrieved successfully", payments, 200));
    }

    @PostMapping
    @Operation(summary = "Create payment", description = "Create a new payment")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Payment created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Payment>> createPayment(@RequestBody Payment payment) {
        logger.info("Create payment request");
        Payment createdPayment = paymentService.createPayment(payment);
        return ResponseEntity.ok(ApiResponse.success("Payment created successfully", createdPayment, 200));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update payment status", description = "Update the status of a payment")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Payment status updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Payment not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Payment>> updatePaymentStatus(
            @PathVariable String id,
            @RequestParam String status) {
        logger.info("Update payment status request for id: " + id + " to: " + status);
        Payment updatedPayment = paymentService.updatePaymentStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Payment status updated successfully", updatedPayment, 200));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update payment", description = "Update payment details")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Payment updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Payment not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Payment>> updatePayment(
            @PathVariable String id,
            @RequestBody Payment paymentUpdates) {
        logger.info("Update payment request for id: " + id);
        Payment updatedPayment = paymentService.updatePayment(id, paymentUpdates);
        return ResponseEntity.ok(ApiResponse.success("Payment updated successfully", updatedPayment, 200));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete payment", description = "Delete a payment")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Payment deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Payment not found")
    })
    public ResponseEntity<Void> deletePayment(@PathVariable String id) {
        logger.info("Delete payment request for id: " + id);
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    @Operation(summary = "Get total payment count", description = "Retrieve total number of payments")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Payment count retrieved successfully")
    })
    public ResponseEntity<ApiResponse<Long>> getPaymentCount() {
        logger.info("Get payment count request");
        long count = paymentService.getPaymentCount();
        return ResponseEntity.ok(ApiResponse.success("Payment count retrieved successfully", count, 200));
    }

    @GetMapping("/successful/count")
    @Operation(summary = "Get successful payment count", description = "Retrieve total number of successful payments")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successful payment count retrieved successfully")
    })
    public ResponseEntity<ApiResponse<Long>> getSuccessfulPaymentCount() {
        logger.info("Get successful payment count request");
        long count = paymentService.getSuccessfulPaymentCount();
        return ResponseEntity.ok(ApiResponse.success("Successful payment count retrieved successfully", count, 200));
    }

    @GetMapping("/total-amount")
    @Operation(summary = "Get total payment amount", description = "Retrieve total amount from all successful payments")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Total payment amount retrieved successfully")
    })
    public ResponseEntity<ApiResponse<Double>> getTotalPaymentAmount() {
        logger.info("Get total payment amount request");
        double totalAmount = paymentService.getTotalPaymentAmount();
        return ResponseEntity.ok(ApiResponse.success("Total payment amount retrieved successfully", totalAmount, 200));
    }
}
