package com.bitebridge.controller;

import com.bitebridge.dto.response.ApiResponse;
import com.bitebridge.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private static final Logger logger = Logger.getLogger(AnalyticsController.class.getName());

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardAnalytics() {
        logger.info("Dashboard analytics request received");
        Map<String, Object> analytics = analyticsService.getDashboardAnalytics();
        return ResponseEntity.ok(ApiResponse.success("Dashboard analytics retrieved successfully", analytics, 200));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOrderAnalytics(
            @RequestParam(value = "range", defaultValue = "month") String dateRange) {
        logger.info("Order analytics request for range: " + dateRange);
        Map<String, Object> analytics = analyticsService.getOrderAnalytics(dateRange);
        return ResponseEntity.ok(ApiResponse.success("Order analytics retrieved successfully", analytics, 200));
    }

    @GetMapping("/revenue")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRevenueAnalytics(
            @RequestParam(value = "range", defaultValue = "month") String dateRange) {
        logger.info("Revenue analytics request for range: " + dateRange);
        Map<String, Object> analytics = analyticsService.getRevenueAnalytics(dateRange);
        return ResponseEntity.ok(ApiResponse.success("Revenue analytics retrieved successfully", analytics, 200));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserAnalytics() {
        logger.info("User analytics request received");
        Map<String, Object> analytics = analyticsService.getUserAnalytics();
        return ResponseEntity.ok(ApiResponse.success("User analytics retrieved successfully", analytics, 200));
    }

    @GetMapping("/restaurants")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRestaurantAnalytics() {
        logger.info("Restaurant analytics request received");
        Map<String, Object> analytics = analyticsService.getRestaurantAnalytics();
        return ResponseEntity.ok(ApiResponse.success("Restaurant analytics retrieved successfully", analytics, 200));
    }

    @GetMapping("/delivery")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDeliveryAnalytics() {
        logger.info("Delivery analytics request received");
        Map<String, Object> analytics = analyticsService.getDeliveryAnalytics();
        return ResponseEntity.ok(ApiResponse.success("Delivery analytics retrieved successfully", analytics, 200));
    }
}
