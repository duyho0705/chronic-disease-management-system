package vn.clinic.patientflow.patient.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import vn.clinic.patientflow.clinical.domain.MedicationSchedule;
import vn.clinic.patientflow.clinical.repository.MedicationScheduleRepository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MedicationReminderScheduler {

    private final MedicationScheduleRepository scheduleRepository;
    private final PatientNotificationService notificationService;
    private final vn.clinic.patientflow.common.service.OmniChannelService omniChannelService;

    /**
     * Chạy mỗi phút để kiểm tra và gửi nhắc lịch uống thuốc.
     */
    @Scheduled(cron = "0 * * * * *")
    public void processReminders() {
        Instant now = Instant.now().truncatedTo(ChronoUnit.MINUTES);
        Instant nextMinute = now.plus(1, ChronoUnit.MINUTES);

        log.debug("Checking medication schedules for time: {}", now);

        List<MedicationSchedule> dueSchedules = scheduleRepository.findByStatusAndScheduledTimeBetween("PENDING", now,
                nextMinute);

        if (dueSchedules.isEmpty()) {
            return;
        }

        log.info("Found {} medication schedules due at {}", dueSchedules.size(), now);

        for (MedicationSchedule schedule : dueSchedules) {
            sendNotification(schedule);
        }
    }

    private void sendNotification(MedicationSchedule schedule) {
        var medication = schedule.getMedication();
        var patient = medication.getPrescription().getPatient();

        String title = "🔔 Nhắc uống thuốc: " + medication.getMedicineName();
        String body = String.format("Đã đến giờ uống thuốc: %s (Liều lượng: %s). Đừng quên nhé!",
                medication.getMedicineName(),
                medication.getDosageInstruction() != null ? medication.getDosageInstruction() : "Theo chỉ dẫn");

        Map<String, String> data = Map.of(
                "type", "MEDICATION_REMINDER",
                "scheduleId", schedule.getId().toString(),
                "medicineName", medication.getMedicineName());

        notificationService.notifyPatient(patient.getId(), title, body, data);

        // 2. Gửi Omni-channel (Email, SMS, Zalo)
        omniChannelService.sendMedicationReminder(patient.getFullNameVi(), patient.getEmail(), patient.getPhone(),
                medication.getMedicineName(), medication.getDosageInstruction());
    }
}
