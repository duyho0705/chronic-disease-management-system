/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListMedicalServiceDto } from '../models/ApiResponseListMedicalServiceDto';
import type { ApiResponseMedicalServiceDto } from '../models/ApiResponseMedicalServiceDto';
import type { MedicalServiceDto } from '../models/MedicalServiceDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MasterDataService {
    /**
     * Cáº­p nháº­t dá»‹ch vá»¥ y táº¿
     * @param id
     * @param requestBody
     * @returns ApiResponseMedicalServiceDto OK
     * @throws ApiError
     */
    public static update1(
        id: string,
        requestBody: MedicalServiceDto,
    ): CancelablePromise<ApiResponseMedicalServiceDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/master-data/medical-services/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Danh sÃ¡ch dá»‹ch vá»¥ y táº¿
     * @param onlyActive
     * @returns ApiResponseListMedicalServiceDto OK
     * @throws ApiError
     */
    public static listMedicalServices(
        onlyActive: boolean = false,
    ): CancelablePromise<ApiResponseListMedicalServiceDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/master-data/medical-services',
            query: {
                'onlyActive': onlyActive,
            },
        });
    }
    /**
     * Táº¡o dá»‹ch vá»¥ y táº¿ má»›i
     * @param requestBody
     * @returns ApiResponseMedicalServiceDto OK
     * @throws ApiError
     */
    public static create2(
        requestBody: MedicalServiceDto,
    ): CancelablePromise<ApiResponseMedicalServiceDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/master-data/medical-services',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
