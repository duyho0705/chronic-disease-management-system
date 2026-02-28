-- Seeding core permissions
INSERT INTO identity_permission (id, code, name, description) VALUES 
(gen_random_uuid(), 'PATIENT_VIEW', 'Xem hồ sơ bệnh nhân', 'Quyền xem thông tin bệnh nhân'),
(gen_random_uuid(), 'PATIENT_EDIT', 'Sửa hồ sơ bệnh nhân', 'Quyền cập nhật thông tin bệnh nhân'),
(gen_random_uuid(), 'CLINICAL_RECORD_VIEW', 'Xem bệnh án', 'Quyền xem lịch sử bệnh án'),
(gen_random_uuid(), 'CLINICAL_RECORD_CREATE', 'Tạo bệnh án', 'Quyền tạo mới hồ sơ bệnh án'),
(gen_random_uuid(), 'APPOINTMENT_MANAGE', 'Quản lý lịch hẹn', 'Quyền tạo và duyệt lịch hẹn');

-- Example: Mapping PATIENT_VIEW to DOCTOR role
-- (Assumes roles are already seeded and you know their IDs, but this is for reference)
-- INSERT INTO identity_role_permission (id, role_id, permission_id) ...
