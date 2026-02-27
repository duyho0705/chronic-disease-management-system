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
import vn.clinic.patientflow.clinical.domain.DiagnosticImage;

import java.util.UUID;

@Data
@Builder
public class DiagnosticImageDto {
    private UUID id;
    private String title;
    private String imageUrl;
    private String description;
    private String recordedAt;

    public static DiagnosticImageDto fromEntity(DiagnosticImage entity) {
        return DiagnosticImageDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .imageUrl(entity.getImageUrl())
                .description(entity.getDescription())
                .recordedAt(entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : null)
                .build();
    }
}
