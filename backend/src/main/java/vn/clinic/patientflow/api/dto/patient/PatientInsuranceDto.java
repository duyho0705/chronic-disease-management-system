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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.clinic.patientflow.patient.domain.PatientInsurance;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientInsuranceDto {
        private UUID id;
        private String insuranceType;
        private String insuranceNumber;
        private String holderName;
        private LocalDate validFrom;
        private LocalDate validTo;
        private Boolean isPrimary;

        public static PatientInsuranceDto fromEntity(PatientInsurance entity) {
                if (entity == null)
                        return null;
                return PatientInsuranceDto.builder()
                                .id(entity.getId())
                                .insuranceType(entity.getInsuranceType())
                                .insuranceNumber(entity.getInsuranceNumber())
                                .holderName(entity.getHolderName())
                                .validFrom(entity.getValidFrom())
                                .validTo(entity.getValidTo())
                                .isPrimary(entity.getIsPrimary())
                                .build();
        }
}
