/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdentityUser } from './IdentityUser';
import type { LocalTime } from './LocalTime';
import type { Patient } from './Patient';
import type { Tenant } from './Tenant';
import type { TenantBranch } from './TenantBranch';
export type SchedulingAppointment = {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    tenant?: Tenant;
    branch?: TenantBranch;
    patient?: Patient;
    appointmentDate?: string;
    slotStartTime?: LocalTime;
    slotEndTime?: LocalTime;
    status?: string;
    appointmentType?: string;
    notes?: string;
    createdByUser?: IdentityUser;
    doctorUser?: IdentityUser;
};

