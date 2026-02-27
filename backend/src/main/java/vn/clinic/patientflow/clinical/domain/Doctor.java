package vn.clinic.patientflow.clinical.domain;

import jakarta.persistence.*;
import lombok.*;
import vn.clinic.patientflow.common.domain.BaseAuditableEntity;
import vn.clinic.patientflow.identity.domain.IdentityUser;
import vn.clinic.patientflow.tenant.domain.Tenant;

import java.util.UUID;

/**
 * Bác sĩ.
 */
@Entity
@Table(name = "doctor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor extends BaseAuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "identity_user_id", unique = true)
    private IdentityUser identityUser;

    @Column(name = "specialty")
    private String specialty;

    @Column(name = "license_number", unique = true)
    private String licenseNumber;

    @Column(name = "bio", columnDefinition = "text")
    private String bio;

    public Doctor(UUID id) {
        super(id);
    }
}
