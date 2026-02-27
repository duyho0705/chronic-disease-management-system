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
import vn.clinic.patientflow.clinical.domain.LabResult;

import java.util.UUID;

@Data
@Builder
public class LabResultDto {
    private UUID id;
    private String testName;
    private String value;
    private String unit;
    private String referenceRange;
    private String status; // NORMAL, HIGH, LOW

    public static LabResultDto fromEntity(LabResult entity) {
        return LabResultDto.builder()
                .id(entity.getId())
                .testName(entity.getTestName())
                .value(entity.getValue())
                .unit(entity.getUnit())
                .referenceRange(entity.getReferenceRange())
                .status(entity.getStatus())
                .build();
    }
}
