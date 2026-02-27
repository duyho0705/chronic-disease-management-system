package vn.clinic.patientflow.api.dto.patient;

import vn.clinic.patientflow.api.dto.auth.*;
import vn.clinic.patientflow.api.dto.patient.*;
import vn.clinic.patientflow.api.dto.clinical.*;
import vn.clinic.patientflow.api.dto.ai.*;
import vn.clinic.patientflow.api.dto.medication.*;
import vn.clinic.patientflow.api.dto.scheduling.*;
import vn.clinic.patientflow.api.dto.common.*;
import vn.clinic.patientflow.api.dto.messaging.*;
import vn.clinic.patientflow.api.dto.tenant.*;
import vn.clinic.patientflow.api.dto.billing.*;
import vn.clinic.patientflow.api.dto.report.*;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class PatientCrmInsightDto {
    private String healthScoreLabel; // e.g., "STABLE", "AT_RISK", "CRITICAL_FOLLOWUP"
    private Double adherenceScore; // 0-100% based on appointment/medication history
    private List<CareGap> careGaps;
    private String retentionRisk; // LOW, MEDIUM, HIGH (based on wait times experience)
    private String nextBestAction;
    private String aiSummary;

    @Data
    @Builder
    public static class CareGap {
        private String title;
        private String description;
        private String urgency; // HIGH, MEDIUM, LOW
        private String recommendation;
    }
}
