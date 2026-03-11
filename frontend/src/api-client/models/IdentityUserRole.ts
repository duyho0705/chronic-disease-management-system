/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdentityRole } from './IdentityRole';
import type { IdentityUser } from './IdentityUser';
import type { Tenant } from './Tenant';
import type { TenantBranch } from './TenantBranch';
export type IdentityUserRole = {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    user?: IdentityUser;
    role?: IdentityRole;
    tenant?: Tenant;
    branch?: TenantBranch;
};

