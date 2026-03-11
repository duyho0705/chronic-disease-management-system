/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdentityUserRole } from './IdentityUserRole';
import type { Tenant } from './Tenant';
export type IdentityUser = {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    tenant?: Tenant;
    username?: string;
    email?: string;
    passwordHash?: string;
    fullNameVi?: string;
    phone?: string;
    isActive?: boolean;
    lastLoginAt?: string;
    tokenVersion?: number;
    userRoles?: Array<IdentityUserRole>;
};

