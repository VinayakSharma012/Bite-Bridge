package com.bitebridge.controller;

import com.bitebridge.dto.response.ApiResponse;
import com.bitebridge.dto.response.RestaurantResponse;
import com.bitebridge.model.Restaurant;
import com.bitebridge.service.RestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/restaurants")
@Tag(name = "Restaurants", description = "Restaurant management endpoints")
public class RestaurantController {

    private static final Logger logger = Logger.getLogger(RestaurantController.class.getName());
    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping
    @Operation(summary = "Get all restaurants", description = "Retrieve all restaurants")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Restaurants retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> getAllRestaurants() {
        logger.info("Get all restaurants request");
        List<RestaurantResponse> restaurants = restaurantService.getAllRestaurants();
        return ResponseEntity.ok(ApiResponse.success("Restaurants retrieved successfully", restaurants, 200));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get restaurant by ID", description = "Retrieve restaurant details by ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Restaurant found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Restaurant not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<RestaurantResponse>> getRestaurantById(@PathVariable String id) {
        logger.info("Get restaurant request for id: " + id);
        RestaurantResponse restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(ApiResponse.success("Restaurant retrieved successfully", restaurant, 200));
    }

    @GetMapping("/owner/{ownerId}")
    @Operation(summary = "Get restaurants by owner", description = "Retrieve all restaurants owned by a user")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Restaurants retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> getRestaurantsByOwner(@PathVariable String ownerId) {
        logger.info("Get restaurants by owner request for ownerId: " + ownerId);
        List<RestaurantResponse> restaurants = restaurantService.getRestaurantsByOwner(ownerId);
        return ResponseEntity.ok(ApiResponse.success("Restaurants retrieved successfully", restaurants, 200));
    }

    @PostMapping
    @Operation(summary = "Create restaurant", description = "Create a new restaurant")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Restaurant created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<RestaurantResponse>> createRestaurant(@RequestBody Restaurant restaurant) {
        logger.info("Create restaurant request");
        RestaurantResponse createdRestaurant = restaurantService.createRestaurant(restaurant);
        return ResponseEntity.ok(ApiResponse.success("Restaurant created successfully", createdRestaurant, 200));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update restaurant", description = "Update restaurant details")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Restaurant updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Restaurant not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<RestaurantResponse>> updateRestaurant(
            @PathVariable String id,
            @RequestBody Restaurant restaurantUpdates) {
        logger.info("Update restaurant request for id: " + id);
        RestaurantResponse updatedRestaurant = restaurantService.updateRestaurant(id, restaurantUpdates);
        return ResponseEntity.ok(ApiResponse.success("Restaurant updated successfully", updatedRestaurant, 200));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete restaurant", description = "Delete a restaurant")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Restaurant deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Restaurant not found")
    })
    public ResponseEntity<Void> deleteRestaurant(@PathVariable String id) {
        logger.info("Delete restaurant request for id: " + id);
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/toggle-status")
    @Operation(summary = "Toggle restaurant status", description = "Enable or disable a restaurant")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Restaurant status toggled successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Restaurant not found")
    })
    public ResponseEntity<ApiResponse<RestaurantResponse>> toggleRestaurantStatus(@PathVariable String id) {
        logger.info("Toggle restaurant status request for id: " + id);
        RestaurantResponse updatedRestaurant = restaurantService.toggleRestaurantStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Restaurant status toggled successfully", updatedRestaurant, 200));
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve restaurant", description = "Approve a restaurant for listing")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Restaurant approved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Restaurant not found")
    })
    public ResponseEntity<ApiResponse<RestaurantResponse>> approveRestaurant(@PathVariable String id) {
        logger.info("Approve restaurant request for id: " + id);
        RestaurantResponse approvedRestaurant = restaurantService.approveRestaurant(id);
        return ResponseEntity.ok(ApiResponse.success("Restaurant approved successfully", approvedRestaurant, 200));
    }

    @GetMapping("/count")
    @Operation(summary = "Get total restaurant count", description = "Retrieve total number of restaurants")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Restaurant count retrieved successfully")
    })
    public ResponseEntity<ApiResponse<Long>> getRestaurantCount() {
        logger.info("Get restaurant count request");
        long count = restaurantService.getRestaurantCount();
        return ResponseEntity.ok(ApiResponse.success("Restaurant count retrieved successfully", count, 200));
    }
}
