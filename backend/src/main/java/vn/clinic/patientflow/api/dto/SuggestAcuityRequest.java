package vn.clinic.patientflow.api.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Request gợi ý acuity (không tạo session). Dùng trước khi gọi POST /triage/sessions.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuggestAcuityRequest {

    /** Lý do đến khám (tự do). */
    @Size(max = 2000)
    private String chiefComplaintText;

    /** Tuổi (năm); nếu null và có patientId thì lấy từ patient. */
    private Integer ageInYears;

    /** Nếu có: dùng để lấy tuổi và tenant. */
    private UUID patientId;

    /** Sinh hiệu: type -> value (VD TEMPERATURE -> 38.5). */
    private List<VitalItem> vitals;

    /** Mã triệu chứng (tùy chọn). */
    private List<String> complaintTypes;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VitalItem {
        @Size(max = 32)
        private String vitalType;
        private java.math.BigDecimal valueNumeric;
        @Size(max = 20)
        private String unit;
    }
}
