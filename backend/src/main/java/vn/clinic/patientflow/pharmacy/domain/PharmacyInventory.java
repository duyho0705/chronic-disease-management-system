package vn.clinic.patientflow.pharmacy.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "pharmacy_inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class PharmacyInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "branch_id", nullable = false)
    private UUID branchId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private PharmacyProduct product;

    @Column(name = "current_stock", nullable = false)
    private BigDecimal currentStock;

    @Column(name = "min_stock_level", nullable = false)
    private BigDecimal minStockLevel;

    @Column(name = "last_restock_at")
    private Instant lastRestockAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;
}
