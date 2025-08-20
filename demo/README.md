# Quantivara Digital Health Demo

## 🚀 Quick Start

### For New Developers
```bash
# Clone the repository
git clone <repository-url>
cd quantivara-digital-health

# Run the demo (includes all setup automatically)
./demo/run-demo.sh
```

### For Existing Developers
```bash
# Just run the demo (handles all migrations automatically)
./demo/run-demo.sh
```

### Alternative: Using npm
```bash
npm run demo
```

## ✨ What's Included

The demo automatically sets up:

### 🔧 Backend Setup
- ✅ Database schema creation
- ✅ Demo ABHA IDs and patient data
- ✅ **NEW: Profile integration tables**
- ✅ **NEW: AI data migration from existing documents**

### 🎯 Frontend Features
- ✅ ABHA ID lookup system
- ✅ Document processing with AI extraction
- ✅ Analytics dashboard
- ✅ **NEW: Enhanced user profiles with AI-extracted data**

## 🆕 AI Profile Integration

The demo now includes seamless AI profile integration:

### Profile Data Available
- **💊 Active Medications**: Extracted from prescriptions
- **🧪 Lab Results**: Extracted from lab reports  
- **🚨 Critical Alerts**: AI-detected abnormal values
- **🫀 Vital Signs**: Extracted from ECG reports

### Demo ABHA IDs
- `1234-5678-9012-34` (Ramesh Kumar - Diabetes)
- `9876-5432-1098-76` (Priya Sharma - Asthma)
- `4567-8901-2345-67` (Suresh Patel - Heart Disease)
- `1111-2222-3333-44` (Ashok Gupta - Hypertension)
- `5555-6666-7777-88` (Meera Singh - Thyroid)

## 🔄 Automatic Migration

The demo script automatically:

1. **Checks existing data** - Detects if you have existing documents
2. **Sets up profile tables** - Creates new tables for AI data organization
3. **Migrates existing data** - Extracts AI data from existing documents
4. **Populates profile tabs** - Organizes data into user-friendly tabs

## 🎯 Demo Features

### Document Processing
- Upload medical documents (prescriptions, lab reports, ECG)
- AI-powered data extraction
- **NEW: Automatic profile population**

### ABHA ID Lookup
- Fast patient lookup using ABHA ID
- **NEW: Enhanced profiles with AI-extracted data**

### Analytics Dashboard
- Healthcare network visualization
- Revenue tracking
- Performance metrics

## 🛠️ Technical Details

### Database Schema
- **Existing tables**: `medical_documents`, `users`, `patients`
- **NEW tables**: `user_medications`, `user_lab_results`, `user_vital_signs`, `user_critical_alerts`

### AI Integration
- **Document processing**: Extracts patient info, medications, lab results
- **Profile population**: Automatically organizes data into tabs
- **Critical alerts**: Detects abnormal values and creates alerts

## 🚨 Troubleshooting

### If demo fails to start:
1. Check `demo/backend.log` for backend errors
2. Check `frontend.log` for frontend errors
3. Ensure ports 3001 and 8080 are available

### If profile data doesn't appear:
1. Check that migration completed successfully
2. Verify database contains demo ABHA IDs
3. Check backend logs for profile population errors

## 📊 Demo Data Summary

After running the demo, you'll have:
- **5 demo patients** with ABHA IDs
- **12+ processed documents** with AI extraction
- **9 active medications** across patients
- **15 lab results** with status tracking
- **7 critical alerts** for abnormal values

## 🎉 Ready to Demo!

The demo is now ready to showcase:
- **Seamless setup** for new and existing developers
- **AI-powered document processing**
- **Enhanced user profiles** with organized health data
- **Real-time critical alerts**
- **Cross-hospital data sharing** via ABHA ID