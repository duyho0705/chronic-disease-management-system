/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppointmentDto } from './AppointmentDto';
import type { ConsultationDto } from './ConsultationDto';
import type { InvoiceDto } from './InvoiceDto';
import type { MedicationReminderDto } from './MedicationReminderDto';
import type { PrescriptionDto } from './PrescriptionDto';
import type { TriageVitalDto } from './TriageVitalDto';
import type { VitalTrendDto } from './VitalTrendDto';
export type PatientDashboardDto = {
    patientId?: string;
    branchId?: string;
    patientName?: string;
    patientAvatar?: string;
    activeQueues?: number;
    nextAppointment?: AppointmentDto;
    recentVisits?: Array<ConsultationDto>;
    lastVitals?: Array<TriageVitalDto>;
    vitalHistory?: Array<TriageVitalDto>;
    latestPrescription?: PrescriptionDto;
    pendingInvoice?: InvoiceDto;
    medicationReminders?: Array<MedicationReminderDto>;
    healthAlerts?: Array<string>;
    vitalTrends?: Array<VitalTrendDto>;
    bloodType?: string;
    chronicConditions?: string;
    assignedDoctorName?: string;
};

