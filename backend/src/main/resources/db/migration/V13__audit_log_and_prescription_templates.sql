-- V13: Add Audit Log and Prescription Templates

-- Create audit_log table for tracking system activities
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    branch_id UUID,
    user_id UUID,
    user_email VARCHAR(128),
    action VARCHAR(64) NOT NULL,
    resource_type VARCHAR(64),
    resource_id VARCHAR(128),
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_tenant_created ON audit_log(tenant_id, created_at DESC);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id);

-- Create prescription_template for storing reusable prescription patterns
CREATE TABLE prescription_template (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    name_vi VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prescription_template_tenant ON prescription_template(tenant_id);
CREATE INDEX idx_prescription_template_created_by ON prescription_template(created_by);

-- Create prescription_template_item for template details
CREATE TABLE prescription_template_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES prescription_template(id) ON DELETE CASCADE,
    product_id UUID REFERENCES pharmacy_product(id) ON DELETE SET NULL,
    product_name_custom VARCHAR(255),
    quantity DECIMAL(10, 2) NOT NULL,
    dosage_instruction TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prescription_template_item_template ON prescription_template_item(template_id);
CREATE INDEX idx_prescription_template_item_product ON prescription_template_item(product_id);
