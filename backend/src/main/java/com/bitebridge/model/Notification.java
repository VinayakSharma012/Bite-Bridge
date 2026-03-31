package com.bitebridge.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    private String id;
    
    private String userId;
    private String type; // ORDER_UPDATE, PROMO, SYSTEM
    private String title;
    private String message;
    
    private boolean read;
    private String relatedOrderId;
    
    private LocalDateTime createdAt;
}
