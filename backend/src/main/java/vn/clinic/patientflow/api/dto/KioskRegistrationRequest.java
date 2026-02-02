package vn.clinic.patientflow.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KioskRegistrationRequest {
    private String fullName;
    private String phone;
    private LocalDate dateOfBirth;
    private UUID branchId;
    private UUID queueDefinitionId;
    private UUID appointmentId; // Optional, if they scan a QR of an appointment
}
