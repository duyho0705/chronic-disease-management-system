package vn.clinic.patientflow.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.clinic.patientflow.pharmacy.domain.PharmacyProduct;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PharmacyProductRepository extends JpaRepository<PharmacyProduct, UUID> {
    List<PharmacyProduct> findByTenantId(UUID tenantId);

    Optional<PharmacyProduct> findByTenantIdAndCode(UUID tenantId, String code);
}
