package com.bitebridge.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "restaurants")
public class Restaurant {
    @Id
    private String id;
    
    private String ownerId;
    private String name;
    private String description;
    private List<String> cuisineTypes;
    
    private Address address;
    private String coverImageUrl;
    private String logoUrl;
    
    private double rating;
    private int totalReviews;
    
    private Map<String, TimeSlot> openingHours;
    private double deliveryRadius;
    private double minOrderAmount;
    private double deliveryFee;
    private int avgDeliveryTime;
    
    private boolean active;
    private boolean approved;
    
    private List<String> tags;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Restaurant() {
    }

    public Restaurant(String id, String ownerId, String name, String description, List<String> cuisineTypes,
                      Address address, String coverImageUrl, String logoUrl, double rating, int totalReviews,
                      Map<String, TimeSlot> openingHours, double deliveryRadius, double minOrderAmount,
                      double deliveryFee, int avgDeliveryTime, boolean active, boolean approved,
                      List<String> tags, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
        this.description = description;
        this.cuisineTypes = cuisineTypes;
        this.address = address;
        this.coverImageUrl = coverImageUrl;
        this.logoUrl = logoUrl;
        this.rating = rating;
        this.totalReviews = totalReviews;
        this.openingHours = openingHours;
        this.deliveryRadius = deliveryRadius;
        this.minOrderAmount = minOrderAmount;
        this.deliveryFee = deliveryFee;
        this.avgDeliveryTime = avgDeliveryTime;
        this.active = active;
        this.approved = approved;
        this.tags = tags;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getCuisineTypes() { return cuisineTypes; }
    public void setCuisineTypes(List<String> cuisineTypes) { this.cuisineTypes = cuisineTypes; }
    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public int getTotalReviews() { return totalReviews; }
    public void setTotalReviews(int totalReviews) { this.totalReviews = totalReviews; }
    public Map<String, TimeSlot> getOpeningHours() { return openingHours; }
    public void setOpeningHours(Map<String, TimeSlot> openingHours) { this.openingHours = openingHours; }
    public double getDeliveryRadius() { return deliveryRadius; }
    public void setDeliveryRadius(double deliveryRadius) { this.deliveryRadius = deliveryRadius; }
    public double getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(double minOrderAmount) { this.minOrderAmount = minOrderAmount; }
    public double getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(double deliveryFee) { this.deliveryFee = deliveryFee; }
    public int getAvgDeliveryTime() { return avgDeliveryTime; }
    public void setAvgDeliveryTime(int avgDeliveryTime) { this.avgDeliveryTime = avgDeliveryTime; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
