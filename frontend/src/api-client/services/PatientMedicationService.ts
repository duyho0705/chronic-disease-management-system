/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListMedicationReminderDto } from '../models/ApiResponseListMedicationReminderDto';
import type { ApiResponseMedicationDosageLogDto } from '../models/ApiResponseMedicationDosageLogDto';
import type { MedicationDosageLogDto } from '../models/MedicationDosageLogDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientMedicationService {
    /**
     * Ghi nháº­n Ä‘Ã£ uá»‘ng thuá»‘c
     * @param requestBody
     * @returns ApiResponseMedicationDosageLogDto OK
     * @throws ApiError
     */
    public static logDosage(
        requestBody: MedicationDosageLogDto,
    ): CancelablePromise<ApiResponseMedicationDosageLogDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/medication-reminders/log',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Láº¥y danh sÃ¡ch nháº¯c lá»‹ch uá»‘ng thuá»‘c
     * @returns ApiResponseListMedicationReminderDto OK
     * @throws ApiError
     */
    public static getReminders(): CancelablePromise<ApiResponseListMedicationReminderDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/medication-reminders',
        });
    }
}
