package vn.clinic.cdm.api.dto.auth;

import jakarta.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialLoginRequest {
    @NotBlank(message = "Firebase ID Token is required")
    private String idToken;

    private UUID tenantId;

    private UUID branchId;
}
