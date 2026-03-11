/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseHealthMetric } from '../models/ApiResponseHealthMetric';
import type { ApiResponseListHealthMetric } from '../models/ApiResponseListHealthMetric';
import type { ApiResponseString } from '../models/ApiResponseString';
import type { HealthMetric } from '../models/HealthMetric';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthTrackingService {
    /**
     * Xem lịch sử chỉ số sức khỏe
     * @param patientId
     * @returns ApiResponseListHealthMetric OK
     * @throws ApiError
     */
    public static getMetrics(
        patientId: string,
    ): CancelablePromise<ApiResponseListHealthMetric> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/clinical/health/{patientId}/metrics',
            path: {
                'patientId': patientId,
            },
        });
    }
    /**
     * Nhập chỉ số sức khỏe
     * @param patientId
     * @param requestBody
     * @returns ApiResponseHealthMetric OK
     * @throws ApiError
     */
    public static addMetric(
        patientId: string,
        requestBody: HealthMetric,
    ): CancelablePromise<ApiResponseHealthMetric> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/clinical/health/{patientId}/metrics',
            path: {
                'patientId': patientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Phân tích sức khỏe bằng AI (Role 2)
     * @param patientId
     * @returns ApiResponseString OK
     * @throws ApiError
     */
    public static analyzeHealth(
        patientId: string,
    ): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/clinical/health/{patientId}/ai-analysis',
            path: {
                'patientId': patientId,
            },
        });
    }
}
