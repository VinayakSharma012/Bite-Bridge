package com.bitebridge.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {
    @Id
    private String id;
    
    private String code;
    private String description;
    private String discountType; // PERCENTAGE, FLAT
    private double discountValue;
    private double maxDiscountAmount;
    private double minOrderAmount;
    
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    
    private int usageLimit;
    private int usedCount;
    private boolean active;
    
    private List<String> applicableRestaurantIds;
}
