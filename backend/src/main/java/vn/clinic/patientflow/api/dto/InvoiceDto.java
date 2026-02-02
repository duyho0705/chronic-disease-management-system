package vn.clinic.patientflow.api.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import lombok.Builder;
import lombok.Data;
import vn.clinic.patientflow.billing.domain.Invoice;

@Data
@Builder
public class InvoiceDto {
    private UUID id;
    private String invoiceNumber;
    private UUID patientId;
    private String patientName;
    private UUID consultationId;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private String status;
    private String paymentMethod;
    private Instant paidAt;
    private Instant createdAt;
    private List<InvoiceItemDto> items;

    public static InvoiceDto fromEntity(Invoice invoice) {
        return InvoiceDto.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .patientId(invoice.getPatient().getId())
                .patientName(invoice.getPatient().getFullNameVi())
                .consultationId(invoice.getConsultation() != null ? invoice.getConsultation().getId() : null)
                .totalAmount(invoice.getTotalAmount())
                .discountAmount(invoice.getDiscountAmount())
                .finalAmount(invoice.getFinalAmount())
                .status(invoice.getStatus())
                .paymentMethod(invoice.getPaymentMethod())
                .paidAt(invoice.getPaidAt())
                .createdAt(invoice.getCreatedAt())
                .items(invoice.getItems().stream().map(InvoiceItemDto::fromEntity).collect(Collectors.toList()))
                .build();
    }
}
