package vn.clinic.patientflow.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicDisplayDto {
    private String branchName;
    private List<DisplayEntryDto> calling;
    private List<DisplayEntryDto> waiting;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DisplayEntryDto {
        private String patientName;
        private String queueName; // e.g., Phòng khám 1, Xét nghiệm
        private String status;
        private String acuityLevel;
    }
}
