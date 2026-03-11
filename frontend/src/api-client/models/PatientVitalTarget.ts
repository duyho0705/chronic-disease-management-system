/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Patient } from './Patient';
import type { Tenant } from './Tenant';
export type PatientVitalTarget = {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    patient?: Patient;
    tenant?: Tenant;
    vitalType?: string;
    minValue?: number;
    maxValue?: number;
    targetValue?: number;
    unit?: string;
    effectiveFrom?: string;
    notes?: string;
};

