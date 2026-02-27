package vn.clinic.patientflow.api.portal.doctor;

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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.clinic.patientflow.api.dto.common.ApiResponse;
import vn.clinic.patientflow.api.dto.clinical.DoctorInfoDto;
import vn.clinic.patientflow.auth.AuthPrincipal;
import vn.clinic.patientflow.identity.service.IdentityService;

import java.util.UUID;

@RestController
@RequestMapping("/api/doctor-portal/profile")
@RequiredArgsConstructor
@Tag(name = "Doctor Profile", description = "Quản lý hồ sơ bác sĩ")
@PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
public class DoctorProfileController {

        private final IdentityService identityService;

        @GetMapping
        @Operation(summary = "Lấy thông tin cá nhân của bác sĩ")
        public ResponseEntity<ApiResponse<DoctorInfoDto>> getProfile() {
                UUID userId = AuthPrincipal.getCurrentUserId();
                var user = identityService.getUserById(userId);

                String specialty = user.getUserRoles().stream()
                                .filter(ur -> ur.getRole().getCode().contains("DOCTOR")
                                                || ur.getRole().getCode().contains("SPECIALIST"))
                                .map(ur -> ur.getRole().getNameVi())
                                .findFirst()
                                .orElse("Bác sĩ");

                var data = DoctorInfoDto.builder()
                                .id(user.getId())
                                .name(user.getFullNameVi())
                                .specialty(specialty)
                                .online(true)
                                .build();
                return ResponseEntity.ok(ApiResponse.success(data));
        }
}
