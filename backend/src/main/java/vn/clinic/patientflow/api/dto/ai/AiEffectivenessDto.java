package vn.clinic.patientflow.api.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * Report DTO: Tỷ lệ hiệu quả của AI trong phân loại bệnh nhân.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiEffectivenessDto {

    private String branchId;
    private String branchName;
    private LocalDate fromDate;
    private LocalDate toDate;

    /** Tổng số phiên phân loại trong kỳ. */
    private long totalSessions;
    /** Số phiên có dùng gợi ý AI (acuity_source = AI hoặc HYBRID). */
    private long aiSessions;
    /** Số phiên chỉ do người (acuity_source = HUMAN). */
    private long humanSessions;

    /**
     * Số phiên có AI gợi ý mà bác sĩ/y tá chấp nhận (ai_suggested_acuity =
     * acuity_level).
     */
    private long matchCount;
    /** Số phiên có ghi override (override_reason not null). */
    private long overrideCount;

    /** Tỷ lệ khớp (matchCount / aiSessions) nếu aiSessions > 0, 0–1. */
    private Double matchRate;
    /** Tỷ lệ override (overrideCount / aiSessions) nếu aiSessions > 0, 0–1. */
    private Double overrideRate;
}
