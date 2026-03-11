/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AiChatRequest } from '../models/AiChatRequest';
import type { ApiResponseClinicalChecklistDto } from '../models/ApiResponseClinicalChecklistDto';
import type { ApiResponseComplicationRiskDto } from '../models/ApiResponseComplicationRiskDto';
import type { ApiResponseDifferentialDiagnosisDto } from '../models/ApiResponseDifferentialDiagnosisDto';
import type { ApiResponseFollowUpSuggestionDto } from '../models/ApiResponseFollowUpSuggestionDto';
import type { ApiResponseIcd10CodeDto } from '../models/ApiResponseIcd10CodeDto';
import type { ApiResponsePrescriptionVerificationDto } from '../models/ApiResponsePrescriptionVerificationDto';
import type { ApiResponseStandardizedClinicalNoteDto } from '../models/ApiResponseStandardizedClinicalNoteDto';
import type { ApiResponseString } from '../models/ApiResponseString';
import type { ApiResponseTreatmentEfficacyDto } from '../models/ApiResponseTreatmentEfficacyDto';
import type { PrescriptionItemDto } from '../models/PrescriptionItemDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DoctorAiSupportService {
    /**
     * AI Kiá»ƒm tra Ä‘Æ¡n thuá»‘c
     * @param id
     * @param requestBody
     * @returns ApiResponsePrescriptionVerificationDto OK
     * @throws ApiError
     */
    public static verifyPrescription(
        id: string,
        requestBody: Array<PrescriptionItemDto>,
    ): CancelablePromise<ApiResponsePrescriptionVerificationDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/doctor-portal/ai-support/{id}/verify-prescription',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Gá»£i Ã½ mÃ£ ICD-10 dá»±a trÃªn cháº©n Ä‘oÃ¡n
     * @param id
     * @param requestBody
     * @returns ApiResponseIcd10CodeDto OK
     * @throws ApiError
     */
    public static suggestIcd10(
        id: string,
        requestBody: string,
    ): CancelablePromise<ApiResponseIcd10CodeDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/doctor-portal/ai-support/{id}/icd10-suggest',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Xuáº¥t bÃ¡o cÃ¡o CDM (PDF)
     * @param id
     * @param requestBody
     * @returns binary OK
     * @throws ApiError
     */
    public static downloadCdmReport(
        id: string,
        requestBody?: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/doctor-portal/ai-support/{id}/cdm-report',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Gá»­i bÃ¡o cÃ¡o CDM cho bá»‡nh nhÃ¢n (Email & Push)
     * @param id
     * @param requestBody
     * @returns ApiResponseString OK
     * @throws ApiError
     */
    public static sendCdmReport(
        id: string,
        requestBody?: string,
    ): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/doctor-portal/ai-support/{id}/cdm-report/send',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * AI Há»— trá»£ cháº©n Ä‘oÃ¡n vÃ  tÃ³m táº¯t ca lÃ¢m sÃ ng
     * @param id
     * @returns ApiResponseString OK
     * @throws ApiError
     */
    public static getAiClinicalSupport(
        id: string,
    ): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/doctor-portal/ai-support/{id}/ai-clinical-support',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Chat vá»›i AI Clinical Assistant vá» ca bá»‡nh
     * @param id
     * @param requestBody
     * @returns ApiResponseString OK
     * @throws ApiError
     */
    public static aiClinicalChat(
        id: string,
        requestBody: AiChatRequest,
    ): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/doctor-portal/ai-support/{id}/ai-chat',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Gá»­i nháº¯c nhá»Ÿ uá»‘ng thuá»‘c thá»§ cÃ´ng qua Ä‘a kÃªnh
     * @param reminderId
     * @returns ApiResponseString OK
     * @throws ApiError
     */
    public static triggerMedicationReminder(
        reminderId: string,
    ): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/doctor-portal/ai-support/reminders/{reminderId}/trigger',
            path: {
                'reminderId': reminderId,
            },
        });
    }
    /**
     * AI PhÃ¢n tÃ­ch hiá»‡u quáº£ phÃ¡c Ä‘á»“ Ä‘iá»u trá»‹
     * @param id
     * @returns ApiResponseTreatmentEfficacyDto OK
     * @throws ApiError
     */
    public static getTreatmentEfficacy(
        id: string,
    ): CancelablePromise<ApiResponseTreatmentEfficacyDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/ai-support/{id}/treatment-efficacy',
            path: {
                'id': id,
            },
        });
    }
    /**
     * AI Gá»£i Ã½ phÃ¡c Ä‘á»“ Ä‘iá»u trá»‹ máº«u phÃ¹ há»£p vá»›i cháº©n Ä‘oÃ¡n
     * @param id
     * @returns ApiResponseString OK
     * @throws ApiError
     */
    public static getSuggestedTemplates(
        id: string,
    ): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/ai-support/{id}/suggested-templates',
            path: {
                'id': id,
            },
        });
    }
    /**
     * AI Chuáº©n hÃ³a há»“ sÆ¡ SOAP & Gá»£i Ã½ mÃ£ Billing (CPT/ICD10)
     * @param id
     * @returns ApiResponseStandardizedClinicalNoteDto OK
     * @throws ApiError
     */
    public static getStandardizedClinicalNote(
        id: string,
    ): CancelablePromise<ApiResponseStandardizedClinicalNoteDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/ai-support/{id}/standardized-note',
            path: {
                'id': id,
            },
        });
    }
    /**
     * AI phÃ¢n tÃ­ch vÃ  giáº£i thÃ­ch káº¿t quáº£ xÃ©t nghiá»‡m
     * @param id
     * @returns ApiResponseString OK
     * @throws ApiError
     */
    public static interpretLabResults(
        id: string,
    ): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/ai-support/{id}/lab-interpretation',
            path: {
                'id': id,
            },
        });
    }
    /**
     * AI Gá»£i Ã½ thá»i Ä‘iá»ƒm tÃ¡i khÃ¡m dá»±a trÃªn tÃ¬nh tráº¡ng bá»‡nh
     * @param id
     * @returns ApiResponseFollowUpSuggestionDto OK
     * @throws ApiError
     */
    public static getFollowUpSuggestion(
        id: string,
    ): CancelablePromise<ApiResponseFollowUpSuggestionDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/ai-support/{id}/follow-up-suggestion',
            path: {
                'id': id,
            },
        });
    }
    /**
     * AI táº¡o hÆ°á»›ng dáº«n xuáº¥t viá»‡n cho bá»‡nh nhÃ¢n
     * @param id
     * @returns ApiResponseString OK
     * @throws ApiError
     */
    public static getDischargeInstructions(
        id: string,
    ): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/ai-support/{id}/discharge-instructions',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Láº¥y gá»£i Ã½ cháº©n Ä‘oÃ¡n phÃ¢n biá»‡t tá»« AI
     * @param id
     * @returns ApiResponseDifferentialDiagnosisDto OK
     * @throws ApiError
     */
    public static getDifferentialDiagnosis(
        id: string,
    ): CancelablePromise<ApiResponseDifferentialDiagnosisDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/ai-support/{id}/differential-diagnosis',
            path: {
                'id': id,
            },
        });
    }
    /**
     * AI Dá»± bÃ¡o nguy cÆ¡ biáº¿n chá»©ng bá»‡nh ná»n
     * @param id
     * @returns ApiResponseComplicationRiskDto OK
     * @throws ApiError
     */
    public static getComplicationRisk(
        id: string,
    ): CancelablePromise<ApiResponseComplicationRiskDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/ai-support/{id}/complication-risk',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Láº¥y checklist thÄƒm khÃ¡m gá»£i Ã½ tá»« AI
     * @param id
     * @returns ApiResponseClinicalChecklistDto OK
     * @throws ApiError
     */
    public static getClinicalChecklist(
        id: string,
    ): CancelablePromise<ApiResponseClinicalChecklistDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/ai-support/{id}/clinical-checklist',
            path: {
                'id': id,
            },
        });
    }
    /**
     * AI Táº¡o káº¿ hoáº¡ch chÄƒm sÃ³c dÃ i háº¡n (Long-term Care Plan)
     * @param id
     * @returns ApiResponseString OK
     * @throws ApiError
     */
    public static getCarePlan(
        id: string,
    ): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/ai-support/{id}/care-plan',
            path: {
                'id': id,
            },
        });
    }
}
