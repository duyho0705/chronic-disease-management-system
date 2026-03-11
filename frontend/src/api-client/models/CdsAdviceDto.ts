/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CdsSuggestion } from './CdsSuggestion';
import type { CdsWarning } from './CdsWarning';
export type CdsAdviceDto = {
    riskLevel?: string;
    summary?: string;
    warnings?: Array<CdsWarning>;
    suggestions?: Array<CdsSuggestion>;
    differentialDiagnoses?: Array<string>;
    aiReasoning?: string;
};

