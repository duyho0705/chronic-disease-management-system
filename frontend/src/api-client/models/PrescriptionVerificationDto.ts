/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OptimizationSuggestion } from './OptimizationSuggestion';
import type { VerificationWarning } from './VerificationWarning';
export type PrescriptionVerificationDto = {
    status?: string;
    summary?: string;
    warnings?: Array<VerificationWarning>;
    suggestions?: Array<OptimizationSuggestion>;
    aiReasoning?: string;
};

