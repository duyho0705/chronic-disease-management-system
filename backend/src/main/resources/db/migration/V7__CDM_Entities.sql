-- Create missing CDM tables
CREATE TABLE IF NOT EXISTS patient_vital_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    vital_type VARCHAR(255) NOT NULL,
    value_numeric DECIMAL(10, 2),
    unit VARCHAR(50),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    image_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medication_reminder (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    reminder_time TIME,
    dosage VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    total_doses_taken INTEGER DEFAULT 0,
    last_taken_at TIMESTAMP WITH TIME ZONE,
    adherence_score DECIMAL(5, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medication_dosage_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medication_reminder_id UUID REFERENCES medication_reminder(id) ON DELETE SET NULL,
    medicine_name VARCHAR(255),
    dosage_instruction TEXT,
    taken_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
