package vn.clinic.patientflow.api.dto.auth;

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
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class UpdateUserRequest {

    @Size(max = 255)
    private String fullNameVi;

    private Boolean isActive;

    @Size(max = 20)
    private String phone;


    /** Nếu có: thay thế toàn bộ gán role của user. */
    private List<UserRoleAssignmentInput> roleAssignments;

    @Data
    public static class UserRoleAssignmentInput {
        private java.util.UUID tenantId;
        private String roleCode;
        private java.util.UUID branchId;
    }
}
