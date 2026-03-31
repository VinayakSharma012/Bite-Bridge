package com.bitebridge.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "menu_items")
public class MenuItem {
    @Id
    private String id;
    
    private String restaurantId;
    private String name;
    private String description;
    private String category;
    
    private double price;
    private double discountedPrice;
    private String imageUrl;
    
    private boolean vegetarian;
    private boolean vegan;
    private boolean available;
    
    private List<CustomizationGroup> customizations;
    private double rating;
    
    private LocalDateTime createdAt;

    public MenuItem() {
    }

    public MenuItem(String id, String restaurantId, String name, String description, String category,
                    double price, double discountedPrice, String imageUrl, boolean vegetarian,
                    boolean vegan, boolean available, List<CustomizationGroup> customizations,
                    double rating, LocalDateTime createdAt) {
        this.id = id;
        this.restaurantId = restaurantId;
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.discountedPrice = discountedPrice;
        this.imageUrl = imageUrl;
        this.vegetarian = vegetarian;
        this.vegan = vegan;
        this.available = available;
        this.customizations = customizations;
        this.rating = rating;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getRestaurantId() { return restaurantId; }
    public void setRestaurantId(String restaurantId) { this.restaurantId = restaurantId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public double getDiscountedPrice() { return discountedPrice; }
    public void setDiscountedPrice(double discountedPrice) { this.discountedPrice = discountedPrice; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public boolean isVegetarian() { return vegetarian; }
    public void setVegetarian(boolean vegetarian) { this.vegetarian = vegetarian; }
    public boolean isVegan() { return vegan; }
    public void setVegan(boolean vegan) { this.vegan = vegan; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public List<CustomizationGroup> getCustomizations() { return customizations; }
    public void setCustomizations(List<CustomizationGroup> customizations) { this.customizations = customizations; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
