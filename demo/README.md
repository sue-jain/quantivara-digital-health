# 🏥 Quantivara Digital Health - Demo Resources

This folder contains all demo-related scripts, guides, and documentation for showcasing the Quantivara Digital Health platform.

## 📁 Contents

- **`run-demo.sh`** - Enhanced demo runner with error handling and monitoring
- **`start-demo.sh`** - Original simple demo startup script
- **`DEMO-GUIDE.md`** - Complete demo guide with investor pitch script
- **`DEMO-CREDENTIALS.md`** - Test data, ABHA IDs, and demo credentials
- **`DEMO-TESTING.md`** - Testing procedures and quality checks
- **`interop-demo.md`** - Interoperability demo agent commands

## 🚀 Quick Start

From the project root directory:

```bash
./demo/run-demo.sh
```

Or if you're in the demo folder:

```bash
./run-demo.sh
```

## 🔑 Key Information

- **Password**: `NmptGd3qAja?X7gY`
- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:3001/api/v1

## 📋 Demo Highlights

1. **ABHA ID Lookup** - 3-second patient data retrieval
2. **⭐ Handwritten Prescription AI** - 92% accuracy on handwritten prescriptions
3. **Real-time Analytics** - Live revenue and network metrics
4. **WebSocket Integration** - Real-time document processing updates

## 🧪 Test Data

### ABHA IDs
- `1234-5678-9012-34` - Diabetes patient
- `9876-5432-1098-76` - Allergy patient
- `4567-8901-2345-67` - Heart patient

### Key Features to Demo
1. Click "⭐ Handwritten Rx" in Document Processor
2. Show real-time processing with progress updates
3. Demonstrate 92% accuracy on mixed Hindi-English prescriptions
4. Highlight network effects in Analytics Dashboard

## 📝 Notes

- All scripts now use relative paths from the demo folder
- Logs are saved in this folder (backend.log, frontend.log)
- Scripts handle port conflicts and process monitoring automatically