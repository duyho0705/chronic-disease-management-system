/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseAiOperationalInsightDto } from '../models/ApiResponseAiOperationalInsightDto';
import type { ApiResponseBranchOperationalHeatmapDto } from '../models/ApiResponseBranchOperationalHeatmapDto';
import type { ApiResponseListDailyVolumeDto } from '../models/ApiResponseListDailyVolumeDto';
import type { ApiResponseWaitTimeSummaryDto } from '../models/ApiResponseWaitTimeSummaryDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReportService {
    /**
     * Báo cáo thời gian chờ trung bình
     * @param branchId
     * @param fromDate
     * @param toDate
     * @returns ApiResponseWaitTimeSummaryDto OK
     * @throws ApiError
     */
    public static getWaitTimeSummary(
        branchId: string,
        fromDate?: string,
        toDate?: string,
    ): CancelablePromise<ApiResponseWaitTimeSummaryDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/reports/wait-time',
            query: {
                'branchId': branchId,
                'fromDate': fromDate,
                'toDate': toDate,
            },
        });
    }
    /**
     * Xuất báo cáo thời gian chờ ra file Excel
     * @param branchId
     * @param fromDate
     * @param toDate
     * @returns string OK
     * @throws ApiError
     */
    public static exportWaitTimeExcel(
        branchId: string,
        fromDate?: string,
        toDate?: string,
    ): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/reports/wait-time/excel',
            query: {
                'branchId': branchId,
                'fromDate': fromDate,
                'toDate': toDate,
            },
        });
    }
    /**
     * Xem mật độ bệnh nhân tại các khu vực (Heatmap)
     * @param branchId
     * @returns ApiResponseBranchOperationalHeatmapDto OK
     * @throws ApiError
     */
    public static getOperationalHeatmap(
        branchId: string,
    ): CancelablePromise<ApiResponseBranchOperationalHeatmapDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/reports/operational-heatmap',
            query: {
                'branchId': branchId,
            },
        });
    }
    /**
     * Báo cáo số lượng bệnh nhân theo ngày
     * @param branchId
     * @param fromDate
     * @param toDate
     * @returns ApiResponseListDailyVolumeDto OK
     * @throws ApiError
     */
    public static getDailyVolume(
        branchId: string,
        fromDate?: string,
        toDate?: string,
    ): CancelablePromise<ApiResponseListDailyVolumeDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/reports/daily-volume',
            query: {
                'branchId': branchId,
                'fromDate': fromDate,
                'toDate': toDate,
            },
        });
    }
    /**
     * Xuất báo cáo số lượng bệnh nhân ra file Excel
     * @param branchId
     * @param fromDate
     * @param toDate
     * @returns string OK
     * @throws ApiError
     */
    public static exportDailyVolumeExcel(
        branchId: string,
        fromDate?: string,
        toDate?: string,
    ): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/reports/daily-volume/excel',
            query: {
                'branchId': branchId,
                'fromDate': fromDate,
                'toDate': toDate,
            },
        });
    }
    /**
     * Lấy phân tích vận hành thông minh từ AI (Operational Intelligence)
     * @param branchId
     * @returns ApiResponseAiOperationalInsightDto OK
     * @throws ApiError
     */
    public static getAiOperationalInsights(
        branchId: string,
    ): CancelablePromise<ApiResponseAiOperationalInsightDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/reports/ai-operational-insights',
            query: {
                'branchId': branchId,
            },
        });
    }
}
