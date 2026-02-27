-- Clinics table
CREATE TABLE IF NOT EXISTS clinic (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenant(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctor (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenant(id) ON DELETE CASCADE,
    identity_user_id UUID UNIQUE REFERENCES identity_user(id) ON DELETE CASCADE,
    specialty VARCHAR(255),
    license_number VARCHAR(50) UNIQUE,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE IF NOT EXISTS patient (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenant(id) ON DELETE CASCADE,
    identity_user_id UUID UNIQUE REFERENCES identity_user(id) ON DELETE CASCADE,
    external_id VARCHAR(64),
    cccd VARCHAR(20),
    full_name_vi VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    address_line VARCHAR(500),
    city VARCHAR(100),
    district VARCHAR(100),
    ward VARCHAR(100),
    nationality VARCHAR(100) DEFAULT 'VN',
    ethnicity VARCHAR(100),
    avatar_url TEXT,
    blood_type VARCHAR(10),
    allergies TEXT,
    chronic_conditions TEXT,
    risk_level VARCHAR(20) DEFAULT 'LOW',
    assigned_doctor_id UUID REFERENCES doctor(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clinical Consultations
CREATE TABLE IF NOT EXISTS clinical_consultation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenant(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patient(id) ON DELETE CASCADE,
    doctor_identity_user_id UUID REFERENCES identity_user(id),
    status VARCHAR(20) DEFAULT 'IN_PROGRESS',
    diagnosis_notes TEXT,
    prescription_notes TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Patient Medical History
CREATE TABLE IF NOT EXISTS patient_medical_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patient(id) ON DELETE CASCADE,
    consultation_id UUID REFERENCES clinical_consultation(id) ON DELETE SET NULL,
    doctor_id UUID REFERENCES doctor(id),
    diagnosis TEXT NOT NULL,
    treatment TEXT,
    notes TEXT,
    visit_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
