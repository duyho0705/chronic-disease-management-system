package vn.clinic.patientflow.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vn.clinic.patientflow.api.dto.PatientPortalStatusDto;
import vn.clinic.patientflow.queue.domain.QueueEntry;
import vn.clinic.patientflow.queue.repository.QueueEntryRepository;

import java.util.Arrays;
import java.util.UUID;

@RestController
@RequestMapping("/api/portal")
@RequiredArgsConstructor
@Tag(name = "Portal", description = "Cổng thông tin cho người bệnh")
public class PortalController {

    private final QueueEntryRepository queueEntryRepository;
    private final vn.clinic.patientflow.patient.repository.PatientRepository patientRepository;

    @GetMapping("/status/{patientId}")
    @Operation(summary = "Lấy trạng thái hàng chờ của bệnh nhân")
    public PatientPortalStatusDto getStatus(@PathVariable UUID patientId) {
        var patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new vn.clinic.patientflow.common.exception.ResourceNotFoundException("Patient",
                        patientId));

        QueueEntry activeEntry = queueEntryRepository.findFirstByPatientIdAndStatusInOrderByJoinedAtDesc(
                patientId, Arrays.asList("WAITING", "CALLING"))
                .orElse(null);

        if (activeEntry == null) {
            return PatientPortalStatusDto.builder()
                    .patientName(patient.getFullNameVi())
                    .status("NO_ACTIVE_QUEUE")
                    .build();
        }

        long ahead = queueEntryRepository.countPeopleAhead(activeEntry.getQueueDefinition().getId(),
                activeEntry.getJoinedAt());

        return PatientPortalStatusDto.builder()
                .patientName(patient.getFullNameVi())
                .queueName(activeEntry.getQueueDefinition().getNameVi())
                .status(activeEntry.getStatus())
                .peopleAhead(ahead)
                .estimatedWaitMinutes((int) ahead * 10) // Giả định 10 phút mỗi lượt
                .build();
    }
}
