package vn.clinic.patientflow.triage.ai;

import vn.clinic.patientflow.triage.ai.AiTriageService.TriageInput;
import vn.clinic.patientflow.triage.ai.AiTriageService.TriageSuggestionResult;

/**
 * Provider gợi ý mức độ ưu tiên (acuity) từ lý do khám và sinh hiệu.
 * Implementations: rule-based, external API, LLM. Cho phép thay thế không đụng nghiệp vụ.
 */
public interface AiTriageProvider {

    /**
     * Gợi ý acuity và độ tin cậy (0–1). Không ghi DB.
     */
    TriageSuggestionResult suggest(TriageInput input);

    /**
     * Loại provider (rule-based, openai, rest, ...) để cấu hình chọn.
     */
    String getProviderKey();
}
