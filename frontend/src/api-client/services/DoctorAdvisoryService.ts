/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseString } from '../models/ApiResponseString';
import type { SendAdviceRequest } from '../models/SendAdviceRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DoctorAdvisoryService {
    /**
     * Gửi cảnh báo sức khỏe khẩn cấp cho bệnh nhân
     * @param patientId
     * @param requestBody
     * @returns ApiResponseString OK
     * @throws ApiError
     */
    public static sendAlert(
        patientId: string,
        requestBody: SendAdviceRequest,
    ): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/doctor-portal/patients/{patientId}/alert',
            path: {
                'patientId': patientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Gửi lời khuyên / khuyến nghị cho bệnh nhân
     * @param patientId
     * @param requestBody
     * @returns ApiResponseString OK
     * @throws ApiError
     */
    public static sendAdvice(
        patientId: string,
        requestBody: SendAdviceRequest,
    ): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/doctor-portal/patients/{patientId}/advice',
            path: {
                'patientId': patientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
