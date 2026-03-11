/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseHealthThresholdDto } from '../models/ApiResponseHealthThresholdDto';
import type { ApiResponseListHealthMetricDto } from '../models/ApiResponseListHealthMetricDto';
import type { ApiResponseListHealthThresholdDto } from '../models/ApiResponseListHealthThresholdDto';
import type { ApiResponseListVitalTrendDto } from '../models/ApiResponseListVitalTrendDto';
import type { UpdateHealthThresholdRequest } from '../models/UpdateHealthThresholdRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DoctorHealthMonitoringService {
    /**
     * Lấy ngưỡng cảnh báo cá nhân hóa của bệnh nhân
     * @param patientId
     * @returns ApiResponseListHealthThresholdDto OK
     * @throws ApiError
     */
    public static getThresholds(
        patientId: string,
    ): CancelablePromise<ApiResponseListHealthThresholdDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/patients/{patientId}/health/thresholds',
            path: {
                'patientId': patientId,
            },
        });
    }
    /**
     * Cập nhật / tạo ngưỡng cảnh báo cá nhân hóa cho bệnh nhân
     * @param patientId
     * @param requestBody
     * @returns ApiResponseHealthThresholdDto OK
     * @throws ApiError
     */
    public static upsertThreshold(
        patientId: string,
        requestBody: UpdateHealthThresholdRequest,
    ): CancelablePromise<ApiResponseHealthThresholdDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/doctor-portal/patients/{patientId}/health/thresholds',
            path: {
                'patientId': patientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Lấy tất cả chỉ số sức khỏe gần nhất của bệnh nhân
     * @param patientId
     * @returns ApiResponseListHealthMetricDto OK
     * @throws ApiError
     */
    public static getHealthMetrics(
        patientId: string,
    ): CancelablePromise<ApiResponseListHealthMetricDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/patients/{patientId}/health/metrics',
            path: {
                'patientId': patientId,
            },
        });
    }
    /**
     * Biểu đồ xu hướng chỉ số theo loại (dùng cho chart)
     * @param patientId
     * @param type
     * @param days
     * @returns ApiResponseListVitalTrendDto OK
     * @throws ApiError
     */
    public static getHealthTrends(
        patientId: string,
        type: string,
        days: number = 30,
    ): CancelablePromise<ApiResponseListVitalTrendDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/patients/{patientId}/health/metrics/trends',
            path: {
                'patientId': patientId,
            },
            query: {
                'type': type,
                'days': days,
            },
        });
    }
}
