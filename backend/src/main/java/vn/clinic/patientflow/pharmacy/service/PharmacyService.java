package vn.clinic.patientflow.pharmacy.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.clinic.patientflow.pharmacy.domain.InventoryTransaction;
import vn.clinic.patientflow.pharmacy.domain.PharmacyInventory;
import vn.clinic.patientflow.pharmacy.domain.PharmacyProduct;
import vn.clinic.patientflow.pharmacy.repository.InventoryTransactionRepository;
import vn.clinic.patientflow.pharmacy.repository.PharmacyInventoryRepository;
import vn.clinic.patientflow.pharmacy.repository.PharmacyProductRepository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PharmacyService {

    private final PharmacyProductRepository productRepository;
    private final PharmacyInventoryRepository inventoryRepository;
    private final InventoryTransactionRepository transactionRepository;

    @Transactional
    public void addStock(UUID branchId, UUID productId, BigDecimal quantity, UUID userId, String notes) {
        PharmacyInventory inventory = getOrCreateInventory(branchId, productId);
        inventory.setCurrentStock(inventory.getCurrentStock().add(quantity));
        inventory.setLastRestockAt(Instant.now());
        inventoryRepository.save(inventory);

        logTransaction(branchId, productId, InventoryTransaction.TransactionType.PURCHASE, quantity, null, userId,
                notes);
    }

    @Transactional
    public void dispenseStock(UUID branchId, UUID productId, BigDecimal quantity, UUID referenceId, UUID userId,
            String notes) {
        PharmacyInventory inventory = inventoryRepository.findByBranchIdAndProductId(branchId, productId)
                .orElseThrow(() -> new RuntimeException("Product not found in inventory for this branch"));

        if (inventory.getCurrentStock().compareTo(quantity) < 0) {
            log.warn("Insufficient stock for product {} at branch {}. Current: {}, Required: {}",
                    productId, branchId, inventory.getCurrentStock(), quantity);
            // In many clinics, they still allow dispensing even if stock is negative in
            // system,
            // but for now let's just log and subtract.
        }

        inventory.setCurrentStock(inventory.getCurrentStock().subtract(quantity));
        inventoryRepository.save(inventory);

        logTransaction(branchId, productId, InventoryTransaction.TransactionType.DISPENSE, quantity.negate(),
                referenceId, userId, notes);
    }

    private PharmacyInventory getOrCreateInventory(UUID branchId, UUID productId) {
        return inventoryRepository.findByBranchIdAndProductId(branchId, productId)
                .orElseGet(() -> {
                    PharmacyProduct product = productRepository.findById(productId)
                            .orElseThrow(() -> new RuntimeException("Product not found"));
                    return PharmacyInventory.builder()
                            .branchId(branchId)
                            .product(product)
                            .currentStock(BigDecimal.ZERO)
                            .minStockLevel(BigDecimal.ZERO)
                            .build();
                });
    }

    private void logTransaction(UUID branchId, UUID productId, InventoryTransaction.TransactionType type,
            BigDecimal quantity, UUID referenceId, UUID userId, String notes) {
        PharmacyProduct product = productRepository.findById(productId).orElse(null);
        InventoryTransaction transaction = InventoryTransaction.builder()
                .branchId(branchId)
                .product(product)
                .type(type)
                .quantity(quantity)
                .referenceId(referenceId)
                .performedByUserId(userId)
                .notes(notes)
                .build();
        transactionRepository.save(transaction);
    }
}
