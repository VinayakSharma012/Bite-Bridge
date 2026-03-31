package com.bitebridge.service;

import com.bitebridge.dto.response.RestaurantResponse;
import com.bitebridge.exception.ResourceNotFoundException;
import com.bitebridge.model.Restaurant;
import com.bitebridge.model.TimeSlot;
import com.bitebridge.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class RestaurantService {
    private static final Logger logger = Logger.getLogger(RestaurantService.class.getName());
    private final RestaurantRepository restaurantRepository;

    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    public RestaurantResponse getRestaurantById(String id) {
        logger.info("Fetching restaurant with id: " + id);
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        return convertToResponse(restaurant);
    }

    public List<RestaurantResponse> getAllRestaurants() {
        logger.info("Fetching all restaurants");
        return restaurantRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<RestaurantResponse> getRestaurantsByOwner(String ownerId) {
        logger.info("Fetching restaurants by owner: " + ownerId);
        return restaurantRepository.findByOwnerId(ownerId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<RestaurantResponse> getRestaurantsByCuisine(String cuisineType) {
        logger.info("Fetching restaurants by cuisine: " + cuisineType);
        return restaurantRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public RestaurantResponse createRestaurant(Restaurant restaurant) {
        logger.info("Creating new restaurant");
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        return convertToResponse(savedRestaurant);
    }

    public RestaurantResponse updateRestaurant(String id, Restaurant restaurantUpdates) {
        logger.info("Updating restaurant with id: " + id);
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));

        if (restaurantUpdates.getName() != null) {
            restaurant.setName(restaurantUpdates.getName());
        }
        if (restaurantUpdates.getDescription() != null) {
            restaurant.setDescription(restaurantUpdates.getDescription());
        }
        if (restaurantUpdates.getCuisineTypes() != null && !restaurantUpdates.getCuisineTypes().isEmpty()) {
            restaurant.setCuisineTypes(restaurantUpdates.getCuisineTypes());
        }
        if (restaurantUpdates.getAddress() != null) {
            restaurant.setAddress(restaurantUpdates.getAddress());
        }
        if (restaurantUpdates.getCoverImageUrl() != null) {
            restaurant.setCoverImageUrl(restaurantUpdates.getCoverImageUrl());
        }
        if (restaurantUpdates.getLogoUrl() != null) {
            restaurant.setLogoUrl(restaurantUpdates.getLogoUrl());
        }
        if (restaurantUpdates.getOpeningHours() != null && !restaurantUpdates.getOpeningHours().isEmpty()) {
            restaurant.setOpeningHours(restaurantUpdates.getOpeningHours());
        }
        if (restaurantUpdates.getTags() != null && !restaurantUpdates.getTags().isEmpty()) {
            restaurant.setTags(restaurantUpdates.getTags());
        }
        if (restaurantUpdates.getMinOrderAmount() > 0) {
            restaurant.setMinOrderAmount(restaurantUpdates.getMinOrderAmount());
        }
        if (restaurantUpdates.getDeliveryFee() >= 0) {
            restaurant.setDeliveryFee(restaurantUpdates.getDeliveryFee());
        }
        if (restaurantUpdates.getAvgDeliveryTime() > 0) {
            restaurant.setAvgDeliveryTime(restaurantUpdates.getAvgDeliveryTime());
        }

        restaurant.setUpdatedAt(java.time.LocalDateTime.now());
        Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
        return convertToResponse(updatedRestaurant);
    }

    public void deleteRestaurant(String id) {
        logger.info("Deleting restaurant with id: " + id);
        if (!restaurantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Restaurant not found with id: " + id);
        }
        restaurantRepository.deleteById(id);
    }

    public RestaurantResponse toggleRestaurantStatus(String id) {
        logger.info("Toggling restaurant status for id: " + id);
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        restaurant.setActive(!restaurant.isActive());
        restaurant.setUpdatedAt(java.time.LocalDateTime.now());
        Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
        return convertToResponse(updatedRestaurant);
    }

    public RestaurantResponse approveRestaurant(String id) {
        logger.info("Approving restaurant with id: " + id);
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        restaurant.setApproved(true);
        restaurant.setActive(true);
        restaurant.setUpdatedAt(java.time.LocalDateTime.now());
        Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
        return convertToResponse(updatedRestaurant);
    }

    public long getRestaurantCount() {
        logger.info("Getting total restaurant count");
        return restaurantRepository.count();
    }

    private RestaurantResponse convertToResponse(Restaurant restaurant) {
        RestaurantResponse response = new RestaurantResponse();

        response.setId(restaurant.getId());
        response.setName(restaurant.getName());
        response.setDescription(restaurant.getDescription());
        response.setImageUrl(restaurant.getCoverImageUrl());
        response.setCoverImageUrl(restaurant.getCoverImageUrl());
        response.setCuisineTypes(restaurant.getCuisineTypes());
        response.setCuisineType(restaurant.getCuisineTypes() == null
                ? ""
                : String.join(", ", restaurant.getCuisineTypes()));

        if (restaurant.getAddress() != null) {
            response.setAddress(String.format("%s, %s", restaurant.getAddress().getStreet(), restaurant.getAddress().getCity()));
        }

        Map<String, TimeSlot> openingHours = restaurant.getOpeningHours();
        if (openingHours != null && openingHours.get("MON") != null) {
            TimeSlot monday = openingHours.get("MON");
            response.setOpeningTime(monday.getOpenTime());
            response.setClosingTime(monday.getCloseTime());
        }

        response.setDeliveryCharge(restaurant.getDeliveryFee());
        response.setDeliveryFee(restaurant.getDeliveryFee());
    response.setMinOrderAmount(restaurant.getMinOrderAmount());
        response.setMinimumOrderAmount(restaurant.getMinOrderAmount());
        response.setRating(restaurant.getRating());
        response.setDeliveryTime(restaurant.getAvgDeliveryTime());
        response.setOpen(restaurant.isActive() && restaurant.isApproved());
        response.setActive(restaurant.isActive());
        response.setCreatedAt(restaurant.getCreatedAt());
        response.setUpdatedAt(restaurant.getUpdatedAt());

        return response;
    }
}
