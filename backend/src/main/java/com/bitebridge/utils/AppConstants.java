package com.bitebridge.utils;

public class AppConstants {
    // JWT Constants
    public static final String JWT_SECRET_KEY = "jwt.secret";
    public static final String JWT_EXPIRATION = "jwt.expiration";
    public static final long JWT_EXPIRATION_DEFAULT = 86400000; // 24 hours
    
    // Roles
    public static final String ROLE_CUSTOMER = "CUSTOMER";
    public static final String ROLE_RESTAURANT_OWNER = "RESTAURANT_OWNER";
    public static final String ROLE_DELIVERY_AGENT = "DELIVERY_AGENT";
    public static final String ROLE_ADMIN = "ADMIN";
    
    // Order Status
    public static final String ORDER_STATUS_PLACED = "PLACED";
    public static final String ORDER_STATUS_CONFIRMED = "CONFIRMED";
    public static final String ORDER_STATUS_PREPARING = "PREPARING";
    public static final String ORDER_STATUS_READY = "READY";
    public static final String ORDER_STATUS_PICKED_UP = "PICKED_UP";
    public static final String ORDER_STATUS_OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY";
    public static final String ORDER_STATUS_DELIVERED = "DELIVERED";
    public static final String ORDER_STATUS_CANCELLED = "CANCELLED";
    public static final String ORDER_STATUS_REFUNDED = "REFUNDED";
    
    // Pagination
    public static final int DEFAULT_PAGE = 0;
    public static final int DEFAULT_PAGE_SIZE = 20;
    
    // Email
    public static final String EMAIL_FROM = "noreply@bitebridge.com";
}
