#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

API_URL="http://localhost:8080/api"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}BiteBridge Backend - Feature Tests${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Test Health
echo -e "${YELLOW}[1] Health Check${NC}"
HEALTH=$(curl -s http://localhost:8080/api/actuator/health)
echo "Response: $HEALTH"
echo ""

# Test Restaurants
echo -e "${YELLOW}[2] Get All Restaurants${NC}"
echo "Endpoint: GET /api/restaurants"
RESTAURANTS=$(curl -s -w "\nHTTP: %{http_code}" http://localhost:8080/api/restaurants)
echo "$RESTAURANTS" | head -5
echo ""

# Test Users
echo -e "${YELLOW}[3] Get All Users${NC}"
echo "Endpoint: GET /api/users"
USERS=$(curl -s -w "\nHTTP: %{http_code}" http://localhost:8080/api/users)
echo "$USERS" | head -5
echo ""

# Test Menus
echo -e "${YELLOW}[4] Get All Menus${NC}"
echo "Endpoint: GET /api/menus"
MENUS=$(curl -s -w "\nHTTP: %{http_code}" http://localhost:8080/api/menus)
echo "$MENUS" | head -5
echo ""

# Test Reviews
echo -e "${YELLOW}[5] Get All Reviews${NC}"
echo "Endpoint: GET /api/reviews"
REVIEWS=$(curl -s -w "\nHTTP: %{http_code}" http://localhost:8080/api/reviews)
echo "$REVIEWS" | head -5
echo ""

# Register Test
echo -e "${YELLOW}[6] User Registration${NC}"
echo "Endpoint: POST /api/auth/register"
USER_EMAIL="test$(date +%s)@example.com"
REGISTER_PAYLOAD="{\"name\":\"Test User\",\"email\":\"$USER_EMAIL\",\"phone\":\"9876543210\",\"password\":\"Test@123456\"}"
REGISTER=$(curl -s -w "\nHTTP: %{http_code}" -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d "$REGISTER_PAYLOAD")
echo "$REGISTER" | tail -3
echo ""

# Login Test
echo -e "${YELLOW}[7] User Login${NC}"
echo "Endpoint: POST /api/auth/login"
LOGIN_PAYLOAD="{\"email\":\"$USER_EMAIL\",\"password\":\"Test@123456\"}"
LOGIN=$(curl -s -w "\nHTTP: %{http_code}" -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "$LOGIN_PAYLOAD")
echo "$LOGIN" | tail -3
echo ""

# More endpoints
echo -e "${YELLOW}[8] Get Coupons${NC}"
echo "Endpoint: GET /api/coupons"
COUPONS=$(curl -s -w "\nHTTP: %{http_code}" http://localhost:8080/api/coupons)
echo "$COUPONS" | tail -2
echo ""

echo -e "${YELLOW}[9] Get Deliveries${NC}"
echo "Endpoint: GET /api/deliveries"
DELIVERIES=$(curl -s -w "\nHTTP: %{http_code}" http://localhost:8080/api/deliveries)
echo "$DELIVERIES" | tail -2
echo ""

echo -e "${YELLOW}[10] Get Payments${NC}"
echo "Endpoint: GET /api/payments"
PAYMENTS=$(curl -s -w "\nHTTP: %{http_code}" http://localhost:8080/api/payments)
echo "$PAYMENTS" | tail -2
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Backend Testing Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
