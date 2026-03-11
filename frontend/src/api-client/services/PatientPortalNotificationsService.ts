/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListPatientNotificationDto } from '../models/ApiResponseListPatientNotificationDto';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { RegisterFcmTokenRequest } from '../models/RegisterFcmTokenRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientPortalNotificationsService {
    /**
     * ÄÃ¡nh dáº¥u thÃ´ng bÃ¡o Ä‘Ã£ Ä‘á»c
     * @param id
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static markAsRead(
        id: string,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/notifications/{id}/read',
            path: {
                'id': id,
            },
        });
    }
    /**
     * ÄÄƒng kÃ½ FCM token cho bá»‡nh nhÃ¢n
     * @param requestBody
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static registerToken(
        requestBody: RegisterFcmTokenRequest,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/notifications/register-token',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * ÄÃ¡nh dáº¥u táº¥t cáº£ thÃ´ng bÃ¡o Ä‘Ã£ Ä‘á»c
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static markAllAsRead(): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/notifications/read-all',
        });
    }
    /**
     * Láº¥y danh sÃ¡ch thÃ´ng bÃ¡o cá»§a bá»‡nh nhÃ¢n
     * @returns ApiResponseListPatientNotificationDto OK
     * @throws ApiError
     */
    public static getNotifications(): CancelablePromise<ApiResponseListPatientNotificationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/notifications',
        });
    }
}
