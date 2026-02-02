package vn.clinic.patientflow.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PharmacyProductDto {
    private UUID id;
    private String code;
    private String nameVi;
    private String genericName;
    private String unit;
    private BigDecimal standardPrice;
    private boolean active;
}
