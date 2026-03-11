/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseInvoiceDto } from '../models/ApiResponseInvoiceDto';
import type { ApiResponseListInvoiceDto } from '../models/ApiResponseListInvoiceDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientBillingService {
    /**
     * Thanh toán hóa đơn
     * @param id
     * @param requestBody
     * @returns ApiResponseInvoiceDto OK
     * @throws ApiError
     */
    public static payInvoice(
        id: string,
        requestBody: string,
    ): CancelablePromise<ApiResponseInvoiceDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/billing/invoices/{id}/pay',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Lấy danh sách hóa đơn của bệnh nhân
     * @returns ApiResponseListInvoiceDto OK
     * @throws ApiError
     */
    public static getInvoices(): CancelablePromise<ApiResponseListInvoiceDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/billing/invoices',
        });
    }
}
