package vn.clinic.patientflow.pharmacy.domain;

import jakarta.persistence.*;
import lombok.*;
import vn.clinic.patientflow.common.domain.BaseAuditableEntity;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "pharmacy_product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PharmacyProduct extends BaseAuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(nullable = false, length = 64)
    private String code;

    @Column(name = "name_vi", nullable = false)
    private String nameVi;

    @Column(name = "generic_name")
    private String genericName;

    @Column(nullable = false, length = 32)
    private String unit;

    @Column(name = "standard_price", nullable = false)
    private BigDecimal standardPrice;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean active = true;
}
