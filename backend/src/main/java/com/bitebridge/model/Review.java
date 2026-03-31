package com.bitebridge.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    private String id;
    
    private String customerId;
    private String restaurantId;
    private String orderId;
    
    private int rating;
    private String comment;
    private List<String> images;
    
    private String reply;
    
    private LocalDateTime createdAt;
}
