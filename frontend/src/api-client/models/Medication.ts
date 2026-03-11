/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Prescription } from './Prescription';
export type Medication = {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    prescription?: Prescription;
    medicineName?: string;
    dosage?: string;
    quantity?: number;
    frequency?: string;
    instructions?: string;
    durationDays?: number;
    dosageInstruction?: string;
};

