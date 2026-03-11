/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AiAuditLog = {
    id?: string;
    tenantId?: string;
    branchId?: string;
    userId?: string;
    patientId?: string;
    featureType?: AiAuditLog.featureType;
    modelVersion?: string;
    inputData?: string;
    outputData?: string;
    latencyMs?: number;
    status?: string;
    errorMessage?: string;
    createdAt?: string;
};
export namespace AiAuditLog {
    export enum featureType {
        TRIAGE = 'TRIAGE',
        CDS = 'CDS',
        CLINICAL_SUPPORT = 'CLINICAL_SUPPORT',
        CARE_PLAN = 'CARE_PLAN',
        PRESCRIPTION_VERIFY = 'PRESCRIPTION_VERIFY',
        CHAT = 'CHAT',
        OPERATIONAL_INSIGHT = 'OPERATIONAL_INSIGHT',
        ICD10_CODING = 'ICD10_CODING',
        PHARMACY = 'PHARMACY',
        DIFFERENTIAL_DIAGNOSIS = 'DIFFERENTIAL_DIAGNOSIS',
        CLINICAL_CHECKLIST = 'CLINICAL_CHECKLIST',
    }
}

