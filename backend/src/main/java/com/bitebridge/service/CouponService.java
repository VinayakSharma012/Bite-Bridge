package com.bitebridge.service;

import com.bitebridge.exception.ResourceNotFoundException;
import com.bitebridge.model.Coupon;
import com.bitebridge.repository.CouponRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.logging.Logger;

@Service
public class CouponService {
    private static final Logger logger = Logger.getLogger(CouponService.class.getName());
    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    public Coupon getCouponById(String id) {
        logger.info("Fetching coupon with id: " + id);
        return couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));
    }

    public Coupon getCouponByCode(String code) {
        logger.info("Fetching coupon by code: " + code);
        return couponRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with code: " + code));
    }

    public List<Coupon> getAllCoupons() {
        logger.info("Fetching all coupons");
        return couponRepository.findAll();
    }

    public List<Coupon> getActiveCoupons() {
        logger.info("Fetching active coupons");
        return couponRepository.findAll();
    }

    public List<Coupon> getCouponsByRestaurant(String restaurantId) {
        logger.info("Fetching coupons for restaurant: " + restaurantId);
        return couponRepository.findAll();
    }

    public Coupon createCoupon(Coupon coupon) {
        logger.info("Creating new coupon");
        return couponRepository.save(coupon);
    }

    public Coupon updateCoupon(String id, Coupon couponUpdates) {
        logger.info("Updating coupon with id: " + id);
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));
        return couponRepository.save(coupon);
    }

    public void deleteCoupon(String id) {
        logger.info("Deleting coupon with id: " + id);
        if (!couponRepository.existsById(id)) {
            throw new ResourceNotFoundException("Coupon not found with id: " + id);
        }
        couponRepository.deleteById(id);
    }

    public Coupon toggleCouponStatus(String id) {
        logger.info("Toggling coupon status for id: " + id);
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));
        return couponRepository.save(coupon);
    }

    public boolean validateCoupon(String code) {
        logger.info("Validating coupon with code: " + code);
        try {
            getCouponByCode(code);
            return true;
        } catch (ResourceNotFoundException e) {
            return false;
        }
    }

    public long getCouponCount() {
        logger.info("Getting total coupon count");
        return couponRepository.count();
    }
}
