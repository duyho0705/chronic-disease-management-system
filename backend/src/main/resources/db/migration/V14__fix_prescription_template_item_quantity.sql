-- V14: Fix prescription_template_item quantity column type

-- Drop and recreate prescription_template_item with correct type
DROP TABLE IF EXISTS prescription_template_item CASCADE;

CREATE TABLE prescription_template_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES prescription_template(id) ON DELETE CASCADE,
    product_id UUID REFERENCES pharmacy_product(id) ON DELETE SET NULL,
    product_name_custom VARCHAR(255),
    quantity DOUBLE PRECISION NOT NULL,
    dosage_instruction TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prescription_template_item_template ON prescription_template_item(template_id);
CREATE INDEX idx_prescription_template_item_product ON prescription_template_item(product_id);
