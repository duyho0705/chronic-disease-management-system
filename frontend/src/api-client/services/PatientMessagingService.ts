/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListDoctorInfoDto } from '../models/ApiResponseListDoctorInfoDto';
import type { ApiResponseListPatientChatMessageDto } from '../models/ApiResponseListPatientChatMessageDto';
import type { ApiResponsePatientChatMessageDto } from '../models/ApiResponsePatientChatMessageDto';
import type { SendChatMessageRequest } from '../models/SendChatMessageRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientMessagingService {
    /**
     * Gá»­i tin nháº¯n cho bÃ¡c sÄ©
     * @param requestBody
     * @returns ApiResponsePatientChatMessageDto OK
     * @throws ApiError
     */
    public static sendChatMessage(
        requestBody: SendChatMessageRequest,
    ): CancelablePromise<ApiResponsePatientChatMessageDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/chat/send',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Gá»­i tin nháº¯n kÃ¨m file/áº£nh cho bÃ¡c sÄ©
     * @param doctorUserId
     * @param content
     * @param formData
     * @returns ApiResponsePatientChatMessageDto OK
     * @throws ApiError
     */
    public static sendChatFile(
        doctorUserId: string,
        content?: string,
        formData?: {
            file: Blob;
        },
    ): CancelablePromise<ApiResponsePatientChatMessageDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/chat/send-file',
            query: {
                'doctorUserId': doctorUserId,
                'content': content,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * Láº¥y lá»‹ch sá»­ chat vá»›i bÃ¡c sÄ©
     * @param doctorId
     * @returns ApiResponseListPatientChatMessageDto OK
     * @throws ApiError
     */
    public static getChatHistory(
        doctorId: string,
    ): CancelablePromise<ApiResponseListPatientChatMessageDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/chat/history/{doctorId}',
            path: {
                'doctorId': doctorId,
            },
        });
    }
    /**
     * Láº¥y danh sÃ¡ch bÃ¡c sÄ© tÆ° váº¥n
     * @returns ApiResponseListDoctorInfoDto OK
     * @throws ApiError
     */
    public static getChatDoctors(): CancelablePromise<ApiResponseListDoctorInfoDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/chat/doctors',
        });
    }
}
