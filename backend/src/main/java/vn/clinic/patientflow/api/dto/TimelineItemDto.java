package vn.clinic.patientflow.api.dto;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;

@Data
@Builder
public class TimelineItemDto {
    private String id;
    private String type; // TRIAGE, CONSULTATION, INVOICE, PRESCRIPTION
    private Instant timestamp;
    private String title;
    private String subtitle;
    private String content;
    private String status;
}
