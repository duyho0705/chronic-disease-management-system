/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Patient } from './Patient';
import type { Tenant } from './Tenant';
export type PatientChronicCondition = {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    patient?: Patient;
    tenant?: Tenant;
    conditionName?: string;
    icd10Code?: string;
    diagnosedAt?: string;
    severityLevel?: string;
    status?: string;
    clinicalNotes?: string;
};

