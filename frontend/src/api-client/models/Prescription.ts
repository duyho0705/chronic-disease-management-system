/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClinicalConsultation } from './ClinicalConsultation';
import type { Doctor } from './Doctor';
import type { Medication } from './Medication';
import type { Patient } from './Patient';
export type Prescription = {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    consultation?: ClinicalConsultation;
    patient?: Patient;
    doctor?: Doctor;
    diagnosis?: string;
    notes?: string;
    issuedAt?: string;
    expiresAt?: string;
    status?: Prescription.status;
    medications?: Array<Medication>;
    items?: Array<Medication>;
};
export namespace Prescription {
    export enum status {
        DRAFT = 'DRAFT',
        ISSUED = 'ISSUED',
        DISPENSED = 'DISPENSED',
        CANCELLED = 'CANCELLED',
    }
}

