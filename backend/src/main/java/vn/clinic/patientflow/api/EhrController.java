package vn.clinic.patientflow.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vn.clinic.patientflow.api.dto.*;
import vn.clinic.patientflow.clinical.repository.ClinicalConsultationRepository;
import vn.clinic.patientflow.clinical.repository.PrescriptionRepository;
import vn.clinic.patientflow.billing.repository.InvoiceRepository;
import vn.clinic.patientflow.triage.repository.TriageSessionRepository;
import vn.clinic.patientflow.triage.repository.TriageVitalRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ehr")
@RequiredArgsConstructor
@Tag(name = "EHR", description = "Hồ sơ sức khỏe điện tử")
public class EhrController {

    private final TriageVitalRepository vitalRepository;
    private final TriageSessionRepository triageRepository;
    private final ClinicalConsultationRepository consultationRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final InvoiceRepository invoiceRepository;

    @GetMapping("/patient/{patientId}/vitals")
    @Operation(summary = "Lấy lịch sử dấu hiệu sinh tồn")
    public List<TriageVitalDto> getVitalsHistory(@PathVariable UUID patientId) {
        return vitalRepository.findByPatientId(patientId).stream()
                .map(v -> new TriageVitalDto(v.getId(), v.getVitalType(), v.getValueNumeric(), v.getUnit(),
                        v.getRecordedAt()))
                .collect(Collectors.toList());
    }

    @GetMapping("/patient/{patientId}/timeline")
    @Operation(summary = "Lấy dòng thời gian y tế của bệnh nhân")
    public List<TimelineItemDto> getTimeline(@PathVariable UUID patientId) {
        List<TimelineItemDto> timeline = new ArrayList<>();

        // 1. Triage Sessions
        triageRepository
                .findByPatientIdOrderByStartedAtDesc(patientId, org.springframework.data.domain.PageRequest.of(0, 50))
                .forEach(s -> timeline.add(TimelineItemDto.builder()
                        .id(s.getId().toString())
                        .type("TRIAGE")
                        .timestamp(s.getStartedAt())
                        .title("Phân loại bệnh")
                        .subtitle(s.getBranch().getNameVi())
                        .content("Mức độ ưu tiên: " + s.getAcuityLevel())
                        .status("COMPLETED")
                        .build()));

        // 2. Consultations
        consultationRepository.findByPatientIdOrderByStartedAtDesc(patientId)
                .forEach(c -> timeline.add(TimelineItemDto.builder()
                        .id(c.getId().toString())
                        .type("CONSULTATION")
                        .timestamp(c.getStartedAt())
                        .title("Khám bệnh")
                        .subtitle("BS. " + c.getDoctorName())
                        .content(c.getDiagnosisNotes())
                        .status(c.getStatus())
                        .build()));

        // 3. Invoices
        invoiceRepository.findAll().stream() // Ideally we should have findByPatientId in InvoiceRepository
                .filter(i -> i.getPatientId().equals(patientId))
                .forEach(i -> timeline.add(TimelineItemDto.builder()
                        .id(i.getId().toString())
                        .type("INVOICE")
                        .timestamp(i.getCreatedAt())
                        .title("Hóa đơn")
                        .subtitle("Mã: " + i.getInvoiceNumber())
                        .content("Tổng tiền: " + i.getTotalAmount().toPlainString() + " đ")
                        .status(i.getStatus())
                        .build()));

        return timeline.stream()
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .collect(Collectors.toList());
    }
}
