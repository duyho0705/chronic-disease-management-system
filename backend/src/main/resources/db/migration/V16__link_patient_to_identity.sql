ALTER TABLE patient ADD COLUMN identity_user_id UUID;
CREATE INDEX idx_patient_identity_user_id ON patient(identity_user_id);
