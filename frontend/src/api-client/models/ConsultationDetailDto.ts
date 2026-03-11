/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConsultationDto } from './ConsultationDto';
import type { DiagnosticImageDto } from './DiagnosticImageDto';
import type { LabResultDto } from './LabResultDto';
import type { PrescriptionDto } from './PrescriptionDto';
export type ConsultationDetailDto = {
    consultation?: ConsultationDto;
    prescription?: PrescriptionDto;
    labResults?: Array<LabResultDto>;
    diagnosticImages?: Array<DiagnosticImageDto>;
};

