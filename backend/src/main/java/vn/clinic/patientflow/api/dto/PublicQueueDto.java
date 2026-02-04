package vn.clinic.patientflow.api.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class PublicQueueDto {
    private List<QueueEntryDto> calledEntries;
    private List<QueueEntryDto> waitingEntries;
}
