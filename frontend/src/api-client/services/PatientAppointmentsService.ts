/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseAppointmentDto } from '../models/ApiResponseAppointmentDto';
import type { ApiResponseListAppointmentDto } from '../models/ApiResponseListAppointmentDto';
import type { ApiResponseListSlotAvailabilityDto } from '../models/ApiResponseListSlotAvailabilityDto';
import type { CreateAppointmentRequest } from '../models/CreateAppointmentRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientAppointmentsService {
    /**
     * Danh sÃ¡ch lá»‹ch háº¹n cá»§a bá»‡nh nhÃ¢n
     * @returns ApiResponseListAppointmentDto OK
     * @throws ApiError
     */
    public static getAppointments(): CancelablePromise<ApiResponseListAppointmentDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/appointments',
        });
    }
    /**
     * Äáº·t lá»‹ch háº¹n má»›i
     * @param requestBody
     * @returns ApiResponseAppointmentDto OK
     * @throws ApiError
     */
    public static createAppointment(
        requestBody: CreateAppointmentRequest,
    ): CancelablePromise<ApiResponseAppointmentDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/appointments',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Há»§y lá»‹ch háº¹n
     * @param id
     * @returns ApiResponseAppointmentDto OK
     * @throws ApiError
     */
    public static cancelAppointment(
        id: string,
    ): CancelablePromise<ApiResponseAppointmentDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/appointments/{id}/cancel',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Láº¥y danh sÃ¡ch slot kháº£ dá»¥ng
     * @param branchId
     * @param date
     * @returns ApiResponseListSlotAvailabilityDto OK
     * @throws ApiError
     */
    public static getSlots(
        branchId: string,
        date: string,
    ): CancelablePromise<ApiResponseListSlotAvailabilityDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/appointments/slots',
            query: {
                'branchId': branchId,
                'date': date,
            },
        });
    }
}
