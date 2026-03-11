/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListMedicationSchedule } from '../models/ApiResponseListMedicationSchedule';
import type { ApiResponseMedicationSchedule } from '../models/ApiResponseMedicationSchedule';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MedicationManagementService {
    /**
     * ÄÃ¡nh dáº¥u Ä‘Ã£ uá»‘ng thuá»‘c
     * @param scheduleId
     * @returns ApiResponseMedicationSchedule OK
     * @throws ApiError
     */
    public static takeMedicine(
        scheduleId: string,
    ): CancelablePromise<ApiResponseMedicationSchedule> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/clinical/medication/schedules/{scheduleId}/take',
            path: {
                'scheduleId': scheduleId,
            },
        });
    }
    /**
     * Xem lá»‹ch uá»‘ng thuá»‘c
     * @param patientId
     * @returns ApiResponseListMedicationSchedule OK
     * @throws ApiError
     */
    public static getSchedules(
        patientId: string,
    ): CancelablePromise<ApiResponseListMedicationSchedule> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/clinical/medication/schedules/{patientId}',
            path: {
                'patientId': patientId,
            },
        });
    }
}
