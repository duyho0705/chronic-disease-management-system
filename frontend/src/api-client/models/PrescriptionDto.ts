/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PrescriptionItemDto } from './PrescriptionItemDto';
export type PrescriptionDto = {
    id?: string;
    consultationId?: string;
    patientId?: string;
    patientName?: string;
    doctorUserId?: string;
    doctorName?: string;
    status?: string;
    notes?: string;
    items?: Array<PrescriptionItemDto>;
};

