/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VitalWarning } from './VitalWarning';
export type ClinicalEarlyWarningDto = {
    news2Score?: number;
    riskLevel?: string;
    warnings?: Array<VitalWarning>;
    aiClinicalAssessment?: string;
    escalationProtocol?: string;
};

