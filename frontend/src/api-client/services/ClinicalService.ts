/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseCdsAdviceDto } from '../models/ApiResponseCdsAdviceDto';
import type { ApiResponseClinicalEarlyWarningDto } from '../models/ApiResponseClinicalEarlyWarningDto';
import type { ApiResponseConsultationDto } from '../models/ApiResponseConsultationDto';
import type { ApiResponseListConsultationDto } from '../models/ApiResponseListConsultationDto';
import type { ApiResponseListTriageVitalDto } from '../models/ApiResponseListTriageVitalDto';
import type { ApiResponsePrescription } from '../models/ApiResponsePrescription';
import type { CreateConsultationRequest } from '../models/CreateConsultationRequest';
import type { CreatePrescriptionRequest } from '../models/CreatePrescriptionRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClinicalService {
    /**
     * Báº¯t Ä‘áº§u phiÃªn khÃ¡m tá»« hÃ ng chá»
     * @param requestBody
     * @returns ApiResponseConsultationDto Created
     * @throws ApiError
     */
    public static startConsultation(
        requestBody: CreateConsultationRequest,
    ): CancelablePromise<ApiResponseConsultationDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/clinical/consultations',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * HoÃ n táº¥t phiÃªn khÃ¡m
     * @param id
     * @returns ApiResponseConsultationDto OK
     * @throws ApiError
     */
    public static completeConsultation(
        id: string,
    ): CancelablePromise<ApiResponseConsultationDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/clinical/consultations/{id}/complete',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Táº¡o Ä‘Æ¡n thuá»‘c
     * @param requestBody
     * @returns ApiResponsePrescription OK
     * @throws ApiError
     */
    public static createPrescription1(
        requestBody: CreatePrescriptionRequest,
    ): CancelablePromise<ApiResponsePrescription> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/clinical/consultations/prescriptions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Láº¥y thÃ´ng tin phiáº¿u khÃ¡m
     * @param id
     * @returns ApiResponseConsultationDto OK
     * @throws ApiError
     */
    public static getById2(
        id: string,
    ): CancelablePromise<ApiResponseConsultationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/clinical/consultations/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Cáº­p nháº­t ghi chÃº thÄƒm khÃ¡m
     * @param id
     * @param requestBody
     * @returns ApiResponseConsultationDto OK
     * @throws ApiError
     */
    public static updateConsultation(
        id: string,
        requestBody: CreateConsultationRequest,
    ): CancelablePromise<ApiResponseConsultationDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/clinical/consultations/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Láº¥y sinh hiá»‡u cá»§a phiÃªn khÃ¡m
     * @param id
     * @returns ApiResponseListTriageVitalDto OK
     * @throws ApiError
     */
    public static getVitals(
        id: string,
    ): CancelablePromise<ApiResponseListTriageVitalDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/clinical/consultations/{id}/vitals',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Cáº£nh bÃ¡o sá»›m & Theo dÃµi chá»‰ sá»‘ bá»‡nh mÃ£n tÃ­nh AI
     * @param id
     * @returns ApiResponseClinicalEarlyWarningDto OK
     * @throws ApiError
     */
    public static getEarlyWarning1(
        id: string,
    ): CancelablePromise<ApiResponseClinicalEarlyWarningDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/clinical/consultations/{id}/early-warning',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Há»— trá»£ quyáº¿t Ä‘á»‹nh lÃ¢m sÃ ng (Enterprise CDS)
     * @param id
     * @returns ApiResponseCdsAdviceDto OK
     * @throws ApiError
     */
    public static getCdsAdvice1(
        id: string,
    ): CancelablePromise<ApiResponseCdsAdviceDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/clinical/consultations/{id}/cds-advice',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Lá»‹ch sá»­ khÃ¡m bá»‡nh cá»§a bá»‡nh nhÃ¢n
     * @param patientId
     * @returns ApiResponseListConsultationDto OK
     * @throws ApiError
     */
    public static getHistory1(
        patientId: string,
    ): CancelablePromise<ApiResponseListConsultationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/clinical/consultations/history',
            query: {
                'patientId': patientId,
            },
        });
    }
}
