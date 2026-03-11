/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponsePagedResponsePatientDto } from '../models/ApiResponsePagedResponsePatientDto';
import type { ApiResponsePatientDto } from '../models/ApiResponsePatientDto';
import type { ApiResponseString } from '../models/ApiResponseString';
import type { Pageable } from '../models/Pageable';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DoctorPatientManagementService {
    /**
     * Danh sách bệnh nhân (phân trang, tìm kiếm)
     * @param pageable
     * @returns ApiResponsePagedResponsePatientDto OK
     * @throws ApiError
     */
    public static getPatientList(
        pageable: Pageable,
    ): CancelablePromise<ApiResponsePagedResponsePatientDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/patients',
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * Xem hồ sơ đầy đủ của bệnh nhân
     * @param patientId
     * @returns ApiResponsePatientDto OK
     * @throws ApiError
     */
    public static getPatientFullProfile(
        patientId: string,
    ): CancelablePromise<ApiResponsePatientDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/patients/{patientId}/full-profile',
            path: {
                'patientId': patientId,
            },
        });
    }
    /**
     * Lấy bản tóm tắt lâm sàng thông minh (AI Powered)
     * @param patientId
     * @returns ApiResponseString OK
     * @throws ApiError
     */
    public static getPatientClinicalSummary(
        patientId: string,
    ): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/patients/{patientId}/clinical-summary',
            path: {
                'patientId': patientId,
            },
        });
    }
}
