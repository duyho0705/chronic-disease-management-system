package vn.clinic.patientflow.api.dto.ai;

// Unused DTO imports removed
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowUpSuggestionDto {
    private Integer suggestedInDays;
    private String reasoning;
    private String priority;
    private List<String> clinicalGoals;
}
