-- Health Metrics table
CREATE TABLE IF NOT EXISTS health_metric (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patient(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL, -- BLOOD_SUGAR, BLOOD_PRESSURE_SYSTOLIC, BLOOD_PRESSURE_DIASTOLIC, HEART_RATE, WEIGHT, SPO2
    value DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20),
    image_url TEXT, -- For screenshots of devices
    status VARCHAR(20) DEFAULT 'NORMAL', -- NORMAL, ABNORMAL, CRITICAL
    notes TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Health Thresholds (Personalized for each patient)
CREATE TABLE IF NOT EXISTS health_threshold (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patient(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL,
    min_value DECIMAL(10, 2),
    max_value DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(patient_id, metric_type)
);

-- Health Alerts
CREATE TABLE IF NOT EXISTS health_alert (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patient(id) ON DELETE CASCADE,
    metric_id UUID REFERENCES health_metric(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
