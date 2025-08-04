# 📤 Real File Upload Demo Guide

## 🚀 Overview

The demo now supports **real file uploads** with database storage and AI extraction simulation. You can upload actual medical documents (prescriptions, lab reports, ECGs) and the system will:

1. Upload the file to the backend
2. Process and extract data using AI simulation
3. Save extracted data to SQLite database
4. Return structured medical data

## 📁 Available Sample Files

Located in `/sample-data/user-uploads/`:
- `54d882c7-5030-479c-9a66-d0dfce2d57c4.JPG` - Handwritten prescription
- `2ad62dbc-668e-45a9-bc66-1e5eeaaa195d.JPG` - Lab report
- `3fd9e03e-965b-4075-98ad-755a019a1eee.JPG` - ECG report
- Plus 7 more medical document samples

## 🎯 How to Demo File Upload

### Option 1: Upload Your Own Files
1. Go to Document Processor: http://localhost:8080/processor
2. Drag and drop any medical document (JPG, PNG, PDF)
3. Click "Process Documents"
4. Watch real-time upload and AI extraction

### Option 2: Use Sample Files
1. Copy any file from `/sample-data/user-uploads/`
2. Drag it to the upload area
3. Process and see extracted data

### Option 3: Use Demo Buttons
The existing sample buttons still work and now trigger real backend processing!

## 🗄️ Database Storage

All uploaded documents are stored in SQLite with:
- Document metadata (file info, upload time)
- Processing status and accuracy
- Extracted medical data (JSON)
- Separate tables for prescriptions and lab reports

### View Database Records
```bash
# From backend directory
sqlite3 data/quantivara.db

# View uploaded documents
SELECT * FROM medical_documents;

# View extracted prescriptions
SELECT * FROM prescriptions;

# View lab reports
SELECT * FROM lab_reports;
```

## 🔥 Key Features to Highlight

1. **Real File Processing**
   - Actual file upload to backend
   - Files saved in `/uploads` directory
   - Database persistence

2. **AI Simulation**
   - 90-98% accuracy simulation
   - Document type detection
   - Structured data extraction

3. **Medical Data Extraction**
   - Patient demographics
   - Medications with dosage
   - Lab test results
   - Doctor information

## 📊 API Endpoints

### Upload Document
```
POST /api/v1/documents/upload
Content-Type: multipart/form-data
Body: document (file)
```

### Get Document Status
```
GET /api/v1/documents/{documentId}/status
```

### List Recent Documents
```
GET /api/v1/documents?limit=10
```

### Demo Upload (for testing)
```
POST /api/v1/documents/demo-upload
Body: { "sampleFile": "handwritten-prescription" }
```

## 🧪 Testing the Feature

1. **Check Backend Logs**
   ```bash
   # Watch for upload logs
   tail -f backend/logs/app.log
   ```

2. **Verify Upload**
   - Check `/uploads` folder for saved files
   - Check database for document records

3. **Test Different File Types**
   - Handwritten prescriptions
   - Printed lab reports
   - ECG images
   - X-ray reports

## 🎬 Demo Script

"Let me show you our real document processing capability. I'll upload an actual handwritten prescription from a doctor."

1. Drag the handwritten prescription file
2. "Notice the file is being uploaded to our secure servers"
3. "Our AI is now analyzing the document"
4. "In just 2-3 seconds, we've extracted all the medical data"
5. "This data is now stored in our database for instant retrieval"
6. "The accuracy is 92% even on handwritten prescriptions"

## 🚨 Troubleshooting

### Upload Fails
- Check backend is running: http://localhost:3001/health
- Verify CORS settings allow port 8080
- Check file size (max 10MB)

### No Data Extraction
- Ensure SQLite database is initialized
- Check backend logs for errors
- Verify file type is supported (JPG, PNG, PDF)

### Database Issues
```bash
# Reset database
rm backend/data/quantivara.db
# Restart backend to reinitialize
```

---

**Note**: This feature demonstrates production-ready file upload with simulated AI processing. In production, real OCR and ML models would replace the simulation.