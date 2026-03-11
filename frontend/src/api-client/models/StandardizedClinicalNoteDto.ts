/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CptCode } from './CptCode';
import type { Icd10Code } from './Icd10Code';
export type StandardizedClinicalNoteDto = {
    soapSubjective?: string;
    soapObjective?: string;
    soapAssessment?: string;
    soapPlan?: string;
    suggestedCptCodes?: Array<CptCode>;
    suggestedIcd10Codes?: Array<Icd10Code>;
    insuranceMemo?: string;
};

