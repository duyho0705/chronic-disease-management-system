/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MetricInsight } from './MetricInsight';
export type TreatmentEfficacyDto = {
    overallStatus?: string;
    adherenceCorrelation?: number;
    metricInsights?: Array<MetricInsight>;
    aiAnalysis?: string;
    recommendations?: Array<string>;
};

