-- =============================================================================
-- Migration V9: Pharmacy & Inventory Management
-- =============================================================================

-- 1. Pharmacy Product Master
CREATE TABLE pharmacy_product (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenant(id) ON DELETE RESTRICT,
    code            VARCHAR(64) NOT NULL,
    name_vi         VARCHAR(255) NOT NULL,
    generic_name    VARCHAR(255),
    unit            VARCHAR(32) NOT NULL, -- e.g., Viên, Vỉ, Chai, Ống
    standard_price  NUMERIC(15,2) NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_pharmacy_product_tenant_code UNIQUE (tenant_id, code)
);

CREATE INDEX ix_pharmacy_product_tenant_id ON pharmacy_product(tenant_id);

-- 2. Inventory (Stock levels per branch)
CREATE TABLE pharmacy_inventory (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id       UUID NOT NULL REFERENCES tenant_branch(id) ON DELETE RESTRICT,
    product_id      UUID NOT NULL REFERENCES pharmacy_product(id) ON DELETE RESTRICT,
    current_stock   NUMERIC(15,2) NOT NULL DEFAULT 0,
    min_stock_level NUMERIC(15,2) NOT NULL DEFAULT 0,
    last_restock_at TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_pharmacy_inventory_branch_product UNIQUE (branch_id, product_id)
);

CREATE INDEX ix_pharmacy_inventory_branch_id ON pharmacy_inventory(branch_id);

-- 3. Inventory Transactions (History)
CREATE TABLE pharmacy_inventory_transaction (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id       UUID NOT NULL REFERENCES tenant_branch(id) ON DELETE RESTRICT,
    product_id      UUID NOT NULL REFERENCES pharmacy_product(id) ON DELETE RESTRICT,
    transaction_type VARCHAR(32) NOT NULL, -- PURCHASE, DISPENSE, EXPIRED, ADJUSTMENT, RETURN
    quantity        NUMERIC(15,2) NOT NULL,
    reference_id    UUID, -- e.g., InvoiceItem ID or ClinicalConsultation ID
    notes           TEXT,
    performed_by_user_id UUID REFERENCES identity_user(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_pharmacy_inv_trans_branch ON pharmacy_inventory_transaction(branch_id);
CREATE INDEX ix_pharmacy_inv_trans_product ON pharmacy_inventory_transaction(product_id);

-- 4. Prescription
CREATE TABLE clinical_prescription (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID NOT NULL REFERENCES clinical_consultation(id) ON DELETE CASCADE,
    patient_id      UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    doctor_user_id  UUID REFERENCES identity_user(id),
    status          VARCHAR(32) NOT NULL, -- DRAFT, ISSUED, DISPENSED, CANCELLED
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_clinical_prescription_consultation ON clinical_prescription(consultation_id);
CREATE INDEX ix_clinical_prescription_patient ON clinical_prescription(patient_id);

-- 5. Prescription Item
CREATE TABLE clinical_prescription_item (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL REFERENCES clinical_prescription(id) ON DELETE CASCADE,
    product_id      UUID REFERENCES pharmacy_product(id) ON DELETE RESTRICT,
    product_name_custom VARCHAR(255), -- If not in master list
    quantity        NUMERIC(10,2) NOT NULL,
    dosage_instruction TEXT, -- e.g., "Sáng 1 viên, chiều 1 viên sau ăn"
    unit_price      NUMERIC(15,2),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_clinical_prescription_item_prescription ON clinical_prescription_item(prescription_id);

-- Add updated_at triggers
CREATE TRIGGER tr_pharmacy_product_updated_at BEFORE UPDATE ON pharmacy_product FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER tr_pharmacy_inventory_updated_at BEFORE UPDATE ON pharmacy_inventory FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER tr_clinical_prescription_updated_at BEFORE UPDATE ON clinical_prescription FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
