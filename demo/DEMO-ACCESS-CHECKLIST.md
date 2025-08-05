# Demo Access Checklist

## Pre-Demo Setup ✅

### 1. Start Services
- [ ] Open Terminal 1
  ```bash
  cd backend
  npm run dev
  ```
  - Verify: "🚀 Quantivara Backend Server running on port 3001"

- [ ] Open Terminal 2
  ```bash
  # From project root
  npm run dev
  ```
  - Verify: "VITE ready at http://localhost:8080"

### 2. Access Demo
- [ ] Open browser to http://localhost:8080
- [ ] Enter password: `NmptGd3qAja?X7gY`
- [ ] Navigate to Demo Hub: http://localhost:8080/demo

## Demo Flow Checklist ✅

### Phase 1: ABHA ID Lookup (3 minutes)
- [ ] Go to http://localhost:8080/demo/abha-lookup
- [ ] Use test ID: `1234-5678-9012-34`
- [ ] Show 3-second retrieval
- [ ] Review patient profile tabs:
  - [ ] Critical Info
  - [ ] Medications
  - [ ] Recent Docs
  - [ ] Emergency Contact

### Phase 2: Document Processing (5 minutes)
- [ ] Navigate to http://localhost:8080/processor
- [ ] Check WebSocket status (top right)
- [ ] Click "⭐ Handwritten Rx" button
- [ ] Watch real-time processing
- [ ] Show 92%+ accuracy
- [ ] Try other document types

### Phase 3: Analytics Dashboard (3 minutes)
- [ ] Open http://localhost:8080/demo/analytics
- [ ] Verify "Live" indicator
- [ ] Show real-time metrics updating
- [ ] Switch tabs:
  - [ ] Operations
  - [ ] Network Effects
  - [ ] Revenue Stream
  - [ ] Performance

### Phase 4: Demo Control Panel (2 minutes)
- [ ] Return to http://localhost:8080/demo
- [ ] Use "Simulate Lab-Hospital Connection"
- [ ] Show revenue impact
- [ ] Review live statistics

## Quick Troubleshooting 🔧

### Backend Not Starting?
```bash
cd backend
pkill -f node
npm run dev
```

### Frontend Not Loading?
```bash
pkill -f "npm run dev"
npm run dev
```

### WebSocket Not Connecting?
- Check backend console for errors
- Refresh the page
- Verify both servers are running

## Key Talking Points 💡

1. **Speed**: "3-second emergency lookup saves lives"
2. **Accuracy**: "94%+ AI accuracy reduces medical errors"
3. **Scale**: "Processing 250+ documents daily"
4. **Network**: "Every new connection multiplies value"
5. **Revenue**: "₹5L+ monthly recurring revenue"

## Demo URLs Reference 🔗

```
Main Demo Hub:        http://localhost:8080/demo
ABHA Lookup:         http://localhost:8080/demo/abha-lookup
Analytics:           http://localhost:8080/demo/analytics
Document Processor:  http://localhost:8080/processor
Backend Health:      http://localhost:3001/health
```

## Post-Demo Cleanup 🧹

- [ ] Stop frontend server (Ctrl+C in Terminal 2)
- [ ] Stop backend server (Ctrl+C in Terminal 1)
- [ ] Optional: Reset demo data via control panel

---
**Remember**: Focus on the story, not just the technology!