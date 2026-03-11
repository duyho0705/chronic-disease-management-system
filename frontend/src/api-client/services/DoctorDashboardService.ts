/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseDoctorDashboardDto } from '../models/ApiResponseDoctorDashboardDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DoctorDashboardService {
    /**
     * Lấy dữ liệu tổng quan cho bác sĩ (Real-time Dashboard)
     * @returns ApiResponseDoctorDashboardDto OK
     * @throws ApiError
     */
    public static getDashboard1(): CancelablePromise<ApiResponseDoctorDashboardDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/dashboard',
        });
    }
}
