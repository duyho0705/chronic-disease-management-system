package vn.clinic.patientflow.clinical.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.clinic.patientflow.clinical.repository.ClinicalConsultationRepository;
import vn.clinic.patientflow.clinical.repository.PrescriptionRepository;
import vn.clinic.patientflow.patient.repository.PatientRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Báo cáo thống kê cho Clinic Manager (Role 3).
 */
@Service
@RequiredArgsConstructor
public class ReportingService {

    private final PatientRepository patientRepository;
    private final ClinicalConsultationRepository consultationRepository;
    private final PrescriptionRepository prescriptionRepository;

    public Map<String, Object> getClinicStats(UUID tenantId) {

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalConsultations30Days", consultationRepository.count()); // simplified
        stats.put("totalPrescriptions30Days", prescriptionRepository.count()); // simplified

        // In real app, filter by tenantId and date range
        return stats;
    }
}
