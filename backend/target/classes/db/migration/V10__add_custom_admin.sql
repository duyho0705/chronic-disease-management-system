-- =============================================================================
-- Migration V10: Thêm tài khoản Admin mới cho hệ thống
-- =============================================================================

-- 1. Thêm User admin@patientflow.vn (password = "password")
INSERT INTO identity_user (id, email, password_hash, full_name_vi, is_active, created_at, updated_at)
SELECT gen_random_uuid(), 'admin@patientflow.vn',
       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
       'Administrator', true, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM identity_user WHERE email = 'admin@patientflow.vn');

-- 2. Gán Role admin cho user này tại Tenant CLINIC_DEMO
INSERT INTO identity_user_role (id, user_id, role_id, tenant_id, branch_id, created_at)
SELECT gen_random_uuid(), u.id, r.id, t.id, NULL, now()
FROM identity_user u
CROSS JOIN identity_role r
CROSS JOIN tenant t
WHERE u.email = 'admin@patientflow.vn' AND r.code = 'admin' AND t.code = 'CLINIC_DEMO'
AND NOT EXISTS (
    SELECT 1 FROM identity_user_role iur
    WHERE iur.user_id = u.id AND iur.role_id = r.id AND iur.tenant_id = t.id AND iur.branch_id IS NULL
);
