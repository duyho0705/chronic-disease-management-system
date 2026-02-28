package vn.clinic.cdm.api.dto.clinical;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogDto {
    private UUID id;
    private UUID userId;
    private String userEmail;
    private String action;
    private String details;
    private String ipAddress;
    private String userAgent;
    private Instant timestamp;
    private String status;
}
