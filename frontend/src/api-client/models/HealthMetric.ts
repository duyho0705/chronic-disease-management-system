/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Patient } from './Patient';
import type { Tenant } from './Tenant';
export type HealthMetric = {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    patient?: Patient;
    tenant?: Tenant;
    metricType?: string;
    value?: number;
    unit?: string;
    imageUrl?: string;
    status?: string;
    notes?: string;
    recordedAt?: string;
};

