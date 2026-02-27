-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenant table
CREATE TABLE IF NOT EXISTS tenant (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(32) UNIQUE NOT NULL,
    name_vi VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    tax_code VARCHAR(32),
    locale VARCHAR(10) DEFAULT 'vi-VN',
    timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
    settings_json JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Identity Role table
CREATE TABLE IF NOT EXISTS identity_role (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(64) UNIQUE NOT NULL,
    name_vi VARCHAR(255) NOT NULL,
    description TEXT,
    permissions_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Identity User table
CREATE TABLE IF NOT EXISTS identity_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenant(id),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name_vi VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Role Mapping
CREATE TABLE IF NOT EXISTS identity_user_role (
    user_id UUID REFERENCES identity_user(id) ON DELETE CASCADE,
    role_id UUID REFERENCES identity_role(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Insert default tenant
INSERT INTO tenant (code, name_vi) VALUES ('DEFAULT', 'Hệ thống mặc định') ON CONFLICT (code) DO NOTHING;

-- Insert default roles
INSERT INTO identity_role (code, name_vi, description) VALUES 
('PATIENT', 'Bệnh nhân', 'Bệnh nhân tự theo dõi sức khỏe và tư vấn bác sĩ'),
('DOCTOR', 'Bác sĩ', 'Quản lý bệnh nhân và cấp toa thuốc'),
('CLINIC_MANAGER', 'Quản lý phòng khám', 'Theo dõi tổng quan và quản lý bác sĩ'),
('SYSTEM_ADMIN', 'Quản trị hệ thống', 'Cấu hình và quản trị toàn bộ hệ thống')
ON CONFLICT (code) DO NOTHING;
