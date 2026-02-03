package vn.clinic.patientflow.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.clinic.patientflow.common.domain.AuditLog;
import vn.clinic.patientflow.common.repository.AuditLogRepository;
import vn.clinic.patientflow.auth.AuthPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import vn.clinic.patientflow.common.tenant.TenantContext;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void log(String action, String resourceType, String resourceId, String details) {
        UUID tenantId = TenantContext.getTenantId().orElse(null);

        AuthPrincipal principal = null;
        Object p = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (p instanceof AuthPrincipal) {
            principal = (AuthPrincipal) p;
        }

        AuditLog log = AuditLog.builder()
                .tenantId(tenantId)
                .userId(principal != null ? principal.getUserId() : null)
                .userEmail(principal != null ? principal.getEmail() : "system")
                .action(action)
                .resourceType(resourceType)
                .resourceId(resourceId)
                .details(details)
                .build();

        auditLogRepository.save(log);
    }
}
