package vn.clinic.patientflow.clinical.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.clinic.patientflow.clinical.domain.Medication;
import vn.clinic.patientflow.clinical.domain.MedicationSchedule;
import vn.clinic.patientflow.clinical.repository.MedicationRepository;
import vn.clinic.patientflow.clinical.repository.MedicationScheduleRepository;
import vn.clinic.patientflow.common.exception.ResourceNotFoundException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

/**
 * Quản lý lịch uống thuốc và tuân thủ (Role 1).
 */
@Service
@RequiredArgsConstructor
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final MedicationScheduleRepository scheduleRepository;

    @Transactional
    public void generateSchedules(Medication medication) {
        // Simple logic: frequency "Daily" -> 1 dose per day for durationDays
        int days = medication.getDurationDays() != null ? medication.getDurationDays() : 7;
        Instant start = Instant.now();
        for (int i = 0; i < days; i++) {
            MedicationSchedule schedule = MedicationSchedule.builder()
                    .medication(medication)
                    .scheduledTime(start.plus(i, ChronoUnit.DAYS))
                    .status("PENDING")
                    .build();
            scheduleRepository.save(schedule);
        }
    }

    @Transactional
    public MedicationSchedule markAsTaken(UUID scheduleId) {
        MedicationSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicationSchedule", scheduleId));
        schedule.setStatus("TAKEN");
        schedule.setTakenAt(Instant.now());
        return scheduleRepository.save(schedule);
    }

    @Transactional(readOnly = true)
    public List<MedicationSchedule> getPatientSchedules(UUID patientId) {
        return scheduleRepository.findByMedicationPrescriptionPatientId(patientId);
    }

    @Transactional(readOnly = true)
    public List<MedicationSchedule> getDailySchedules(UUID patientId) {
        Instant start = Instant.now().truncatedTo(ChronoUnit.DAYS);
        Instant end = start.plus(1, ChronoUnit.DAYS);
        return scheduleRepository.findByMedicationPrescriptionPatientIdAndScheduledTimeBetween(patientId, start, end);
    }

    @Transactional
    public MedicationSchedule recordDose(UUID scheduleId, String status, String notes) {
        MedicationSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicationSchedule", scheduleId));
        schedule.setStatus(status);
        schedule.setTakenAt(Instant.now());
        return scheduleRepository.save(schedule);
    }
}
