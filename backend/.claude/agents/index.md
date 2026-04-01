# Quantivara Digital Health - Agent Registry

## Overview
This directory contains all specialized agents for the Quantivara Digital Health platform. Each agent has specific capabilities and can be invoked using the Task tool.

## Available Agents

### 1. **backend-integration-expert**
- **Purpose**: Backend API and integration development
- **Specialties**: Express.js, database operations, API design
- **File**: [backend-integration-expert.md](./backend-integration-expert.md)

### 2. **indian-medical-nlp-ehr-converter**
- **Purpose**: Natural Language Processing for Indian medical records
- **Specialties**: Multi-language support, medical terminology extraction
- **File**: [indian-medical-nlp-ehr-converter.md](./indian-medical-nlp-ehr-converter.md)

### 3. **medical-demo-integration**
- **Purpose**: Medical demo features and investor presentations
- **Specialties**: Demo scenarios, real-time simulations, showcase features
- **File**: [medical-demo-integration.md](./medical-demo-integration.md)

### 4. **medical-document-parser**
- **Purpose**: Parse and extract data from medical documents
- **Specialties**: OCR, handwriting recognition, structured data extraction
- **File**: [medical-document-parser.md](./medical-document-parser.md)

### 5. **medical-ehr-decoder**
- **Purpose**: Decode and process Electronic Health Records
- **Specialties**: EHR standards, FHIR compliance, data mapping
- **File**: [medical-ehr-decoder.md](./medical-ehr-decoder.md)

### 6. **qa-tester-autonomous**
- **Purpose**: Automated quality assurance and testing
- **Specialties**: UI/API testing, performance testing, security scanning
- **File**: [qa-tester-autonomous.md](./qa-tester-autonomous.md)

## How to Use Agents

Agents can be invoked using the Task tool with their specific type:

```javascript
// Example: Using the QA tester agent
Task({
  description: "Test medical demo",
  prompt: "Run comprehensive tests on the ABHA ID lookup feature",
  subagent_type: "qa-tester-autonomous"
})
```

## Agent Creation Guidelines

When creating new agents:
1. Define clear capabilities and boundaries
2. Specify integration points
3. Provide example use cases
4. Document any dependencies
5. Include creation date and purpose

## Maintenance
- Review agents quarterly for relevance
- Update capabilities as platform evolves
- Archive deprecated agents
- Document agent interactions

---
**Last Updated**: August 4, 2025