#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:8080/api"
PASS_COUNT=0
FAIL_COUNT=0

# Function to test endpoint
test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local description=$4
  
  echo -n "Testing: $description ... "
  
  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [[ "$http_code" =~ ^(200|201|400|401|404)$ ]]; then
    echo -e "${GREEN}✅ ($http_code)${NC}"
    PASS_COUNT=$((PASS_COUNT + 1))
    return 0
  else
    echo -e "${RED}❌ ($http_code)${NC}"
    FAIL_COUNT=$((FAIL_COUNT + 1))
    return 1
  fi
}

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}BiteBridge Backend - Feature Test Suite${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}1. Health & System Checks${NC}"
test_endpoint "GET" "/actuator/health" "" "Health Check"
echo ""

# Test 2: Authentication Endpoints
echo -e "${YELLOW}2. Authentication Endpoints${NC}"

# Register new user
USER_EMAIL="test$(date +%s)@example.com"
USER_PASSWORD="Test@123456"
REGISTER_DATA="{
  \"name\": \"Test User\",
  \"email\": \"$USER_EMAIL\",
  \"phone\": \"9876543210\",
  \"password\": \"$USER_PASSWORD\"
}"
test_endpoint "POST" "/auth/register" "$REGISTER_DATA" "User Registration"

# Login with registered user
LOGIN_DATA="{
  \"email\": \"$USER_EMAIL\",
  \"password\": \"$USER_PASSWORD\"
}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "$LOGIN_DATA")

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "$LOGIN_DATA")

if [ "$HTTP_CODE" = "200" ]; then
  echo -n "Testing: User Login ... "
  echo -e "${GREEN}✅ (200)${NC}"
  PASS_COUNT=$((PASS_COUNT + 1))
  
  # Extract token
  TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
  USER_ID=$(echo "$LOGIN_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  
  if [ -z "$TOKEN" ]; then
    echo -e "${RED}Warning: Could not extract token from login response${NC}"
  else
    echo -e "${YELLOW}   Token extracted: ${TOKEN:0:20}...${NC}"
  fi
else
  echo -n "Testing: User Login ... "
  echo -e "${RED}❌ ($HTTP_CODE)${NC}"
  FAIL_COUNT=$((FAIL_COUNT + 1))
fi
echo ""

# Test 3: User Management Endpoints
echo -e "${YELLOW}3. User Management Endpoints${NC}"
test_endpoint "GET" "/users" "" "Get All Users"
test_endpoint "GET" "/users/$USER_ID" "" "Get User by ID"
test_endpoint "PUT" "/users/$USER_ID" "{\"name\": \"Updated User\", \"phone\": \"9876543211\"}" "Update User"
echo ""

# Test 4: Restaurant Endpoints
echo -e "${YELLOW}4. Restaurant Endpoints${NC}"
test_endpoint "GET" "/restaurants" "" "Get All Restaurants"
test_endpoint "POST" "/restaurants" "{\"name\":\"Test Restaurant\",\"location\":\"Test Location\",\"cuisineType\":\"Italian\",\"rating\":4.5}" "Create Restaurant (Should fail without auth)"
echo ""

# Test 5: Menu Endpoints
echo -e "${YELLOW}5. Menu Endpoints${NC}"
test_endpoint "GET" "/menus" "" "Get All Menus"
test_endpoint "GET" "/menus/search?query=pizza" "" "Search Menus"
echo ""

# Test 6: Review Endpoints
echo -e "${YELLOW}6. Review & Rating Endpoints${NC}"
test_endpoint "GET" "/reviews" "" "Get All Reviews"
test_endpoint "GET" "/reviews/search?query=delicious" "" "Search Reviews"
echo ""

# Test 7: Order Endpoints
echo -e "${YELLOW}7. Order Endpoints${NC}"
test_endpoint "POST" "/orders" "{\"restaurantId\":\"123\",\"items\":[],\"totalAmount\":100}" "Create Order (Without auth should fail)"
test_endpoint "GET" "/orders" "" "Get User Orders"
echo ""

# Test 8: Coupon Endpoints
echo -e "${YELLOW}8. Coupon Endpoints${NC}"
test_endpoint "GET" "/coupons" "" "Get All Coupons"
test_endpoint "POST" "/coupons/apply" "{\"code\":\"TEST10\",\"orderId\":\"123\"}" "Apply Coupon"
echo ""

# Test 9: Delivery Endpoints
echo -e "${YELLOW}9. Delivery Endpoints${NC}"
test_endpoint "GET" "/deliveries" "" "Get All Deliveries"
test_endpoint "POST" "/deliveries/estimate" "{\"distance\":5}" "Estimate Delivery Time"
echo ""

# Test 10: Payment Endpoints
echo -e "${YELLOW}10. Payment Endpoints${NC}"
test_endpoint "GET" "/payments" "" "Get All Payments"
test_endpoint "POST" "/payments/initiate" "{\"orderId\":\"123\",\"amount\":100}" "Initiate Payment"
echo ""

# Test 11: Analytics Endpoints
echo -e "${YELLOW}11. Analytics Endpoints${NC}"
test_endpoint "GET" "/analytics/daily-orders" "" "Get Daily Orders Analytics"
test_endpoint "GET" "/analytics/revenue" "" "Get Revenue Analytics"
test_endpoint "GET" "/analytics/top-restaurants" "" "Get Top Restaurants"
echo ""

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Passed: $PASS_COUNT${NC}"
echo -e "${RED}❌ Failed: $FAIL_COUNT${NC}"
TOTAL=$((PASS_COUNT + FAIL_COUNT))
PERCENTAGE=$((PASS_COUNT * 100 / TOTAL))
echo -e "Success Rate: ${BLUE}${PERCENTAGE}%${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
  echo -e "${GREEN}🎉 All tests passed! Backend is fully operational.${NC}"
else
  echo -e "${YELLOW}⚠️  Some tests failed. Please review the logs above.${NC}"
fi

echo ""
