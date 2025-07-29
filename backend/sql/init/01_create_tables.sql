-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create ENUM types for Indian healthcare
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'lab_technician', 'hospital_admin', 'system_admin');
CREATE TYPE document_type AS ENUM ('prescription', 'lab_report', 'ecg_report', 'xray_report', 'discharge_summary', 'ayush_prescription');
CREATE TYPE document_status AS ENUM ('pending', 'processing', 'completed', 'error', 'archived');
CREATE TYPE medical_system AS ENUM ('allopathy', 'ayurveda', 'homeopathy', 'unani', 'siddha');
CREATE TYPE lab_certification AS ENUM ('NABL', 'ISO_15189', 'CAP', 'NABH');
CREATE TYPE urgency_level AS ENUM ('routine', 'urgent', 'critical', 'emergency');

-- Users table (doctors, patients, lab technicians, etc.)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    abha_id VARCHAR(14) UNIQUE, -- Indian ABHA ID
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'patient',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    address JSONB, -- Flexible address structure for Indian addresses
    languages VARCHAR(100)[] DEFAULT ARRAY['en'], -- Supported languages
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_users_abha_id ON users(abha_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Hospitals/Healthcare Providers
CREATE TABLE healthcare_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'hospital', 'clinic', 'lab', 'pharmacy'
    registration_number VARCHAR(100) UNIQUE,
    address JSONB NOT NULL,
    contact_info JSONB NOT NULL, -- phone, email, website
    certifications lab_certification[],
    specialties TEXT[],
    tier VARCHAR(20) DEFAULT 'tier-2', -- tier-1, tier-2, tier-3
    is_government BOOLEAN DEFAULT false,
    monthly_fee INTEGER DEFAULT 0, -- in paise (₹100,000 = 10000000 paise)
    reports_processed INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_providers_type ON healthcare_providers(type);
CREATE INDEX idx_providers_tier ON healthcare_providers(tier);
CREATE INDEX idx_providers_active ON healthcare_providers(is_active);

-- Doctor profiles
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES healthcare_providers(id),
    medical_registration_number VARCHAR(100) UNIQUE NOT NULL,
    degree VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    experience_years INTEGER DEFAULT 0,
    consultation_fee INTEGER DEFAULT 0, -- in paise
    medical_system medical_system DEFAULT 'allopathy',
    languages VARCHAR(100)[] DEFAULT ARRAY['en', 'hi'],
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_doctors_registration ON doctors(medical_registration_number);
CREATE INDEX idx_doctors_provider ON doctors(provider_id);
CREATE INDEX idx_doctors_system ON doctors(medical_system);

-- Patients (extended profile)
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    blood_group VARCHAR(5),
    height_cm INTEGER,
    weight_kg DECIMAL(5,2),
    emergency_contact JSONB,
    medical_conditions TEXT[],
    allergies TEXT[],
    current_medications JSONB,
    family_history JSONB,
    insurance_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_patients_user ON patients(user_id);

-- Family relationships (for family health demo)
CREATE TABLE family_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    primary_patient_id UUID REFERENCES patients(id),
    related_patient_id UUID REFERENCES patients(id),
    relationship VARCHAR(50) NOT NULL, -- 'spouse', 'child', 'parent', 'sibling'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents/Medical Records
CREATE TABLE medical_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id),
    provider_id UUID REFERENCES healthcare_providers(id),
    doctor_id UUID REFERENCES doctors(id),
    document_type document_type NOT NULL,
    status document_status DEFAULT 'pending',
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    extraction_accuracy DECIMAL(5,2), -- 89.5% = 89.5
    extracted_data JSONB, -- AI extracted medical data
    original_language VARCHAR(10) DEFAULT 'en',
    urgency urgency_level DEFAULT 'routine',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_documents_patient ON medical_documents(patient_id);
CREATE INDEX idx_documents_provider ON medical_documents(provider_id);
CREATE INDEX idx_documents_type ON medical_documents(document_type);
CREATE INDEX idx_documents_status ON medical_documents(status);
CREATE INDEX idx_documents_created ON medical_documents(created_at);

-- Prescriptions (detailed breakdown)
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES medical_documents(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id),
    doctor_id UUID REFERENCES doctors(id),
    diagnosis TEXT[],
    medications JSONB NOT NULL, -- Array of medication objects
    advice TEXT[],
    follow_up_date DATE,
    medical_system medical_system DEFAULT 'allopathy',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lab Reports
CREATE TABLE lab_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES medical_documents(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id),
    lab_provider_id UUID REFERENCES healthcare_providers(id),
    test_results JSONB NOT NULL, -- Array of test result objects
    critical_values INTEGER DEFAULT 0,
    abnormal_values INTEGER DEFAULT 0,
    ai_insights TEXT[],
    report_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue Tracking
CREATE TABLE revenue_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL, -- 'lab', 'hospital', 'doctor'
    entity_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'monthly_fee', 'per_report_fee', 'consultation'
    amount_paise INTEGER NOT NULL, -- Always store in paise
    currency VARCHAR(3) DEFAULT 'INR',
    document_id UUID REFERENCES medical_documents(id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_revenue_entity ON revenue_events(entity_type, entity_id);
CREATE INDEX idx_revenue_created ON revenue_events(created_at);

-- Network connections tracking (for demo visualization)
CREATE TABLE network_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_provider_id UUID REFERENCES healthcare_providers(id),
    hospital_provider_id UUID REFERENCES healthcare_providers(id),
    connection_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reports_exchanged INTEGER DEFAULT 0,
    total_revenue_paise INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- Audit log for medical data access (HIPAA compliance)
CREATE TABLE medical_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    patient_id UUID REFERENCES patients(id),
    document_id UUID REFERENCES medical_documents(id),
    action VARCHAR(100) NOT NULL, -- 'view', 'download', 'share', 'modify'
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON medical_audit_log(user_id);
CREATE INDEX idx_audit_patient ON medical_audit_log(patient_id);
CREATE INDEX idx_audit_created ON medical_audit_log(created_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON healthcare_providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON medical_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();