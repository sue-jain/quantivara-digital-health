# Quantivara Backend - Database Management

## Database Scripts

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