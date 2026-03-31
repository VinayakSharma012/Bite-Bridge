package com.bitebridge.repository;

import com.bitebridge.model.Restaurant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends MongoRepository<Restaurant, String> {
    List<Restaurant> findByOwnerId(String ownerId);
    List<Restaurant> findByApprovedFalse();
    List<Restaurant> findByCuisineTypesIn(List<String> cuisines);
}
