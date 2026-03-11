/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponsePrescriptionDto } from '../models/ApiResponsePrescriptionDto';
import type { CreatePrescriptionRequest } from '../models/CreatePrescriptionRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PrescriptionService {
    /**
     * Táº¡o Ä‘Æ¡n thuá»‘c cho phiÃªn khÃ¡m
     * @param requestBody
     * @returns ApiResponsePrescriptionDto OK
     * @throws ApiError
     */
    public static createPrescription(
        requestBody: CreatePrescriptionRequest,
    ): CancelablePromise<ApiResponsePrescriptionDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/prescriptions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Láº¥y Ä‘Æ¡n thuá»‘c theo phiÃªn khÃ¡m
     * @param id
     * @returns ApiResponsePrescriptionDto OK
     * @throws ApiError
     */
    public static getByConsultation(
        id: string,
    ): CancelablePromise<ApiResponsePrescriptionDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/prescriptions/consultation/{id}',
            path: {
                'id': id,
            },
        });
    }
}
