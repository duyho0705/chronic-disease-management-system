-- =============================================================================
-- Migration V8: Create billing system (invoices and items)
-- =============================================================================

CREATE TABLE billing_invoice (
    id                UUID PRIMARY KEY,
    tenant_id         UUID NOT NULL,
    branch_id         UUID NOT NULL,
    patient_id        UUID NOT NULL,
    consultation_id   UUID,
    invoice_number    VARCHAR(32) NOT NULL,
    total_amount      DECIMAL(19,4) NOT NULL DEFAULT 0,
    discount_amount   DECIMAL(19,4) NOT NULL DEFAULT 0,
    final_amount      DECIMAL(19,4) NOT NULL DEFAULT 0,
    status            VARCHAR(32) NOT NULL, -- PENDING, PAID, CANCELLED
    payment_method    VARCHAR(32),          -- CASH, BANK_TRANSFER, E_WALLET
    paid_at           TIMESTAMP WITH TIME ZONE,
    notes             TEXT,
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at        TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by        VARCHAR(255),
    updated_by        VARCHAR(255),
    version           BIGINT NOT NULL DEFAULT 0,
    
    CONSTRAINT fk_inv_tenant FOREIGN KEY (tenant_id) REFERENCES tenant (id),
    CONSTRAINT fk_inv_branch FOREIGN KEY (branch_id) REFERENCES tenant_branch (id),
    CONSTRAINT fk_inv_patient FOREIGN KEY (patient_id) REFERENCES patient (id),
    CONSTRAINT fk_inv_consultation FOREIGN KEY (consultation_id) REFERENCES clinical_consultation (id)
);

CREATE TABLE billing_invoice_item (
    id                UUID PRIMARY KEY,
    invoice_id        UUID NOT NULL,
    item_code         VARCHAR(64),
    item_name         VARCHAR(255) NOT NULL,
    quantity          DECIMAL(19,4) NOT NULL DEFAULT 1,
    unit_price        DECIMAL(19,4) NOT NULL DEFAULT 0,
    line_total        DECIMAL(19,4) NOT NULL DEFAULT 0,
    
    CONSTRAINT fk_item_invoice FOREIGN KEY (invoice_id) REFERENCES billing_invoice (id) ON DELETE CASCADE
);

CREATE INDEX ix_inv_tenant_id ON billing_invoice(tenant_id);
CREATE INDEX ix_inv_branch_id ON billing_invoice(branch_id);
CREATE INDEX ix_inv_patient_id ON billing_invoice(patient_id);
CREATE UNIQUE INDEX ux_inv_number ON billing_invoice(invoice_number);
