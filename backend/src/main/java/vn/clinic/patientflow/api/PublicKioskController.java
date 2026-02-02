package vn.clinic.patientflow.api;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import vn.clinic.patientflow.api.dto.KioskRegistrationRequest;
import vn.clinic.patientflow.api.dto.QueueDefinitionDto;
import vn.clinic.patientflow.api.dto.QueueEntryDto;
import vn.clinic.patientflow.patient.domain.Patient;
import vn.clinic.patientflow.patient.repository.PatientRepository;
import vn.clinic.patientflow.queue.domain.QueueEntry;
import vn.clinic.patientflow.queue.repository.QueueDefinitionRepository;
import vn.clinic.patientflow.queue.service.QueueService;
import vn.clinic.patientflow.tenant.domain.TenantBranch;
import vn.clinic.patientflow.tenant.repository.TenantBranchRepository;

@RestController
@RequestMapping("/api/public/kiosk")
@RequiredArgsConstructor
@Tag(name = "Public Kiosk", description = "Endpoints cho máy Kiosk tự phục vụ")
public class PublicKioskController {

        private final PatientRepository patientRepository;
        private final TenantBranchRepository branchRepository;
        private final QueueService queueService;
        private final QueueDefinitionRepository queueDefinitionRepository;

        @GetMapping("/queues")
        @Operation(summary = "Lấy danh sách hàng chờ công khai cho Kiosk")
        public ResponseEntity<List<QueueDefinitionDto>> getPublicQueues(@RequestParam UUID branchId) {
                return ResponseEntity.ok(queueDefinitionRepository
                                .findByBranchIdAndIsActiveTrueOrderByDisplayOrderAsc(branchId).stream()
                                .map(QueueDefinitionDto::fromEntity)
                                .collect(Collectors.toList()));
        }

        @PostMapping("/register")
        @Operation(summary = "Bệnh nhân tự đăng ký và lấy số thứ tự tại Kiosk")
        public ResponseEntity<QueueEntryDto> register(@RequestBody KioskRegistrationRequest request) {
                TenantBranch branch = branchRepository.findById(request.getBranchId())
                                .orElseThrow(() -> new RuntimeException("Branch not found"));

                // 1. Find or create patient
                Patient patient = patientRepository
                                .findByTenantIdAndPhone(branch.getTenant().getId(), request.getPhone())
                                .orElseGet(() -> {
                                        Patient newPatient = Patient.builder()
                                                        .tenant(branch.getTenant())
                                                        .fullNameVi(request.getFullName())
                                                        .phone(request.getPhone())
                                                        .dateOfBirth(request.getDateOfBirth())
                                                        .isActive(true)
                                                        .build();
                                        return patientRepository.save(newPatient);
                                });

                // 2. Join queue
                QueueEntry entry = queueService.createEntry(
                                request.getQueueDefinitionId(),
                                patient.getId(),
                                null,
                                request.getAppointmentId(),
                                null // Integer position can be null
                );

                return ResponseEntity.ok(QueueEntryDto.fromEntity(entry));
        }
}
