/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { SendChatNotificationRequest } from '../models/SendChatNotificationRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChatNotificationService {
    /**
     * Gửi thông báo đẩy khi có tin nhắn mới
     * @param requestBody
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static sendNotify(
        requestBody: SendChatNotificationRequest,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/notify',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
