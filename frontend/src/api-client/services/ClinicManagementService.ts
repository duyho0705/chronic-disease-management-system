/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseMapStringObject } from '../models/ApiResponseMapStringObject';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClinicManagementService {
    /**
     * Xem báo cáo tổng hợp
     * @returns ApiResponseMapStringObject OK
     * @throws ApiError
     */
    public static getSummary(): CancelablePromise<ApiResponseMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/management/reports/summary',
        });
    }
    /**
     * Xuất báo cáo bệnh nhân bản Excel
     * @returns string OK
     * @throws ApiError
     */
    public static exportExcel(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/management/reports/export-excel',
        });
    }
}
