package vn.clinic.cdm.common.aspect;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import vn.clinic.cdm.common.tenant.TenantContext;

@Aspect
@Component
@RequiredArgsConstructor
public class MultiTenantAspect {

    private final EntityManager entityManager;

    @Before("execution(* vn.clinic.cdm.*.repository.*.*(..)) || execution(* vn.clinic.cdm.*.service.*.*(..))")
    public void enableTenantFilter() {
        TenantContext.getTenantId().ifPresent(tenantId -> {
            Session session = entityManager.unwrap(Session.class);
            if (session != null) {
                session.enableFilter("tenantFilter").setParameter("tenantId", tenantId);
            }
        });
    }
}
