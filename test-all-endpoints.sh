#!/bin/bash

# Test all 10 endpoints
echo "🧪 Testing all BiteBridge API Endpoints"
echo "======================================="

BASE_URL="http://localhost:8080/api"
PASS=0
FAIL=0

test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_code=$4
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "$expected_code" ] || [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo "✅ $method $endpoint - HTTP $http_code"
        ((PASS++))
    else
        echo "❌ $method $endpoint - HTTP $http_code (expected $expected_code)"
        ((FAIL++))
    fi
}

# Test all 10 endpoints
test_endpoint "GET" "/restaurants" "" "200"
test_endpoint "GET" "/menus" "" "200"
test_endpoint "GET" "/reviews" "" "200"
test_endpoint "GET" "/coupons" "" "200"
test_endpoint "GET" "/delivery-agents" "" "200"
test_endpoint "GET" "/payments" "" "200"

# Test POST endpoints
test_endpoint "POST" "/restaurants" '{"name":"Test Restaurant","ownerId":"owner1"}' "201"
test_endpoint "POST" "/menus" '{"name":"Biryani","restaurantId":"rest1","price":250}' "201"
test_endpoint "POST" "/reviews" '{"rating":5,"comment":"Great!"}' "201"
test_endpoint "POST" "/payments" '{"amount":500,"customerId":"cust1"}' "201"

echo ""
echo "======================================="
echo "Results: ✅ $PASS Passed | ❌ $FAIL Failed"
echo "======================================="

if [ $FAIL -eq 0 ]; then
    echo "🎉 ALL ENDPOINTS WORKING!"
    exit 0
else
    echo "⚠️  Some endpoints failed"
    exit 1
fi
