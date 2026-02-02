package vn.clinic.patientflow.api.dto;

import lombok.Builder;
import lombok.Data;
import vn.clinic.patientflow.billing.domain.InvoiceItem;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class InvoiceItemDto {
    private UUID id;
    private String itemCode;
    private String itemName;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;

    public static InvoiceItemDto fromEntity(InvoiceItem item) {
        return InvoiceItemDto.builder()
                .id(item.getId())
                .itemCode(item.getItemCode())
                .itemName(item.getItemName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .lineTotal(item.getLineTotal())
                .build();
    }
}
