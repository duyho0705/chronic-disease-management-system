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

import vn.clinic.patientflow.api.dto.medication.PrescriptionItemDto;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ConsultationSummaryPdfDto {
    private UUID consultationId;
    private String patientName;
    private String patientDob;
    private String patientGender;
    private String doctorName;
    private Instant consultationDate;
    private String diagnosis;
    private String chiefComplaint;
    private String clinicalNotes;

    // Vitals
    private List<VitalDto> vitals;

    // Lab Results
    private List<LabResultDto> labResults;

    // Prescription
    private List<PrescriptionItemDto> prescriptionItems;
    private String prescriptionNotes;

    // Imaging
    private List<ImagingDto> imagingResults;

    @Data
    @Builder
    public static class VitalDto {
        private String type;
        private String value;
        private String unit;
    }

    @Data
    @Builder
    public static class ImagingDto {
        private String title;
        private String description;
    }
}
