/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponsePagedResponseAiAuditLog } from '../models/ApiResponsePagedResponseAiAuditLog';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AiAuditService {
    /**
     * Danh sách AI audit log theo chi nhánh
     * @param branchId
     * @param page
     * @param size
     * @returns ApiResponsePagedResponseAiAuditLog OK
     * @throws ApiError
     */
    public static listByBranch(
        branchId: string,
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePagedResponseAiAuditLog> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/ai-audit',
            query: {
                'branchId': branchId,
                'page': page,
                'size': size,
            },
        });
    }
}
