/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdentityUser } from './IdentityUser';
import type { Tenant } from './Tenant';
export type Doctor = {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    tenant?: Tenant;
    identityUser?: IdentityUser;
    specialty?: string;
    licenseNumber?: string;
    bio?: string;
};

