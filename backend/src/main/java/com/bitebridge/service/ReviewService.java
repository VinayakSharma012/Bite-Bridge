package com.bitebridge.service;

import com.bitebridge.exception.ResourceNotFoundException;
import com.bitebridge.model.Review;
import com.bitebridge.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    private static final Logger logger = Logger.getLogger(ReviewService.class.getName());
    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public Review getReviewById(String id) {
        logger.info("Fetching review with id: " + id);
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
    }

    public List<Review> getAllReviews() {
        logger.info("Fetching all reviews");
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByRestaurant(String restaurantId) {
        logger.info("Fetching reviews for restaurant: " + restaurantId);
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByUser(String userId) {
        logger.info("Fetching reviews by user: " + userId);
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByOrder(String orderId) {
        logger.info("Fetching reviews for order: " + orderId);
        return reviewRepository.findAll();
    }

    public Review createReview(Review review) {
        logger.info("Creating new review");
        return reviewRepository.save(review);
    }

    public Review updateReview(String id, Review reviewUpdates) {
        logger.info("Updating review with id: " + id);
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        return reviewRepository.save(review);
    }

    public void deleteReview(String id) {
        logger.info("Deleting review with id: " + id);
        if (!reviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }

    public long getReviewCount() {
        logger.info("Getting total review count");
        return reviewRepository.count();
    }

    public double getAverageRatingForRestaurant(String restaurantId) {
        logger.info("Getting average rating for restaurant: " + restaurantId);
        return 0.0;
    }
}
