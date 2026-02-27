package vn.clinic.patientflow.api.dto.tenant;

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
import vn.clinic.patientflow.tenant.domain.TenantBranch;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantBranchDto {

    private UUID id;
    private UUID tenantId;
    private String code;
    private String nameVi;
    private String addressLine;
    private String city;
    private String district;
    private String ward;
    private String phone;
    private Boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;

    public static TenantBranchDto fromEntity(TenantBranch e) {
        if (e == null) return null;
        return TenantBranchDto.builder()
                .id(e.getId())
                .tenantId(e.getTenant() != null ? e.getTenant().getId() : null)
                .code(e.getCode())
                .nameVi(e.getNameVi())
                .addressLine(e.getAddressLine())
                .city(e.getCity())
                .district(e.getDistrict())
                .ward(e.getWard())
                .phone(e.getPhone())
                .isActive(e.getIsActive())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}
