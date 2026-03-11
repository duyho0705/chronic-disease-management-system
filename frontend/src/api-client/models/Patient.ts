/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Doctor } from './Doctor';
import type { IdentityUser } from './IdentityUser';
import type { Tenant } from './Tenant';
export type Patient = {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    tenant?: Tenant;
    identityUser?: IdentityUser;
    externalId?: string;
    cccd?: string;
    fullNameVi?: string;
    dateOfBirth?: string;
    gender?: string;
    phone?: string;
    email?: string;
    addressLine?: string;
    city?: string;
    district?: string;
    ward?: string;
    nationality?: string;
    ethnicity?: string;
    avatarUrl?: string;
    bloodType?: string;
    allergies?: string;
    chronicConditions?: string;
    riskLevel?: string;
    assignedDoctor?: Doctor;
    isActive?: boolean;
    identityUserId?: string;
};

