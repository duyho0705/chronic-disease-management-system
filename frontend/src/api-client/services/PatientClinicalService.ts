/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseConsultationDetailDto } from '../models/ApiResponseConsultationDetailDto';
import type { ApiResponseListVitalTrendDto } from '../models/ApiResponseListVitalTrendDto';
import type { ApiResponsePagedResponseConsultationDto } from '../models/ApiResponsePagedResponseConsultationDto';
import type { ApiResponsePatientDashboardDto } from '../models/ApiResponsePatientDashboardDto';
import type { ApiResponsePatientVitalLogDto } from '../models/ApiResponsePatientVitalLogDto';
import type { PatientVitalLogDto } from '../models/PatientVitalLogDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientClinicalService {
    /**
     * Bệnh nhân tự nhập chỉ số sinh hiệu
     * @param requestBody
     * @returns ApiResponsePatientVitalLogDto OK
     * @throws ApiError
     */
    public static logVital(
        requestBody: PatientVitalLogDto,
    ): CancelablePromise<ApiResponsePatientVitalLogDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/clinical/vitals',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Nhập chỉ số sinh hiệu kèm ảnh máy đo
     * @param vitalType
     * @param valueNumeric
     * @param unit
     * @param notes
     * @param formData
     * @returns ApiResponsePatientVitalLogDto OK
     * @throws ApiError
     */
    public static logVitalWithImage(
        vitalType: string,
        valueNumeric: number,
        unit?: string,
        notes?: string,
        formData?: {
            image: Blob;
        },
    ): CancelablePromise<ApiResponsePatientVitalLogDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/clinical/vitals/upload',
            query: {
                'vitalType': vitalType,
                'valueNumeric': valueNumeric,
                'unit': unit,
                'notes': notes,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * Dữ liệu xu hướng sinh hiệu cho biểu đồ (hỗ trợ lọc ngày/tuần/tháng)
     * @param type
     * @param from
     * @param to
     * @returns ApiResponseListVitalTrendDto OK
     * @throws ApiError
     */
    public static getVitalTrends(
        type: string,
        from?: string,
        to?: string,
    ): CancelablePromise<ApiResponseListVitalTrendDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/clinical/vitals/trends',
            query: {
                'type': type,
                'from': from,
                'to': to,
            },
        });
    }
    /**
     * Lịch sử khám bệnh (Có phân trang)
     * @param page
     * @param size
     * @returns ApiResponsePagedResponseConsultationDto OK
     * @throws ApiError
     */
    public static getHistory(
        page?: number,
        size: number = 10,
    ): CancelablePromise<ApiResponsePagedResponseConsultationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/clinical/medical-history',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * Chi tiết ca khám
     * @param id
     * @returns ApiResponseConsultationDetailDto OK
     * @throws ApiError
     */
    public static getHistoryDetail(
        id: string,
    ): CancelablePromise<ApiResponseConsultationDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/clinical/medical-history/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Dữ liệu tổng quan cho trang chủ bệnh nhân
     * @returns ApiResponsePatientDashboardDto OK
     * @throws ApiError
     */
    public static getDashboard(): CancelablePromise<ApiResponsePatientDashboardDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/clinical/dashboard',
        });
    }
}
