import { get } from './client'
import type { TenantHeaders } from './client'
import type { PatientPortalStatusDto } from '@/types/api'

export async function getPatientPortalStatus(patientId: string, tenant: TenantHeaders | null): Promise<PatientPortalStatusDto> {
    return get<PatientPortalStatusDto>(`/portal/status/${patientId}`, tenant)
}
