/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseDoctorInfoDto } from '../models/ApiResponseDoctorInfoDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DoctorProfileService {
    /**
     * Láº¥y thÃ´ng tin cÃ¡ nhÃ¢n cá»§a bÃ¡c sÄ©
     * @returns ApiResponseDoctorInfoDto OK
     * @throws ApiError
     */
    public static getProfile1(): CancelablePromise<ApiResponseDoctorInfoDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/profile',
        });
    }
}
