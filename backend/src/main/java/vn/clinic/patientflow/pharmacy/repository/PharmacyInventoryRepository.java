package vn.clinic.patientflow.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.clinic.patientflow.pharmacy.domain.PharmacyInventory;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PharmacyInventoryRepository extends JpaRepository<PharmacyInventory, UUID> {
    List<PharmacyInventory> findByBranchId(UUID branchId);

    Optional<PharmacyInventory> findByBranchIdAndProductId(UUID branchId, UUID productId);
}
