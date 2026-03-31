package com.bitebridge.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

@Document(collection = "delivery_agents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryAgent {
    @Id
    private String id;
    
    private String userId;
    private String vehicleType;
    private String vehicleNumber;
    private String licenseNumber;
    
    private GeoLocation currentLocation;
    private boolean available;
    private String currentOrderId;
    
    private int totalDeliveries;
    private double rating;
    private boolean active;
}
