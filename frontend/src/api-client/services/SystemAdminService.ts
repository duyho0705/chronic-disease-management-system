/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListTenant } from '../models/ApiResponseListTenant';
import type { ApiResponseTenant } from '../models/ApiResponseTenant';
import type { Tenant } from '../models/Tenant';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SystemAdminService {
    /**
     * Danh sách chi nhánh/phòng khám (Tenants)
     * @returns ApiResponseListTenant OK
     * @throws ApiError
     */
    public static listTenants(): CancelablePromise<ApiResponseListTenant> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/tenants',
        });
    }
    /**
     * Tạo mới tenant
     * @param requestBody
     * @returns ApiResponseTenant OK
     * @throws ApiError
     */
    public static createTenant(
        requestBody: Tenant,
    ): CancelablePromise<ApiResponseTenant> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/tenants',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
