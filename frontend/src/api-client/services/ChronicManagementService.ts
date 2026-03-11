/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListPatientChronicCondition } from '../models/ApiResponseListPatientChronicCondition';
import type { ApiResponseListPatientVitalTarget } from '../models/ApiResponseListPatientVitalTarget';
import type { ApiResponseListVitalHistoryDto } from '../models/ApiResponseListVitalHistoryDto';
import type { ApiResponsePatientChronicCondition } from '../models/ApiResponsePatientChronicCondition';
import type { ApiResponsePatientVitalTarget } from '../models/ApiResponsePatientVitalTarget';
import type { PatientChronicCondition } from '../models/PatientChronicCondition';
import type { PatientVitalTarget } from '../models/PatientVitalTarget';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChronicManagementService {
    /**
     * Láº¥y danh sÃ¡ch ngÆ°á»¡ng chá»‰ sá»‘ má»¥c tiÃªu
     * @param patientId
     * @returns ApiResponseListPatientVitalTarget OK
     * @throws ApiError
     */
    public static getTargets(
        patientId: string,
    ): CancelablePromise<ApiResponseListPatientVitalTarget> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/staff/chronic/targets',
            query: {
                'patientId': patientId,
            },
        });
    }
    /**
     * Thiáº¿t láº­p ngÆ°á»¡ng má»¥c tiÃªu má»›i cho bá»‡nh nhÃ¢n
     * @param requestBody
     * @returns ApiResponsePatientVitalTarget OK
     * @throws ApiError
     */
    public static addTarget(
        requestBody: PatientVitalTarget,
    ): CancelablePromise<ApiResponsePatientVitalTarget> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/staff/chronic/targets',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Láº¥y danh sÃ¡ch bá»‡nh mÃ£n tÃ­nh cá»§a bá»‡nh nhÃ¢n
     * @param patientId
     * @returns ApiResponseListPatientChronicCondition OK
     * @throws ApiError
     */
    public static getConditions(
        patientId: string,
    ): CancelablePromise<ApiResponseListPatientChronicCondition> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/staff/chronic/conditions',
            query: {
                'patientId': patientId,
            },
        });
    }
    /**
     * ThÃªm bá»‡nh mÃ£n tÃ­nh má»›i
     * @param requestBody
     * @returns ApiResponsePatientChronicCondition OK
     * @throws ApiError
     */
    public static addCondition(
        requestBody: PatientChronicCondition,
    ): CancelablePromise<ApiResponsePatientChronicCondition> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/staff/chronic/conditions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Láº¥y lá»‹ch sá»­ sinh hiá»‡u tá»•ng há»£p (CDM + Clinical)
     * @param patientId
     * @returns ApiResponseListVitalHistoryDto OK
     * @throws ApiError
     */
    public static getVitalHistory(
        patientId: string,
    ): CancelablePromise<ApiResponseListVitalHistoryDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/staff/chronic/vitals',
            query: {
                'patientId': patientId,
            },
        });
    }
}
