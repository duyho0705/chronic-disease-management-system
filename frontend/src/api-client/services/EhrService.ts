/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListTimelineItemDto } from '../models/ApiResponseListTimelineItemDto';
import type { ApiResponseListTriageVitalDto } from '../models/ApiResponseListTriageVitalDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EhrService {
    /**
     * Láº¥y lá»‹ch sá»­ dáº¥u hiá»‡u sinh tá»“n
     * @param patientId
     * @returns ApiResponseListTriageVitalDto OK
     * @throws ApiError
     */
    public static getVitalsHistory(
        patientId: string,
    ): CancelablePromise<ApiResponseListTriageVitalDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ehr/patient/{patientId}/vitals',
            path: {
                'patientId': patientId,
            },
        });
    }
    /**
     * Láº¥y dÃ²ng thá»i gian y táº¿ cá»§a bá»‡nh nhÃ¢n
     * @param patientId
     * @returns ApiResponseListTimelineItemDto OK
     * @throws ApiError
     */
    public static getTimeline(
        patientId: string,
    ): CancelablePromise<ApiResponseListTimelineItemDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ehr/patient/{patientId}/timeline',
            path: {
                'patientId': patientId,
            },
        });
    }
}
