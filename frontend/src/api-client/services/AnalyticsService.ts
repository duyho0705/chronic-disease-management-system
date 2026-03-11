/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseMapStringObject } from '../models/ApiResponseMapStringObject';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnalyticsService {
    /**
     * Thống kê 7 ngày gần nhất
     * @param branchId
     * @returns ApiResponseMapStringObject OK
     * @throws ApiError
     */
    public static getWeekSummary(
        branchId?: string,
    ): CancelablePromise<ApiResponseMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/analytics/summary/week',
            query: {
                'branchId': branchId,
            },
        });
    }
    /**
     * Tổng quan hôm nay: số bệnh nhân, thời gian chờ, tỷ lệ AI
     * @param branchId
     * @returns ApiResponseMapStringObject OK
     * @throws ApiError
     */
    public static getTodaySummary(
        branchId?: string,
    ): CancelablePromise<ApiResponseMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/analytics/summary/today',
            query: {
                'branchId': branchId,
            },
        });
    }
}
