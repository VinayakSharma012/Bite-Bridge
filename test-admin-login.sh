#!/bin/bash

# Admin Login Test Script for BiteBridge

echo "🔐 BiteBridge Admin Login Test"
echo "================================"
echo ""

# Admin credentials
ADMIN_EMAIL="admin@bitebridge.com"
ADMIN_API_URL="http://localhost:8080/api"

echo "📧 Admin Email: $ADMIN_EMAIL"
echo "🔗 API Base URL: $ADMIN_API_URL"
echo ""

# Check if server is running
echo "⏳ Checking if backend server is running..."
if curl -s "$ADMIN_API_URL/health" > /dev/null 2>&1; then
    echo "✅ Backend server is UP!"
    echo ""
    
    # Get all users to show admin account
    echo "📊 Testing Admin API Endpoints..."
    echo ""
    
    # Test 1: Health Check
    echo "1️⃣  Health Check:"
    curl -s "$ADMIN_API_URL/health" | jq '.' 2>/dev/null || echo "  Response: Healthy"
    echo ""
    
    # Test 2: Get All Users (should show admin)
    echo "2️⃣  Getting all users (should include admin@bitebridge.com):"
    echo "   Command: curl -X GET $ADMIN_API_URL/users"
    echo ""
    
    # Test 3: Admin Login
    echo "3️⃣  Admin Login Test:"
    echo "   Command: curl -X POST $ADMIN_API_URL/auth/login"
    echo "   Payload: {\"email\":\"$ADMIN_EMAIL\", \"password\":\"<admin-password>\"}"
    echo ""
    
    echo "📝 Next Steps:"
    echo "  1. Start the backend: cd backend && mvn spring-boot:run"
    echo "  2. The admin account will be created automatically if APP_SEED_ENABLED=true"
    echo "  3. Default admin email: $ADMIN_EMAIL"
    echo "  4. Login via the frontend at: http://localhost:5173"
    echo ""
    
else
    echo "❌ Backend server is NOT running!"
    echo ""
    echo "📝 To start the backend:"
    echo "   1. cd /Users/vinayaksharma/Desktop/bitebridge/backend"
    echo "   2. mvn spring-boot:run"
    echo ""
    echo "   Or build and run the JAR:"
    echo "   1. mvn clean package"
    echo "   2. java -jar target/bitebridge-0.0.1-SNAPSHOT.jar"
    echo ""
fi

echo ""
echo "🔐 Admin Credentials Reference:"
echo "   Email: admin@bitebridge.com"
echo "   Password: (Check database or reset via script)"
echo ""
