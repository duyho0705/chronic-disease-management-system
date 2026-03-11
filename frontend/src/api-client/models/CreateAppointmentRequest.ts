/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LocalTime } from './LocalTime';
export type CreateAppointmentRequest = {
    branchId: string;
    patientId: string;
    appointmentDate: string;
    slotStartTime: LocalTime;
    slotEndTime?: LocalTime;
    status: string;
    appointmentType?: string;
    notes?: string;
    createdByUserId?: string;
};

