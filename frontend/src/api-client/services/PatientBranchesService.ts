/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListTenantBranchDto } from '../models/ApiResponseListTenantBranchDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientBranchesService {
    /**
     * Láº¥y danh sÃ¡ch chi nhÃ¡nh cá»§a tenant bá»‡nh nhÃ¢n
     * @returns ApiResponseListTenantBranchDto OK
     * @throws ApiError
     */
    public static getBranches1(): CancelablePromise<ApiResponseListTenantBranchDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/branches',
        });
    }
}
