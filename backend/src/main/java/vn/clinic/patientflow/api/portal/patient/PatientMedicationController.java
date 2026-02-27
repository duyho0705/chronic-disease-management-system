package vn.clinic.patientflow.api.portal.patient;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.clinic.patientflow.api.dto.common.ApiResponse;
import vn.clinic.patientflow.api.dto.medication.MedicationReminderDto;
import vn.clinic.patientflow.api.dto.medication.MedicationDosageLogDto;
import vn.clinic.patientflow.clinical.service.MedicationService;
import vn.clinic.patientflow.patient.domain.Patient;
import vn.clinic.patientflow.patient.service.PatientPortalService;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/portal/medication-reminders")
@RequiredArgsConstructor
@Tag(name = "Patient Medication", description = "Quản lý nhắc lịch uống thuốc")
@PreAuthorize("hasRole('PATIENT')")
public class PatientMedicationController {

    private final PatientPortalService portalService;
    private final MedicationService medicationService;

    @GetMapping
    @Operation(summary = "Lấy danh sách nhắc lịch uống thuốc")
    public ResponseEntity<ApiResponse<List<MedicationReminderDto>>> getReminders() {
        Patient p = portalService.getAuthenticatedPatient();
        var data = medicationService.getDailySchedules(p.getId()).stream()
                .map(s -> MedicationReminderDto.builder()
                        .id(s.getId())
                        .medicineName(s.getMedication().getMedicineName())
                        .reminderTime(LocalTime.now()) // Placeholder
                        .dosage(s.getMedication().getDosage())
                        .isActive(true)
                        .notes(s.getMedication().getInstructions())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PostMapping("/log")
    @Operation(summary = "Ghi nhận đã uống thuốc")
    public ResponseEntity<ApiResponse<MedicationDosageLogDto>> logDosage(@RequestBody MedicationDosageLogDto dto) {
        Patient p = portalService.getAuthenticatedPatient();
        return ResponseEntity.ok(ApiResponse.success(portalService.markMedicationTaken(p, dto)));
    }
}
