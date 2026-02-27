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
import lombok.Data;
import java.time.LocalDate;

@Data
public class AddPatientInsuranceRequest {
    private String insuranceType;
    private String insuranceNumber;
    private String holderName;
    private LocalDate validFrom;
    private LocalDate validTo;
    private Boolean isPrimary;
}
