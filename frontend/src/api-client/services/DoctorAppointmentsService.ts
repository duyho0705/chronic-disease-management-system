/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseAppointmentDto } from '../models/ApiResponseAppointmentDto';
import type { ApiResponseListAppointmentDto } from '../models/ApiResponseListAppointmentDto';
import type { ApiResponseListSlotAvailabilityDto } from '../models/ApiResponseListSlotAvailabilityDto';
import type { ApiResponsePagedResponseAppointmentDto } from '../models/ApiResponsePagedResponseAppointmentDto';
import type { DoctorCreateAppointmentRequest } from '../models/DoctorCreateAppointmentRequest';
import type { Pageable } from '../models/Pageable';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DoctorAppointmentsService {
    /**
     * Danh sách lịch hẹn của bác sĩ (lọc theo khoảng ngày)
     * @param from
     * @param to
     * @param pageable
     * @returns ApiResponsePagedResponseAppointmentDto OK
     * @throws ApiError
     */
    public static getMyAppointments(
        from: string,
        to: string,
        pageable: Pageable,
    ): CancelablePromise<ApiResponsePagedResponseAppointmentDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/appointments',
            query: {
                'from': from,
                'to': to,
                'pageable': pageable,
            },
        });
    }
    /**
     * Đặt lịch tái khám cho bệnh nhân
     * @param requestBody
     * @returns ApiResponseAppointmentDto Created
     * @throws ApiError
     */
    public static createFollowUpAppointment(
        requestBody: DoctorCreateAppointmentRequest,
    ): CancelablePromise<ApiResponseAppointmentDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/doctor-portal/appointments',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Cập nhật trạng thái lịch hẹn (COMPLETED, CANCELLED, NO_SHOW)
     * @param id
     * @param status
     * @returns ApiResponseAppointmentDto OK
     * @throws ApiError
     */
    public static updateAppointmentStatus(
        id: string,
        status: string,
    ): CancelablePromise<ApiResponseAppointmentDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/doctor-portal/appointments/{id}/status',
            path: {
                'id': id,
            },
            query: {
                'status': status,
            },
        });
    }
    /**
     * Lịch hẹn hôm nay của bác sĩ
     * @returns ApiResponseListAppointmentDto OK
     * @throws ApiError
     */
    public static getTodayAppointments(): CancelablePromise<ApiResponseListAppointmentDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/appointments/today',
        });
    }
    /**
     * Xem slot trống theo chi nhánh và ngày
     * @param branchId
     * @param date
     * @returns ApiResponseListSlotAvailabilityDto OK
     * @throws ApiError
     */
    public static getAvailableSlots(
        branchId: string,
        date: string,
    ): CancelablePromise<ApiResponseListSlotAvailabilityDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/appointments/slots',
            query: {
                'branchId': branchId,
                'date': date,
            },
        });
    }
}
