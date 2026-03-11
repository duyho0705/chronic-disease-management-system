package vn.clinic.cdm.api.portal.doctor;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.clinic.cdm.api.dto.common.ApiResponse;
import vn.clinic.cdm.api.dto.common.PagedResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctor-portal/pharmacy")
@Tag(name = "Doctor Pharmacy", description = "Tìm kiếm danh mục thuốc cho bác sĩ")
@PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
public class DoctorPharmacyController {

    private static final List<Map<String, Object>> MOCK_PRODUCTS = List.of(
            Map.of("id", "001", "name", "Metformin 500mg", "unit", "Viên", "type", "Tiểu đường", "quantity", 100),
            Map.of("id", "002", "name", "Gliclazide 30mg", "unit", "Viên", "type", "Tiểu đường", "quantity", 50),
            Map.of("id", "003", "name", "Amlodipine 5mg", "unit", "Viên", "type", "Huyết áp", "quantity", 200),
            Map.of("id", "004", "name", "Losartan 50mg", "unit", "Viên", "type", "Huyết áp", "quantity", 150),
            Map.of("id", "005", "name", "Lisinopril 10mg", "unit", "Viên", "type", "Huyết áp", "quantity", 80),
            Map.of("id", "006", "name", "Atorvastatin 20mg", "unit", "Viên", "type", "Mỡ máu", "quantity", 120),
            Map.of("id", "007", "name", "Rosuvastatin 10mg", "unit", "Viên", "type", "Mỡ máu", "quantity", 90),
            Map.of("id", "008", "name", "Aspirin 81mg", "unit", "Viên", "type", "Tim mạch", "quantity", 300)
    );

    @GetMapping("/products")
    @Operation(summary = "Tìm kiếm danh mục thuốc để kê đơn")
    public ResponseEntity<ApiResponse<PagedResponse<Map<String, Object>>>> searchProducts(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        String keyword = search.toLowerCase();
        List<Map<String, Object>> filtered = MOCK_PRODUCTS.stream()
                .filter(p -> p.get("name").toString().toLowerCase().contains(keyword))
                .collect(Collectors.toList());

        int totalElements = filtered.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int start = Math.min(page * size, totalElements);
        int end = Math.min((page + 1) * size, totalElements);
        
        List<Map<String, Object>> paginated = filtered.subList(start, end);

        PagedResponse<Map<String, Object>> response = PagedResponse.<Map<String, Object>>builder()
                .content(paginated)
                .page(page)
                .size(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .first(page == 0)
                .last(page >= totalPages - 1 || totalPages == 0)
                .build();

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
