-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES identity_user(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN
    entity_name VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System Configurations
CREATE TABLE IF NOT EXISTS system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default configurations
INSERT INTO system_config (config_key, config_value, description) VALUES 
('DEFAULT_BLOOD_SUGAR_MAX', '140', 'Default max blood sugar threshold'),
('DEFAULT_BLOOD_PRESSURE_SYSTOLIC_MAX', '130', 'Default max systolic blood pressure'),
('DEFAULT_BLOOD_PRESSURE_DIASTOLIC_MAX', '80', 'Default max diastolic blood pressure'),
('ALERT_CONSECUTIVE_DAYS', '3', 'Number of consecutive days for major alert')
ON CONFLICT (config_key) DO NOTHING;
