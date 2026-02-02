package vn.clinic.patientflow.queue.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class QueueBroadcastService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Thông báo cho tất cả client trong một chi nhánh rằng hàng chờ đã thay đổi.
     * Topic format: /topic/queue/{branchId}
     */
    public void broadcastQueueUpdate(UUID branchId) {
        String destination = "/topic/queue/" + branchId;
        log.debug("Broadcasting queue update to {}", destination);

        // Gửi một thông điệp đơn giản để báo hiệu frontend cần refetch data
        // Hoặc có thể gửi luôn danh sách hàng chờ mới nếu muốn tối ưu hơn
        messagingTemplate.convertAndSend(destination, "REFRESH_QUEUE");
    }

    /**
     * Thông báo riêng cho một bệnh nhân (ví dụ: "Đã đến lượt bạn").
     * Topic format: /topic/patient/{patientId}
     */
    public void notifyPatient(UUID patientId, String message) {
        String destination = "/topic/patient/" + patientId;
        log.debug("Notifying patient {} at destination {}", patientId, destination);
        messagingTemplate.convertAndSend(destination, message);
    }
}
