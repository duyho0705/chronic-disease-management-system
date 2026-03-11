/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CareGap } from './CareGap';
export type PatientCrmInsightDto = {
    healthScoreLabel?: string;
    adherenceScore?: number;
    careGaps?: Array<CareGap>;
    retentionRisk?: string;
    nextBestAction?: string;
    aiSummary?: string;
};

