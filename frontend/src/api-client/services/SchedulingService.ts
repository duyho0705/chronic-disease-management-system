/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseAppointmentDto } from '../models/ApiResponseAppointmentDto';
import type { ApiResponseListSlotTemplateDto } from '../models/ApiResponseListSlotTemplateDto';
import type { ApiResponsePagedResponseAppointmentDto } from '../models/ApiResponsePagedResponseAppointmentDto';
import type { CreateAppointmentRequest } from '../models/CreateAppointmentRequest';
import type { Pageable } from '../models/Pageable';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SchedulingService {
    /**
     * Danh sÃ¡ch lá»‹ch háº¹n theo chi nhÃ¡nh vÃ  ngÃ y
     * @param branchId
     * @param date
     * @param pageable
     * @returns ApiResponsePagedResponseAppointmentDto OK
     * @throws ApiError
     */
    public static list2(
        branchId: string,
        date: string,
        pageable: Pageable,
    ): CancelablePromise<ApiResponsePagedResponseAppointmentDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/appointments',
            query: {
                'branchId': branchId,
                'date': date,
                'pageable': pageable,
            },
        });
    }
    /**
     * Táº¡o lá»‹ch háº¹n
     * @param requestBody
     * @returns ApiResponseAppointmentDto Created
     * @throws ApiError
     */
    public static create3(
        requestBody: CreateAppointmentRequest,
    ): CancelablePromise<ApiResponseAppointmentDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/appointments',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Tiáº¿p Ä‘Ã³n bá»‡nh nhÃ¢n (Check-in)
     * @param id
     * @returns ApiResponseAppointmentDto OK
     * @throws ApiError
     */
    public static checkIn(
        id: string,
    ): CancelablePromise<ApiResponseAppointmentDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/appointments/{id}/check-in',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Cáº­p nháº­t tráº¡ng thÃ¡i lá»‹ch háº¹n
     * @param id
     * @param status
     * @returns ApiResponseAppointmentDto OK
     * @throws ApiError
     */
    public static updateStatus(
        id: string,
        status: string,
    ): CancelablePromise<ApiResponseAppointmentDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/appointments/{id}/status',
            path: {
                'id': id,
            },
            query: {
                'status': status,
            },
        });
    }
    /**
     * Láº¥y lá»‹ch háº¹n theo ID
     * @param id
     * @returns ApiResponseAppointmentDto OK
     * @throws ApiError
     */
    public static getById3(
        id: string,
    ): CancelablePromise<ApiResponseAppointmentDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/appointments/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Danh sÃ¡ch máº«u khung giá» theo tenant
     * @returns ApiResponseListSlotTemplateDto OK
     * @throws ApiError
     */
    public static getSlotTemplates(): CancelablePromise<ApiResponseListSlotTemplateDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/appointments/slots',
        });
    }
}
