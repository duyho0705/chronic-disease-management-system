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
import vn.clinic.patientflow.patient.domain.PatientRelative;

import java.util.UUID;

@Data
@Builder
public class PatientRelativeDto {
    private UUID id;
    private String fullName;
    private String relationship;
    private String phoneNumber;
    private String gender;
    private Integer age;
    private String avatarUrl;

    public static PatientRelativeDto fromEntity(PatientRelative entity) {
        return PatientRelativeDto.builder()
                .id(entity.getId())
                .fullName(entity.getFullName())
                .relationship(entity.getRelationship())
                .phoneNumber(entity.getPhoneNumber())
                .gender(entity.getGender())
                .age(entity.getAge())
                .avatarUrl(entity.getAvatarUrl())
                .build();
    }
}
