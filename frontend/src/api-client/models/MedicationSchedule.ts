/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Medication } from './Medication';
export type MedicationSchedule = {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    medication?: Medication;
    scheduledTime?: string;
    status?: string;
    takenAt?: string;
    notes?: string;
};

