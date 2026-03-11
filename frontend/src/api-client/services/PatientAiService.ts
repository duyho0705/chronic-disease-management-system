/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AiChatRequest } from '../models/AiChatRequest';
import type { ApiResponseAiChatResponse } from '../models/ApiResponseAiChatResponse';
import type { ApiResponseString } from '../models/ApiResponseString';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientAiService {
    /**
     * Chat vá»›i trá»£ lÃ½ AI y táº¿ (Enterprise AI)
     * @param requestBody
     * @returns ApiResponseAiChatResponse OK
     * @throws ApiError
     */
    public static getAiAssistant(
        requestBody: AiChatRequest,
    ): CancelablePromise<ApiResponseAiChatResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/ai/assistant',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * TÃ³m táº¯t sá»©c khá»e tá»•ng quÃ¡t (Enterprise AI Report)
     * @returns ApiResponseString OK
     * @throws ApiError
     */
    public static getHealthSummary(): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/ai/health-summary',
        });
    }
}
