package vn.clinic.patientflow.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PatientPortalStatusDto {
    private String patientName;
    private String queueName;
    private String status;
    private long peopleAhead;
    private Integer estimatedWaitMinutes;
}
