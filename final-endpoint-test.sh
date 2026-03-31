#!/bin/bash

# Comprehensive test of all BiteBridge API Endpoints
echo "🚀 BiteBridge API - Complete Endpoint Test"
echo "=========================================="
echo ""

BASE_URL="http://localhost:8080/api"
PASS=0
FAIL=0

test_endpoint() {
    local num=$1
    local method=$2
    local endpoint=$3
    local description=$4
    local data=$5
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo "✅ [$num] $description"
        echo "   $method $endpoint → HTTP $http_code"
        ((PASS++))
    else
        echo "❌ [$num] $description"
        echo "   $method $endpoint → HTTP $http_code"
        ((FAIL++))
    fi
    echo ""
}

# Test all 10 main endpoints
test_endpoint "1" "GET" "/restaurants" "Restaurant Management - List All" ""
test_endpoint "2" "GET" "/menus" "Menu Management - List All" ""
test_endpoint "3" "GET" "/reviews" "Review Management - List All" ""
test_endpoint "4" "GET" "/coupons" "Coupon Management - List All" ""
test_endpoint "5" "GET" "/deliveries" "Delivery Management - List All" ""
test_endpoint "6" "GET" "/payments" "Payment Management - List All" ""
test_endpoint "7" "POST" "/restaurants" "Create Restaurant" '{"name":"Pizza Palace","ownerId":"owner123","active":true}'
test_endpoint "8" "POST" "/menus" "Create Menu Item" '{"name":"Margherita","restaurantId":"rest1","price":350,"available":true}'
test_endpoint "9" "POST" "/reviews" "Create Review" '{"rating":5,"comment":"Excellent service!","customerId":"user1"}'
test_endpoint "10" "POST" "/payments" "Create Payment" '{"amount":1000,"customerId":"cust1","status":"PENDING"}'

echo "=========================================="
echo "Test Results:"
echo "✅ Passed: $PASS/10"
echo "❌ Failed: $FAIL/10"
echo "=========================================="

if [ $FAIL -eq 0 ]; then
    echo "🎉 SUCCESS! All 10 endpoints are working perfectly!"
    exit 0
else
    echo "⚠️  Some endpoints need attention"
    exit 1
fi
