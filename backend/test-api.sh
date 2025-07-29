#!/bin/bash

# Quantivara Backend API Testing Script
# Make sure the server is running: npm run dev

echo "🏥 Testing Quantivara Backend APIs"
echo "=================================="

BASE_URL="http://localhost:3001/api/v1"

echo ""
echo "1. 🔍 Health Check"
echo "-------------------"
curl -s "$BASE_URL/../health" | jq '.'

echo ""
echo "2. 📊 Network Effects Analytics (Investor Demo)"
echo "------------------------------------------------"
curl -s "$BASE_URL/analytics/network-effects" | jq '.data.currentNetwork, .data.revenue.monthlyProjection'

echo ""
echo "3. 🏥 Emergency Patient Profile Lookup (3-second demo)"
echo "--------------------------------------------------------"
# Get a random ABHA ID from our seeded data
ABHA_ID="12345678901234"
curl -s "$BASE_URL/patients/$ABHA_ID/emergency-profile" | jq '.data.patient, .data.responseTime'

echo ""
echo "4. 🔬 Lab Analytics"
echo "-------------------"
curl -s "$BASE_URL/labs/1/analytics" | jq '.data | {labName, monthlyFeeINR, totalReports, hospitalConnections}'

echo ""
echo "5. 📄 Processing Queue Status"
echo "-----------------------------"
curl -s "$BASE_URL/processing/queue" | jq '.data | {queueLength, averageProcessingTime, systemLoad}'

echo ""
echo "6. 🔌 WebSocket Server Stats"
echo "----------------------------"
curl -s "$BASE_URL/processing/websocket/stats" | jq '.data | {totalConnections, endpoint, supportedEvents}'

echo ""
echo "7. 💰 Revenue Analytics"
echo "----------------------"
curl -s "$BASE_URL/analytics/revenue" | jq '.data.summary'

echo ""
echo "8. 📈 Dashboard Data (Real-time)"
echo "--------------------------------"
curl -s "$BASE_URL/analytics/dashboard" | jq '.data | {metrics, revenue.total}'

echo ""
echo "🎯 Test Document Processing Initiation"
echo "======================================="
curl -s -X POST "$BASE_URL/processing/initiate" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "1",
    "providerId": "1", 
    "documentType": "prescription",
    "fileName": "demo_prescription.pdf"
  }' | jq '.data | {documentId, status, websocketEndpoint}'

echo ""
echo "✅ API Testing Complete!"
echo "========================"
echo ""
echo "📋 Next Steps:"
echo "1. Open test-client.html in your browser for WebSocket demo"
echo "2. Connect to WebSocket and try document processing"
echo "3. View real-time analytics and processing updates"
echo ""
echo "🔗 WebSocket Endpoint: ws://localhost:3001/ws"
echo "🌐 Test Client: file://$(pwd)/test-client.html"