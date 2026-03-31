package com.bitebridge.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Document(collection = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    private String id;
    
    private String orderId;
    private String customerId;
    private double amount;
    private String currency;
    
    private String method; // CARD, UPI, NET_BANKING, WALLET, COD
    private String status; // PENDING, SUCCESS, FAILED, REFUNDED
    
    private String transactionId;
    private String gatewayResponse;
    
    private LocalDateTime createdAt;
}
