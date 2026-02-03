package vn.clinic.patientflow.patient.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.clinic.patientflow.common.notification.NotificationService;
import vn.clinic.patientflow.patient.domain.Patient;
import vn.clinic.patientflow.patient.domain.PatientDeviceToken;
import vn.clinic.patientflow.patient.repository.PatientDeviceTokenRepository;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientNotificationService {

    private final PatientDeviceTokenRepository tokenRepository;
    private final NotificationService fcmService;

    @Transactional
    public void registerToken(Patient patient, String fcmToken, String deviceType) {
        tokenRepository.findByFcmToken(fcmToken).ifPresentOrElse(
                existing -> {
                    existing.setPatient(patient);
                    existing.setDeviceType(deviceType);
                    existing.setLastSeenAt(Instant.now());
                    tokenRepository.save(existing);
                },
                () -> {
                    PatientDeviceToken newToken = PatientDeviceToken.builder()
                            .patient(patient)
                            .fcmToken(fcmToken)
                            .deviceType(deviceType)
                            .lastSeenAt(Instant.now())
                            .build();
                    tokenRepository.save(newToken);
                });
    }

    public void notifyPatient(UUID patientId, String title, String body, Map<String, String> data) {
        var tokens = tokenRepository.findByPatientId(patientId);
        if (tokens.isEmpty()) {
            log.warn("No FCM tokens found for patient {}", patientId);
            return;
        }

        for (var token : tokens) {
            fcmService.sendPushNotification(token.getFcmToken(), title, body, data);
        }
    }
}
