package vn.clinic.patientflow.api.dto.clinical;

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
import java.time.Instant;

@Data
@Builder
public class TimelineItemDto {
    private String id;
    private String type; // CONSULTATION, PRESCRIPTION, VITAL_LOG
    private Instant timestamp;
    private String title;
    private String subtitle;
    private String content;
    private String status;
}
