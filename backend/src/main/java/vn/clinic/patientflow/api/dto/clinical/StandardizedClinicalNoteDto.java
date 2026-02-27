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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StandardizedClinicalNoteDto {
    private String soapSubjective;
    private String soapObjective;
    private String soapAssessment;
    private String soapPlan;
    private List<CptCode> suggestedCptCodes;
    private List<Icd10Code> suggestedIcd10Codes;
    private String insuranceMemo;

    @Data
    @Builder
    public static class CptCode {
        private String code;
        private String description;
    }

    @Data
    @Builder
    public static class Icd10Code {
        private String code;
        private String description;
    }
}
