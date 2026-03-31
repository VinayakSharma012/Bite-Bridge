package com.bitebridge.controller;

import com.bitebridge.dto.response.ApiResponse;
import com.bitebridge.model.Review;
import com.bitebridge.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/reviews")
@Tag(name = "Reviews", description = "Review management endpoints")
public class ReviewController {

    private static final Logger logger = Logger.getLogger(ReviewController.class.getName());
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    @Operation(summary = "Get all reviews", description = "Retrieve all reviews")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Reviews retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<Review>>> getAllReviews() {
        logger.info("Get all reviews request");
        List<Review> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved successfully", reviews, 200));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get review by ID", description = "Retrieve review details by ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Review found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Review not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Review>> getReviewById(@PathVariable String id) {
        logger.info("Get review request for id: " + id);
        Review review = reviewService.getReviewById(id);
        return ResponseEntity.ok(ApiResponse.success("Review retrieved successfully", review, 200));
    }

    @GetMapping("/restaurant/{restaurantId}")
    @Operation(summary = "Get reviews by restaurant", description = "Retrieve all reviews for a restaurant")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Reviews retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<Review>>> getReviewsByRestaurant(@PathVariable String restaurantId) {
        logger.info("Get reviews by restaurant request for restaurantId: " + restaurantId);
        List<Review> reviews = reviewService.getReviewsByRestaurant(restaurantId);
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved successfully", reviews, 200));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get reviews by user", description = "Retrieve all reviews submitted by a user")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Reviews retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<Review>>> getReviewsByUser(@PathVariable String userId) {
        logger.info("Get reviews by user request for userId: " + userId);
        List<Review> reviews = reviewService.getReviewsByUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved successfully", reviews, 200));
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get reviews by order", description = "Retrieve reviews for a specific order")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Reviews retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<Review>>> getReviewsByOrder(@PathVariable String orderId) {
        logger.info("Get reviews by order request for orderId: " + orderId);
        List<Review> reviews = reviewService.getReviewsByOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved successfully", reviews, 200));
    }

    @PostMapping
    @Operation(summary = "Create review", description = "Create a new review")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Review created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Review>> createReview(@RequestBody Review review) {
        logger.info("Create review request");
        Review createdReview = reviewService.createReview(review);
        return ResponseEntity.ok(ApiResponse.success("Review created successfully", createdReview, 200));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update review", description = "Update review details")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Review updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Review not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Review>> updateReview(
            @PathVariable String id,
            @RequestBody Review reviewUpdates) {
        logger.info("Update review request for id: " + id);
        Review updatedReview = reviewService.updateReview(id, reviewUpdates);
        return ResponseEntity.ok(ApiResponse.success("Review updated successfully", updatedReview, 200));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete review", description = "Delete a review")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Review deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Review not found")
    })
    public ResponseEntity<Void> deleteReview(@PathVariable String id) {
        logger.info("Delete review request for id: " + id);
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    @Operation(summary = "Get total review count", description = "Retrieve total number of reviews")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Review count retrieved successfully")
    })
    public ResponseEntity<ApiResponse<Long>> getReviewCount() {
        logger.info("Get review count request");
        long count = reviewService.getReviewCount();
        return ResponseEntity.ok(ApiResponse.success("Review count retrieved successfully", count, 200));
    }

    @GetMapping("/restaurant/{restaurantId}/rating")
    @Operation(summary = "Get average rating for restaurant", description = "Calculate average rating for a restaurant")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Average rating retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Double>> getAverageRatingForRestaurant(@PathVariable String restaurantId) {
        logger.info("Get average rating for restaurant request for restaurantId: " + restaurantId);
        double rating = reviewService.getAverageRatingForRestaurant(restaurantId);
        return ResponseEntity.ok(ApiResponse.success("Average rating retrieved successfully", rating, 200));
    }
}
