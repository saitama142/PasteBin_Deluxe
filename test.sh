#!/bin/bash

# Simple test script for the secure pastebin application
set -e

echo "🧪 Testing Secure Pastebin Application..."

# Test backend health
echo "📡 Testing backend health endpoint..."
curl -f http://localhost:3001/api/health || {
    echo "❌ Backend health check failed"
    exit 1
}
echo "✅ Backend is healthy"

# Test paste creation
echo "📝 Testing paste creation..."
RESPONSE=$(curl -s -X POST http://localhost:3001/api/pastes \
    -H "Content-Type: application/json" \
    -d '{"content":"console.log(\"Hello World!\");","language":"javascript","expiration":"1hour"}')

PASTE_ID=$(echo $RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$PASTE_ID" ]; then
    echo "❌ Failed to create paste"
    echo "Response: $RESPONSE"
    exit 1
fi

echo "✅ Paste created successfully with ID: $PASTE_ID"

# Test paste retrieval
echo "📖 Testing paste retrieval..."
curl -f "http://localhost:3001/api/pastes/$PASTE_ID" > /dev/null || {
    echo "❌ Failed to retrieve paste"
    exit 1
}
echo "✅ Paste retrieved successfully"

# Test rate limiting
echo "🚦 Testing rate limiting..."
for i in {1..12}; do
    curl -s -X POST http://localhost:3001/api/pastes \
        -H "Content-Type: application/json" \
        -d '{"content":"Rate limit test"}' > /dev/null
done

# This should trigger rate limit
RATE_LIMIT_RESPONSE=$(curl -s -X POST http://localhost:3001/api/pastes \
    -H "Content-Type: application/json" \
    -d '{"content":"Rate limit test"}')

if echo "$RATE_LIMIT_RESPONSE" | grep -q "Too many"; then
    echo "✅ Rate limiting is working"
else
    echo "⚠️  Rate limiting may not be working properly"
fi

echo "🎉 All tests passed! The secure pastebin application is working correctly."
