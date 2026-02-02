package vn.clinic.patientflow.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class CreateInvoiceRequest {
    @NotNull
    private UUID patientId;

    private UUID branchId;

    private UUID consultationId;

    private BigDecimal discountAmount;

    private String notes;

    @NotEmpty
    private List<ItemRequest> items;

    @Data
    public static class ItemRequest {
        private String itemCode;
        @NotBlank
        private String itemName;
        @NotNull
        private BigDecimal quantity;
        @NotNull
        private BigDecimal unitPrice;
    }
}
