# Quantivara Backend

## Claude Code Agents

### Available Agents

The backend includes several specialized Claude Code agents for different tasks:

| Agent | Command | Purpose |
|-------|---------|---------|
| **document-parser-extractor** | `/agent document-parser-extractor` | Extract structured data from medical documents with 99% accuracy |
| **e2e-integration-tester** | `/agent e2e-integration-tester` | Run comprehensive end-to-end integration tests |
| **demo-hub-validator** | `/agent demo-hub-validator` | Validate demo functionality for investor readiness |
| **backend-integration-expert** | `/agent backend-integration-expert` | Backend code validation, testing, and frontend integration |
| **indian-medical-nlp-ehr-converter** | `/agent indian-medical-nlp-ehr-converter` | Convert Indian medical terminology to EHR codes |
| **medical-ehr-decoder** | `/agent medical-ehr-decoder` | Decode unstructured medical text to standardized formats |

### Running Agents

To use an agent in Claude Code:
1. Type `/agent` followed by the agent name
2. Provide the task description when prompted
3. The agent will autonomously complete the task

Example:
```
/agent document-parser-extractor
Task: Extract patient data from the uploaded prescription PDF
```

## Database Management

### Database Scripts

### Available Commands

- `npm run db:setup` - Initialize database schema
- `npm run db:seed` - Seed database with random sample data (50 patients)
- `npm run db:reset` - Reset database with demo ABHA IDs (preserves existing data)
- `npm run db:add-demo` - Add missing demo ABHA IDs without deleting existing data

### Demo ABHA IDs

The following fixed ABHA IDs are used for consistent demos:

| ABHA ID | Patient Name | Conditions |
|----------|--------------|------------|
| `12345678901234` | Ramesh Kumar | Diabetes, Hypertension |
| `98765432109876` | Priya Sharma | Asthma |
| `45678901234567` | Suresh Patel | Heart Disease |
| `11112222333344` | Ashok Gupta | Hypertension |
| `55556666777788` | Meera Singh | Thyroid Disorders |

### Database Management Approach

#### Previous Approach (db:reset)
- Deleted ALL data from ALL tables
- Recreated everything from scratch
- Lost user uploads and other data

#### New Approach (db:add-demo)
- Checks for existing demo ABHA IDs
- Only adds missing demo patients
- Preserves all existing data (uploads, documents, etc.)
- Much more efficient and user-friendly

### Usage Examples

```bash
# Initialize fresh database with demo data
npm run db:setup
npm run db:add-demo

# Add demo data to existing database (preserves data)
npm run db:add-demo

# Reset everything (use with caution)
npm run db:reset
```

### Demo Script Integration

The `demo/run-demo.sh` script now uses `db:add-demo` instead of `db:reset`, ensuring that:
- User uploads are preserved
- Document processing results are kept
- Only missing demo ABHA IDs are added
- Demo consistency is maintained 