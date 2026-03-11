/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppointmentDto } from './AppointmentDto';
import type { PatientChatMessageDto } from './PatientChatMessageDto';
import type { RiskPatientDto } from './RiskPatientDto';
export type DoctorDashboardDto = {
    totalPatientsToday?: number;
    pendingConsultations?: number;
    completedConsultationsToday?: number;
    upcomingAppointments?: Array<AppointmentDto>;
    unreadMessages?: Array<PatientChatMessageDto>;
    riskPatients?: Array<RiskPatientDto>;
    criticalVitalsAlerts?: Array<string>;
};

