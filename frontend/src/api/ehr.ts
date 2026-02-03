import { get } from './client'
import type { TenantHeaders } from './client'
import type { TriageVitalDto, TimelineItemDto } from '@/types/api'

export async function getVitalsHistory(patientId: string, tenant: TenantHeaders | null): Promise<TriageVitalDto[]> {
    return get<TriageVitalDto[]>(`/ehr/patient/${patientId}/vitals`, tenant)
}

export async function getMedicalTimeline(patientId: string, tenant: TenantHeaders | null): Promise<TimelineItemDto[]> {
    return get<TimelineItemDto[]>(`/ehr/patient/${patientId}/timeline`, tenant)
}
