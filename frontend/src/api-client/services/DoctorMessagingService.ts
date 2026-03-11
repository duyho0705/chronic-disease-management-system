/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListPatientChatConversationDto } from '../models/ApiResponseListPatientChatConversationDto';
import type { ApiResponseListPatientChatMessageDto } from '../models/ApiResponseListPatientChatMessageDto';
import type { ApiResponsePatientChatMessageDto } from '../models/ApiResponsePatientChatMessageDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DoctorMessagingService {
    /**
     * Gửi tin nhắn cho bệnh nhân
     * @param patientId
     * @param requestBody
     * @returns ApiResponsePatientChatMessageDto OK
     * @throws ApiError
     */
    public static sendMessage(
        patientId: string,
        requestBody: string,
    ): CancelablePromise<ApiResponsePatientChatMessageDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/doctor-portal/chat/send/{patientId}',
            path: {
                'patientId': patientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Lấy lịch sử trò chuyện với một bệnh nhân cụ thể
     * @param patientId
     * @returns ApiResponseListPatientChatMessageDto OK
     * @throws ApiError
     */
    public static getChatHistory1(
        patientId: string,
    ): CancelablePromise<ApiResponseListPatientChatMessageDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/chat/history/{patientId}',
            path: {
                'patientId': patientId,
            },
        });
    }
    /**
     * Lấy danh sách các cuộc trò chuyện với bệnh nhân
     * @returns ApiResponseListPatientChatConversationDto OK
     * @throws ApiError
     */
    public static getChatConversations(): CancelablePromise<ApiResponseListPatientChatConversationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doctor-portal/chat/conversations',
        });
    }
}
