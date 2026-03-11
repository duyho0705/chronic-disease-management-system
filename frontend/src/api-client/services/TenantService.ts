/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListTenantBranchDto } from '../models/ApiResponseListTenantBranchDto';
import type { ApiResponseListTenantDto } from '../models/ApiResponseListTenantDto';
import type { ApiResponseTenantBranchDto } from '../models/ApiResponseTenantBranchDto';
import type { ApiResponseTenantDto } from '../models/ApiResponseTenantDto';
import type { CreateBranchRequest } from '../models/CreateBranchRequest';
import type { CreateTenantRequest } from '../models/CreateTenantRequest';
import type { TenantBranchDto } from '../models/TenantBranchDto';
import type { UpdateTenantSettingsRequest } from '../models/UpdateTenantSettingsRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TenantService {
    /**
     * Cập nhật cấu hình tenant (Admin)
     * @param tenantId
     * @param requestBody
     * @returns ApiResponseTenantDto OK
     * @throws ApiError
     */
    public static updateSettings(
        tenantId: string,
        requestBody: UpdateTenantSettingsRequest,
    ): CancelablePromise<ApiResponseTenantDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/tenants/{tenantId}/settings',
            path: {
                'tenantId': tenantId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Lấy chi nhánh theo ID
     * @param branchId
     * @returns ApiResponseTenantBranchDto OK
     * @throws ApiError
     */
    public static getBranchById(
        branchId: string,
    ): CancelablePromise<ApiResponseTenantBranchDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tenants/branches/{branchId}',
            path: {
                'branchId': branchId,
            },
        });
    }
    /**
     * Cập nhật chi nhánh
     * @param branchId
     * @param requestBody
     * @returns ApiResponseTenantBranchDto OK
     * @throws ApiError
     */
    public static updateBranch(
        branchId: string,
        requestBody: TenantBranchDto,
    ): CancelablePromise<ApiResponseTenantBranchDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/tenants/branches/{branchId}',
            path: {
                'branchId': branchId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Danh sách tenant (phòng khám) đang hoạt động
     * @returns ApiResponseListTenantDto OK
     * @throws ApiError
     */
    public static list(): CancelablePromise<ApiResponseListTenantDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tenants',
        });
    }
    /**
     * Tạo tenant (phòng khám)
     * @param requestBody
     * @returns ApiResponseTenantDto Created
     * @throws ApiError
     */
    public static create(
        requestBody: CreateTenantRequest,
    ): CancelablePromise<ApiResponseTenantDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tenants',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Tạo chi nhánh
     * @param requestBody
     * @returns ApiResponseTenantBranchDto Created
     * @throws ApiError
     */
    public static createBranch(
        requestBody: CreateBranchRequest,
    ): CancelablePromise<ApiResponseTenantBranchDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tenants/branches',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Danh sách chi nhánh của tenant
     * @param tenantId
     * @returns ApiResponseListTenantBranchDto OK
     * @throws ApiError
     */
    public static getBranches(
        tenantId: string,
    ): CancelablePromise<ApiResponseListTenantBranchDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tenants/{tenantId}/branches',
            path: {
                'tenantId': tenantId,
            },
        });
    }
    /**
     * Lấy tenant theo ID
     * @param id
     * @returns ApiResponseTenantDto OK
     * @throws ApiError
     */
    public static getById(
        id: string,
    ): CancelablePromise<ApiResponseTenantDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tenants/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Lấy tenant theo mã
     * @param code
     * @returns ApiResponseTenantDto OK
     * @throws ApiError
     */
    public static getByCode(
        code: string,
    ): CancelablePromise<ApiResponseTenantDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tenants/by-code/{code}',
            path: {
                'code': code,
            },
        });
    }
}
