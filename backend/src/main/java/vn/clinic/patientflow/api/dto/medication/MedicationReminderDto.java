package vn.clinic.patientflow.api.dto.medication;

import lombok.*;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicationReminderDto {
    private UUID id;
    private String medicineName;
    private LocalTime reminderTime;
    private String dosage;
    private Boolean isActive;
    private String notes;
}
