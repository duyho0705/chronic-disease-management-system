/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListPatientInsuranceDto } from '../models/ApiResponseListPatientInsuranceDto';
import type { ApiResponsePagedResponsePatientDto } from '../models/ApiResponsePagedResponsePatientDto';
import type { ApiResponsePatientCrmInsightDto } from '../models/ApiResponsePatientCrmInsightDto';
import type { ApiResponsePatientDto } from '../models/ApiResponsePatientDto';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { CreatePatientRequest } from '../models/CreatePatientRequest';
import type { Pageable } from '../models/Pageable';
import type { RegisterDeviceTokenRequest } from '../models/RegisterDeviceTokenRequest';
import type { UpdatePatientRequest } from '../models/UpdatePatientRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientService {
    /**
     * Lấy bệnh nhân theo ID
     * @param id
     * @returns ApiResponsePatientDto OK
     * @throws ApiError
     */
    public static getById1(
        id: string,
    ): CancelablePromise<ApiResponsePatientDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/patients/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Cập nhật bệnh nhân
     * @param id
     * @param requestBody
     * @returns ApiResponsePatientDto OK
     * @throws ApiError
     */
    public static update(
        id: string,
        requestBody: UpdatePatientRequest,
    ): CancelablePromise<ApiResponsePatientDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/patients/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Danh sách bệnh nhân (phân trang)
     * @param pageable
     * @returns ApiResponsePagedResponsePatientDto OK
     * @throws ApiError
     */
    public static list1(
        pageable: Pageable,
    ): CancelablePromise<ApiResponsePagedResponsePatientDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/patients',
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * Tạo bệnh nhân
     * @param requestBody
     * @returns ApiResponsePatientDto Created
     * @throws ApiError
     */
    public static create1(
        requestBody: CreatePatientRequest,
    ): CancelablePromise<ApiResponsePatientDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/patients',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Đăng ký FCM token cho bệnh nhân
     * @param id
     * @param requestBody
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static registerToken1(
        id: string,
        requestBody: RegisterDeviceTokenRequest,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/patients/{id}/device-tokens',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Danh sách bảo hiểm của bệnh nhân
     * @param id
     * @returns ApiResponseListPatientInsuranceDto OK
     * @throws ApiError
     */
    public static getInsurances1(
        id: string,
    ): CancelablePromise<ApiResponseListPatientInsuranceDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/patients/{id}/insurances',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Lấy phân tích gắn kết và gắn bó của bệnh nhân (Enterprise CRM)
     * @param id
     * @returns ApiResponsePatientCrmInsightDto OK
     * @throws ApiError
     */
    public static getCrmInsights(
        id: string,
    ): CancelablePromise<ApiResponsePatientCrmInsightDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/patients/{id}/crm-insights',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Tìm bệnh nhân theo số điện thoại
     * @param phone
     * @returns ApiResponsePatientDto OK
     * @throws ApiError
     */
    public static findByPhone(
        phone: string,
    ): CancelablePromise<ApiResponsePatientDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/patients/by-phone',
            query: {
                'phone': phone,
            },
        });
    }
    /**
     * Tìm bệnh nhân theo CCCD
     * @param cccd
     * @returns ApiResponsePatientDto OK
     * @throws ApiError
     */
    public static findByCccd(
        cccd: string,
    ): CancelablePromise<ApiResponsePatientDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/patients/by-cccd',
            query: {
                'cccd': cccd,
            },
        });
    }
}
