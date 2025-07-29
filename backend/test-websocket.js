const WebSocket = require('ws');

console.log('🏥 Quantivara WebSocket Test Client');
console.log('===================================');

const ws = new WebSocket('ws://localhost:3001/ws');

ws.on('open', function() {
    console.log('✅ Connected to Quantivara WebSocket server');
    
    // Start document processing demo
    setTimeout(() => {
        console.log('🚀 Starting document processing demo...');
        ws.send(JSON.stringify({
            type: 'start_document_processing',
            data: {
                patientId: '1',
                providerId: '1',
                documentType: 'prescription',
                fileName: 'test_prescription.pdf'
            }
        }));
    }, 1000);

    // Get live analytics
    setTimeout(() => {
        console.log('📊 Requesting live analytics...');
        ws.send(JSON.stringify({
            type: 'get_live_analytics'
        }));
    }, 2000);

    // Subscribe to updates
    setTimeout(() => {
        console.log('📡 Subscribing to live updates...');
        ws.send(JSON.stringify({
            type: 'subscribe_to_updates',
            data: {
                subscriptionType: 'processing_queue'
            }
        }));
    }, 3000);
});

ws.on('message', function(data) {
    const message = JSON.parse(data);
    const timestamp = new Date().toLocaleTimeString();
    
    console.log(`\n[${timestamp}] 📨 Received: ${message.type}`);
    
    switch(message.type) {
        case 'connection_established':
            console.log(`🔗 Session ID: ${message.data.sessionId}`);
            console.log(`💬 Message: ${message.data.message}`);
            break;
            
        case 'document_processing_update':
            console.log(`📄 Status: ${message.data.status.toUpperCase()} (${message.data.progress}%)`);
            console.log(`💬 Message: ${message.data.message}`);
            if (message.data.accuracy) {
                console.log(`🎯 Accuracy: ${message.data.accuracy}%`);
            }
            if (message.data.processingTime) {
                console.log(`⏱️  Processing Time: ${message.data.processingTime}ms`);
            }
            break;
            
        case 'live_analytics_update':
            console.log('📊 Live Analytics:');
            console.log(`   - Currently Processing: ${message.data.currentlyProcessing}`);
            console.log(`   - Completed Today: ${message.data.completedToday}`);
            console.log(`   - Average Accuracy: ${message.data.averageAccuracy}`);
            console.log(`   - Daily Revenue: ${message.data.dailyRevenue}`);
            console.log(`   - Server Load: ${(message.data.serverLoad * 100).toFixed(1)}%`);
            break;
            
        case 'processing_queue_update':
            console.log('🔄 Queue Update:');
            console.log(`   - Queue Length: ${message.data.queueLength || 'N/A'}`);
            console.log(`   - Processing Rate: ${message.data.processingRate || 'N/A'}`);
            console.log(`   - System Load: ${message.data.systemLoad || 'N/A'}`);
            break;
            
        case 'network_update':
            console.log('🌐 Network Update:');
            console.log(`   - Total Connections: ${message.data.totalConnections}`);
            console.log(`   - Active Transfers: ${message.data.activeTransfers}`);
            break;
            
        case 'revenue_update':
            console.log('💰 Revenue Update:');
            console.log(`   - Realtime Revenue: ${message.data.realtimeRevenue}`);
            console.log(`   - Monthly Projection: ${message.data.monthlyProjection}`);
            break;
            
        default:
            console.log(`📄 Data: ${JSON.stringify(message.data, null, 2)}`);
    }
});

ws.on('close', function() {
    console.log('\n❌ Disconnected from WebSocket server');
    process.exit(0);
});

ws.on('error', function(error) {
    console.error(`❌ WebSocket error: ${error.message}`);
    process.exit(1);
});

// Keep the connection alive and exit after 30 seconds
setTimeout(() => {
    console.log('\n🏁 Demo completed, closing connection...');
    ws.close();
}, 30000);

console.log('\n⏳ Connecting to ws://localhost:3001/ws...');
console.log('   (Demo will run for 30 seconds)');