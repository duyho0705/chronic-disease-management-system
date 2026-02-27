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
import java.util.List;

@Data
@Builder
public class DoctorDashboardDto {
    private long totalPatientsToday;
    private long pendingConsultations;
    private long completedConsultationsToday;
    private List<AppointmentDto> upcomingAppointments;
    private List<PatientChatMessageDto> unreadMessages;
    private List<RiskPatientDto> riskPatients;
    private List<String> criticalVitalsAlerts;
}
