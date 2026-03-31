package com.bitebridge.controller;

import com.bitebridge.dto.response.ApiResponse;
import com.bitebridge.model.Coupon;
import com.bitebridge.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/coupons")
@Tag(name = "Coupons", description = "Coupon management endpoints")
public class CouponController {

    private static final Logger logger = Logger.getLogger(CouponController.class.getName());
    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @GetMapping
    @Operation(summary = "Get all coupons", description = "Retrieve all coupons")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Coupons retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<Coupon>>> getAllCoupons() {
        logger.info("Get all coupons request");
        List<Coupon> coupons = couponService.getAllCoupons();
        return ResponseEntity.ok(ApiResponse.success("Coupons retrieved successfully", coupons, 200));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get coupon by ID", description = "Retrieve coupon details by ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Coupon found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Coupon not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Coupon>> getCouponById(@PathVariable String id) {
        logger.info("Get coupon request for id: " + id);
        Coupon coupon = couponService.getCouponById(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon retrieved successfully", coupon, 200));
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get coupon by code", description = "Retrieve coupon by its code")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Coupon found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Coupon not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Coupon>> getCouponByCode(@PathVariable String code) {
        logger.info("Get coupon by code request for code: " + code);
        Coupon coupon = couponService.getCouponByCode(code);
        return ResponseEntity.ok(ApiResponse.success("Coupon retrieved successfully", coupon, 200));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active coupons", description = "Retrieve all active coupons")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Active coupons retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<Coupon>>> getActiveCoupons() {
        logger.info("Get active coupons request");
        List<Coupon> coupons = couponService.getActiveCoupons();
        return ResponseEntity.ok(ApiResponse.success("Active coupons retrieved successfully", coupons, 200));
    }

    @PostMapping
    @Operation(summary = "Create coupon", description = "Create a new coupon")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Coupon created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Coupon>> createCoupon(@RequestBody Coupon coupon) {
        logger.info("Create coupon request");
        Coupon createdCoupon = couponService.createCoupon(coupon);
        return ResponseEntity.ok(ApiResponse.success("Coupon created successfully", createdCoupon, 200));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update coupon", description = "Update coupon details")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Coupon updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Coupon not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Coupon>> updateCoupon(
            @PathVariable String id,
            @RequestBody Coupon couponUpdates) {
        logger.info("Update coupon request for id: " + id);
        Coupon updatedCoupon = couponService.updateCoupon(id, couponUpdates);
        return ResponseEntity.ok(ApiResponse.success("Coupon updated successfully", updatedCoupon, 200));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete coupon", description = "Delete a coupon")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Coupon deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Coupon not found")
    })
    public ResponseEntity<Void> deleteCoupon(@PathVariable String id) {
        logger.info("Delete coupon request for id: " + id);
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/toggle-status")
    @Operation(summary = "Toggle coupon status", description = "Enable or disable a coupon")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Coupon status toggled successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Coupon not found")
    })
    public ResponseEntity<ApiResponse<Coupon>> toggleCouponStatus(@PathVariable String id) {
        logger.info("Toggle coupon status request for id: " + id);
        Coupon updatedCoupon = couponService.toggleCouponStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon status toggled successfully", updatedCoupon, 200));
    }

    @PostMapping("/validate/{code}")
    @Operation(summary = "Validate coupon", description = "Check if a coupon code is valid")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Coupon validation result returned"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Boolean>> validateCoupon(@PathVariable String code) {
        logger.info("Validate coupon request for code: " + code);
        boolean isValid = couponService.validateCoupon(code);
        return ResponseEntity.ok(ApiResponse.success("Coupon validation result", isValid, 200));
    }

    @GetMapping("/count")
    @Operation(summary = "Get total coupon count", description = "Retrieve total number of coupons")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Coupon count retrieved successfully")
    })
    public ResponseEntity<ApiResponse<Long>> getCouponCount() {
        logger.info("Get coupon count request");
        long count = couponService.getCouponCount();
        return ResponseEntity.ok(ApiResponse.success("Coupon count retrieved successfully", count, 200));
    }
}
