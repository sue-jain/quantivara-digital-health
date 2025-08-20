-- SQLite Schema for Quantivara Digital Health
-- Simplified version of PostgreSQL schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    abha_id TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'patient',
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Healthcare Providers
CREATE TABLE IF NOT EXISTS healthcare_providers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    registration_number TEXT UNIQUE,
    address TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Medical Documents
CREATE TABLE IF NOT EXISTS medical_documents (
    id TEXT PRIMARY KEY,
    patient_id TEXT,
    provider_id TEXT,
    document_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    file_path TEXT,
    file_name TEXT,
    file_size INTEGER,
    mime_type TEXT,
    processing_started_at DATETIME,
    processing_completed_at DATETIME,
    extraction_accuracy REAL,
    extracted_data TEXT,
    original_text TEXT,
    abha_id TEXT, -- ABHA ID for direct linking
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (provider_id) REFERENCES healthcare_providers(id)
);

-- Prescriptions
CREATE TABLE IF NOT EXISTS prescriptions (
    id TEXT PRIMARY KEY,
    document_id TEXT,
    patient_name TEXT,
    patient_age TEXT,
    patient_gender TEXT,
    doctor_name TEXT,
    doctor_registration TEXT,
    clinic_name TEXT,
    diagnosis TEXT,
    medications TEXT,
    advice TEXT,
    follow_up TEXT,
    prescription_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES medical_documents(id)
);

-- Lab Reports
CREATE TABLE IF NOT EXISTS lab_reports (
    id TEXT PRIMARY KEY,
    document_id TEXT,
    patient_name TEXT,
    patient_age TEXT,
    patient_gender TEXT,
    lab_name TEXT,
    sample_id TEXT,
    report_date DATE,
    tests TEXT,
    critical_values INTEGER DEFAULT 0,
    abnormal_values INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES medical_documents(id)
);

-- Revenue Events
CREATE TABLE IF NOT EXISTS revenue_events (
    id TEXT PRIMARY KEY,
    provider_id TEXT,
    event_type TEXT,
    amount_paise INTEGER,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES healthcare_providers(id)
);

-- User Diagnoses (AI Profile Integration)
CREATE TABLE IF NOT EXISTS user_diagnoses (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT REFERENCES users(id),
    abha_id TEXT NOT NULL,
    diagnosis_name TEXT NOT NULL,
    diagnosis_date TEXT,
    doctor_name TEXT,
    status TEXT DEFAULT 'ACTIVE', -- ACTIVE, RESOLVED, CHRONIC
    severity TEXT, -- MILD, MODERATE, SEVERE, CRITICAL
    source_document_id TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Performance Indexes for Users Table
CREATE INDEX IF NOT EXISTS idx_users_name_dob ON users(first_name, last_name, date_of_birth);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_abha_id ON users(abha_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Indexes for User Diagnoses
CREATE INDEX IF NOT EXISTS idx_user_diagnoses_abha_id ON user_diagnoses(abha_id);
CREATE INDEX IF NOT EXISTS idx_user_diagnoses_status ON user_diagnoses(status);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_documents_patient ON medical_documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_documents_provider ON medical_documents(provider_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON medical_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON medical_documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_abha_id ON medical_documents(abha_id);
CREATE INDEX IF NOT EXISTS idx_documents_created ON medical_documents(created_at);