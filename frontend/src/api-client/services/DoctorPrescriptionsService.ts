/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponsePagedResponsePrescriptionDto } from '../models/ApiResponsePagedResponsePrescriptionDto';
import type { ApiResponsePrescriptionDto } from '../models/ApiResponsePrescriptionDto';
import type { Pageable } from '../models/Pageable';
import type { UpdatePrescriptionRequest } from '../models/UpdatePrescriptionRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DoctorPrescriptionsService {
    /**
     * Chi tiết đơn thuốc điện tử
     * @param id
     * @returns ApiResponsePrescriptionDto OK
     * @throws ApiError
     */
    public static getPrescriptionById(
        id: string,
    ): CancelablePromise<ApiResponsePrescriptionDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/prescriptions/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Cập nhật đơn thuốc điện tử (chẩn đoán, ghi chú)
     * @param id
     * @param requestBody
     * @returns ApiResponsePrescriptionDto OK
     * @throws ApiError
     */
    public static updatePrescription(
        id: string,
        requestBody: UpdatePrescriptionRequest,
    ): CancelablePromise<ApiResponsePrescriptionDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/doctor-portal/prescriptions/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Đổi trạng thái đơn thuốc điện tử
     * @param id
     * @param status
     * @returns ApiResponsePrescriptionDto OK
     * @throws ApiError
     */
    public static updatePrescriptionStatus(
        id: string,
        status: string,
    ): CancelablePromise<ApiResponsePrescriptionDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/doctor-portal/prescriptions/{id}/status',
            path: {
                'id': id,
            },
            query: {
                'status': status,
            },
        });
    }
    /**
     * Danh sách đơn thuốc điện tử do bác sĩ kê (phân trang)
     * @param pageable
     * @returns ApiResponsePagedResponsePrescriptionDto OK
     * @throws ApiError
     */
    public static getMyPrescriptions(
        pageable: Pageable,
    ): CancelablePromise<ApiResponsePagedResponsePrescriptionDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/prescriptions',
            query: {
                'pageable': pageable,
            },
        });
    }
}
