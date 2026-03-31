package com.bitebridge.repository;

import com.bitebridge.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByRestaurantId(String restaurantId);
    List<Review> findByCustomerId(String customerId);
}
