/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RiskFactor } from './RiskFactor';
export type ComplicationRiskDto = {
    riskLevel?: string;
    riskScore?: number;
    primaryRiskFactor?: string;
    detailFactors?: Array<RiskFactor>;
    aiWarning?: string;
    preventiveActions?: Array<string>;
};

