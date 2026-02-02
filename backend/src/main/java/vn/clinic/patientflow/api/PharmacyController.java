package vn.clinic.patientflow.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.clinic.patientflow.api.dto.PharmacyInventoryDto;
import vn.clinic.patientflow.api.dto.PharmacyProductDto;
import vn.clinic.patientflow.common.tenant.TenantContext;
import vn.clinic.patientflow.pharmacy.domain.PharmacyInventory;
import vn.clinic.patientflow.pharmacy.domain.PharmacyProduct;
import vn.clinic.patientflow.pharmacy.repository.PharmacyInventoryRepository;
import vn.clinic.patientflow.pharmacy.repository.PharmacyProductRepository;
import vn.clinic.patientflow.pharmacy.service.PharmacyService;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pharmacy")
@RequiredArgsConstructor
@Tag(name = "Pharmacy", description = "Quản lý dược và kho thuốc")
public class PharmacyController {

    private final PharmacyProductRepository productRepository;
    private final PharmacyInventoryRepository inventoryRepository;
    private final PharmacyService pharmacyService;

    @GetMapping("/products")
    @Operation(summary = "Lấy danh mục thuốc")
    public ResponseEntity<List<PharmacyProductDto>> getProducts() {
        UUID tenantId = TenantContext.getTenantIdOrThrow();
        return ResponseEntity.ok(productRepository.findByTenantId(tenantId)
                .stream().map(this::mapToProductDto).collect(Collectors.toList()));
    }

    @PostMapping("/products")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINIC_MANAGER')")
    @Operation(summary = "Thêm thuốc mới vào danh mục")
    public ResponseEntity<PharmacyProductDto> createProduct(@RequestBody PharmacyProductDto dto) {
        UUID tenantId = TenantContext.getTenantIdOrThrow();
        PharmacyProduct product = PharmacyProduct.builder()
                .tenantId(tenantId)
                .code(dto.getCode())
                .nameVi(dto.getNameVi())
                .genericName(dto.getGenericName())
                .unit(dto.getUnit())
                .standardPrice(dto.getStandardPrice())
                .active(true)
                .build();
        return ResponseEntity.ok(mapToProductDto(productRepository.save(product)));
    }

    @GetMapping("/inventory")
    @Operation(summary = "Xem tồn kho của chi nhánh")
    public ResponseEntity<List<PharmacyInventoryDto>> getInventory(@RequestParam UUID branchId) {
        return ResponseEntity.ok(inventoryRepository.findByBranchId(branchId)
                .stream().map(this::mapToInventoryDto).collect(Collectors.toList()));
    }

    @PostMapping("/inventory/restock")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'CLINIC_MANAGER')")
    @Operation(summary = "Nhập thuốc vào kho")
    public ResponseEntity<Void> restock(@RequestParam UUID branchId,
            @RequestParam UUID productId,
            @RequestParam BigDecimal quantity,
            @RequestParam(required = false) String notes) {
        // In real app, get user ID from security context
        pharmacyService.addStock(branchId, productId, quantity, null, notes);
        return ResponseEntity.ok().build();
    }

    private PharmacyProductDto mapToProductDto(PharmacyProduct p) {
        return PharmacyProductDto.builder()
                .id(p.getId())
                .code(p.getCode())
                .nameVi(p.getNameVi())
                .genericName(p.getGenericName())
                .unit(p.getUnit())
                .standardPrice(p.getStandardPrice())
                .active(p.isActive())
                .build();
    }

    private PharmacyInventoryDto mapToInventoryDto(PharmacyInventory i) {
        return PharmacyInventoryDto.builder()
                .id(i.getId())
                .branchId(i.getBranchId())
                .product(mapToProductDto(i.getProduct()))
                .currentStock(i.getCurrentStock())
                .minStockLevel(i.getMinStockLevel())
                .lastRestockAt(i.getLastRestockAt())
                .updatedAt(i.getUpdatedAt())
                .build();
    }
}
