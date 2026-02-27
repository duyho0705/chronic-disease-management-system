package vn.clinic.patientflow.api.dto.scheduling;

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
import vn.clinic.patientflow.scheduling.domain.SchedulingAppointment;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {
    private UUID id;
    private UUID patientId;
    private String patientName;
    private LocalDate date;
    private String startTime;
    private String status;
    private String type;

    public static AppointmentDto fromEntity(SchedulingAppointment a) {
        if (a == null)
            return null;
        return AppointmentDto.builder()
                .id(a.getId())
                .patientId(a.getPatient() != null ? a.getPatient().getId() : null)
                .patientName(a.getPatient() != null ? a.getPatient().getFullNameVi() : null)
                .date(a.getAppointmentDate())
                .startTime(a.getSlotStartTime() != null ? a.getSlotStartTime().toString() : "")
                .status(a.getStatus())
                .type(a.getAppointmentType())
                .build();
    }
}
