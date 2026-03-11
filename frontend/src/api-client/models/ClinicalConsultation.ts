/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdentityUser } from './IdentityUser';
import type { Patient } from './Patient';
import type { SchedulingAppointment } from './SchedulingAppointment';
import type { Tenant } from './Tenant';
import type { TenantBranch } from './TenantBranch';
export type ClinicalConsultation = {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    tenant?: Tenant;
    branch?: TenantBranch;
    patient?: Patient;
    appointment?: SchedulingAppointment;
    doctorUser?: IdentityUser;
    roomOrStation?: string;
    startedAt?: string;
    endedAt?: string;
    status?: string;
    chiefComplaintSummary?: string;
    diagnosisNotes?: string;
    prescriptionNotes?: string;
    aiInsights?: string;
};

