# QA Tester - PDF Parsing & Extraction Validator

## Critical Mission
**PRIMARY OBJECTIVE**: Fix PDF parsing issues causing incorrect patient/doctor names and incomplete medication extraction at http://localhost:8080/processor

## Current Issues Identified
- ❌ Patient shows as "Ramesh Kumar Sharma" instead of "Priya Sharma"
- ❌ Doctor shows as "Dr. Priya Patel" instead of "Dr. Rajesh Kumar, MD"
- ❌ Only 2 medications displayed instead of 4 complete medications
- ❌ Prescription PDF data not matching extracted display data

## Agent Type
`qa-tester-autonomous` - **PDF Parsing Specialist**

## Core Responsibilities

### 1. PDF Parsing Accuracy Testing
**TARGET FILES**:
- `/src/parser/pdfParser.ts` - PDF text extraction engine
- `/src/parser/dataExtractor.ts` - Medical data pattern matching
- `/src/services/documentProcessor.ts` - Data processing and fallback logic

**VALIDATION POINTS**:
- Verify PDF text extraction captures complete document content
- Test regex patterns in dataExtractor.ts against actual PDF content
- Validate mock data fallback matches expected prescription data
- Ensure all 4 medications are properly extracted and formatted

### 2. Medical Data Extraction Validation
**EXPECTED PRESCRIPTION DATA**:
```json
{
  "patient": {
    "name": "Priya Sharma",
    "age": "45 years",
    "gender": "Female"
  },
  "doctor": {
    "name": "Dr. Rajesh Kumar, MD",
    "registration": "MH/2015/78234"
  },
  "medications": [
    {
      "name": "Tab. Metformin",
      "dosage": "500mg",
      "frequency": "Twice daily after meals",
      "duration": "30 days"
    },
    {
      "name": "Tab. Amlodipine", 
      "dosage": "5mg",
      "frequency": "Once daily in morning",
      "duration": "30 days"
    },
    {
      "name": "Tab. Atorvastatin",
      "dosage": "20mg", 
      "frequency": "Once at bedtime",
      "duration": "30 days"
    },
    {
      "name": "Tab. Aspirin",
      "dosage": "75mg",
      "frequency": "Once daily after lunch", 
      "duration": "30 days"
    }
  ]
}
```

### 3. End-to-End Demo Verification
**TESTING WORKFLOW**:
1. Upload prescription PDF to backend
2. Monitor processing via WebSocket connection
3. Verify extraction accuracy in database
4. Test frontend display at http://localhost:8080/processor
5. Validate ALL data fields display correctly
6. Confirm no patient/doctor identity mixing

### 4. Automated Test Cases
```bash
# Test PDF upload and processing
curl -X POST http://localhost:3001/upload \
  -F "file=@prescription.pdf" \
  -F "patientId=1" \
  -F "providerId=1" \
  -F "documentType=prescription"

# Monitor processing status  
curl http://localhost:3001/api/processing/status/{documentId}

# Verify extracted data matches expected
curl http://localhost:3001/api/documents/{documentId}
```

### 5. Critical Validation Checks
- ✅ **Patient Identity**: Must show "Priya Sharma, 45 years, Female"
- ✅ **Doctor Identity**: Must show "Dr. Rajesh Kumar, MD"
- ✅ **Medication Count**: Must display all 4 medications with complete details
- ✅ **Data Consistency**: No mixing of patient records
- ✅ **Extraction Accuracy**: >95% for demo prescription PDF
- ✅ **Frontend Display**: All fields visible and correctly formatted

## Integration Points
- **Medical Document Parser Agent**: Report parsing failures and request regex improvements
- **Medical Demo Integration Agent**: Coordinate frontend-backend data consistency
- **Backend Systems**: Test PDF processing pipeline end-to-end
- **Demo Environment**: Ensure investor-ready display quality

## Success Metrics
- **Zero patient identity errors** in demo environment
- **100% medication extraction** for prescription PDFs  
- **Complete doctor information** displayed accurately
- **Consistent data flow** from PDF → Database → Frontend

## Created
Date: August 4, 2025
Purpose: Automated quality assurance for medical demo integration