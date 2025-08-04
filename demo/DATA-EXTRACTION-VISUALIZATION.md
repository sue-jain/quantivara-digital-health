# 📊 Data Extraction & Database Storage Visualization

## 🔍 How Data Flows Through the System

### 1. **File Upload**
```
User uploads handwritten prescription → Backend receives file → Saved to /uploads/
```

### 2. **AI Processing (Simulated)**
The backend extracts structured data from the image:

```javascript
// Input: Handwritten prescription image
// Output: Structured medical data

{
  "documentType": "Handwritten Prescription",
  "patientInfo": {
    "name": "Patient Name (Redacted)",
    "age": "21 Years",
    "gender": "Male",
    "patientId": "PID-2024-HW-001"
  },
  "doctorInfo": {
    "name": "Dr. Shubham Nimesh",
    "registration": "Medical Registration Number",
    "clinic": "Medical Facility"
  },
  "diagnosis": ["Acute Gastroenteritis"],
  "medications": [
    {
      "name": "Omeprazole",
      "dosage": "20mg",
      "frequency": "Twice daily (1-0-1)",
      "duration": "3 days",
      "instructions": "Before food"
    },
    {
      "name": "Sucralfate + Simethicone",
      "dosage": "10ml",
      "frequency": "Three times daily (1-1-1)",
      "duration": "3 days",
      "instructions": "After food"
    },
    {
      "name": "Loperamide",
      "dosage": "As directed",
      "frequency": "SOS (As needed)",
      "duration": "As needed",
      "instructions": "For diarrhea control"
    }
  ],
  "advice": [
    "IV Fluids + Antibiotics as prescribed",
    "Light diet recommended",
    "Adequate hydration",
    "Rest advised"
  ],
  "followUp": "As needed based on symptoms",
  "extractionAccuracy": "92%",
  "aiNotes": "Successfully extracted from handwritten prescription with medical abbreviations"
}
```

### 3. **Database Storage**

#### Table: `medical_documents`
```sql
INSERT INTO medical_documents (
  id,                    -- 'abc123-def456-...'
  patient_id,            -- 'demo-patient-001'
  provider_id,           -- 'demo-provider-001'
  document_type,         -- 'handwritten_prescription'
  status,                -- 'completed'
  file_path,             -- '/uploads/abc123.jpg'
  file_name,             -- 'handwritten-prescription.jpg'
  extraction_accuracy,   -- 92.0
  extracted_data,        -- JSON blob with all extracted data
  created_at             -- '2024-01-30 10:30:00'
)
```

#### Table: `prescriptions`
```sql
INSERT INTO prescriptions (
  id,                    -- 'pres-123'
  document_id,           -- 'abc123-def456-...'
  patient_name,          -- 'Patient Name'
  patient_age,           -- '21 Years'
  patient_gender,        -- 'Male'
  doctor_name,           -- 'Dr. Shubham Nimesh'
  diagnosis,             -- '["Acute Gastroenteritis"]'
  medications,           -- JSON array of all medications
  advice,                -- JSON array of advice
  follow_up              -- 'As needed based on symptoms'
)
```

## 🖥️ Frontend Display Improvement

The new `ExtractedDataDisplay` component shows this data in a clean, organized format instead of raw JSON:

### Before (JSON Blob):
```json
{"documentType":"Handwritten Prescription","patientInfo":{...},"medications":[...]}
```

### After (Structured Display):
```
┌─────────────────────────────────────────────┐
│ 📄 Handwritten Prescription Analysis        │
│ ✓ 92% Accuracy    🤖 AI Extracted         │
├─────────────────────────────────────────────┤
│ 👤 Patient Information                      │
│    Name: Patient Name                       │
│    Age: 21 Years                           │
│    Gender: Male                            │
├─────────────────────────────────────────────┤
│ 👨‍⚕️ Doctor Information                      │
│    Dr. Shubham Nimesh                      │
│    MRN • Medical Facility                  │
├─────────────────────────────────────────────┤
│ 💊 Prescribed Medications                   │
│                                            │
│ 1. Omeprazole                              │
│    💊 20mg  ⏰ Twice daily  📅 3 days      │
│    Before food                             │
│                                            │
│ 2. Sucralfate + Simethicone               │
│    💊 10ml  ⏰ Three times daily  📅 3 days │
│    After food                              │
│                                            │
│ 3. Loperamide                              │
│    💊 As directed  ⏰ SOS  📅 As needed     │
│    For diarrhea control                    │
├─────────────────────────────────────────────┤
│ ✅ Medical Advice                           │
│    • IV Fluids + Antibiotics              │
│    • Light diet recommended                │
│    • Adequate hydration                    │
├─────────────────────────────────────────────┤
│ 📅 Follow-up: As needed based on symptoms  │
└─────────────────────────────────────────────┘
```

## 🧪 To Test Your Upload

1. **Upload a file** in Document Processor
2. **Check the frontend** - You should now see the structured display
3. **Verify in database**:
   ```bash
   sqlite3 backend/data/quantivara.db
   
   -- See all uploads
   SELECT id, document_type, file_name, status 
   FROM medical_documents 
   ORDER BY created_at DESC LIMIT 5;
   
   -- See extracted prescription data
   SELECT * FROM prescriptions 
   ORDER BY created_at DESC LIMIT 1;
   ```

## 🔄 Real-time Updates

If WebSocket is connected, you'll see:
1. "Analyzing document structure..." (20%)
2. "Extracting text content..." (40%)
3. "Applying AI models..." (60%)
4. "Validating results..." (80%)
5. "Processing complete!" (100%)

## 📝 What Gets Extracted

From a handwritten prescription, the AI extracts:
- **Patient demographics** (name, age, gender)
- **Doctor details** (name, registration, clinic)
- **Diagnosis** (medical conditions)
- **Medications** with:
  - Drug name
  - Dosage (e.g., "20mg")
  - Frequency (e.g., "1-0-1" → "Twice daily")
  - Duration (e.g., "3 days")
  - Instructions (e.g., "Before food")
- **Medical advice**
- **Follow-up instructions**

The system understands medical abbreviations:
- "1-0-1" → "Twice daily"
- "SOS" → "As needed"
- "p/c" → "After food"
- "a/c" → "Before food"