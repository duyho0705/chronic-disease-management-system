package vn.clinic.patientflow.clinical.domain;

import jakarta.persistence.*;
import lombok.*;
import vn.clinic.patientflow.common.domain.BaseAuditableEntity;

import java.time.Instant;
import java.util.UUID;

/**
 * Lịch uống thuốc và theo dõi tuân thủ.
 */
@Entity
@Table(name = "medication_schedule")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicationSchedule extends BaseAuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medication_id", nullable = false)
    private Medication medication;

    @Column(name = "scheduled_time", nullable = false)
    private Instant scheduledTime;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "PENDING"; // PENDING, TAKEN, MISSED

    @Column(name = "taken_at")
    private Instant takenAt;

    @Column(name = "notes", columnDefinition = "text")
    private String notes;

    public MedicationSchedule(UUID id) {
        super(id);
    }
}
