/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseCdsAdviceDto } from '../models/ApiResponseCdsAdviceDto';
import type { ApiResponseClinicalEarlyWarningDto } from '../models/ApiResponseClinicalEarlyWarningDto';
import type { ApiResponseListDiagnosticImageDto } from '../models/ApiResponseListDiagnosticImageDto';
import type { ApiResponseListLabResultDto } from '../models/ApiResponseListLabResultDto';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DoctorConsultationService {
    /**
     * Chá»‰ Ä‘á»‹nh chá»¥p X-Quang/SiÃªu Ã¢m
     * @param id
     * @param requestBody
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static orderDiagnosticImage(
        id: string,
        requestBody: string,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/doctor-portal/consultations/{id}/diagnostic-images/order',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Xuáº¥t PDF Ä‘Æ¡n thuá»‘c vÃ  tÃ³m táº¯t ca khÃ¡m
     * @param id
     * @returns binary OK
     * @throws ApiError
     */
    public static exportPdf(
        id: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/consultations/{id}/pdf',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Láº¥y káº¿t quáº£ xÃ©t nghiá»‡m cá»§a ca khÃ¡m
     * @param id
     * @returns ApiResponseListLabResultDto OK
     * @throws ApiError
     */
    public static getLabResults(
        id: string,
    ): CancelablePromise<ApiResponseListLabResultDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/consultations/{id}/lab-results',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Há»‡ thá»‘ng cáº£nh bÃ¡o sá»›m (NEWS2 Monitor)
     * @param id
     * @returns ApiResponseClinicalEarlyWarningDto OK
     * @throws ApiError
     */
    public static getEarlyWarning(
        id: string,
    ): CancelablePromise<ApiResponseClinicalEarlyWarningDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/consultations/{id}/early-warning',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Láº¥y hÃ¬nh áº£nh cháº©n Ä‘oÃ¡n cá»§a ca khÃ¡m
     * @param id
     * @returns ApiResponseListDiagnosticImageDto OK
     * @throws ApiError
     */
    public static getDiagnosticImages(
        id: string,
    ): CancelablePromise<ApiResponseListDiagnosticImageDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/consultations/{id}/diagnostic-images',
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
    public static getCdsAdvice(
        id: string,
    ): CancelablePromise<ApiResponseCdsAdviceDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/consultations/{id}/cds-advice',
            path: {
                'id': id,
            },
        });
    }
}
