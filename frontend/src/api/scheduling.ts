import { get, post } from './client'
import type { TenantHeaders } from './client'

export interface AppointmentDto {
    id: string
    patientId: string
    patientName: string
    startTime: string
    endTime: string
    status: string
    notes?: string
}

export async function getAppointments(params: { branchId: string; date?: string }, tenant: TenantHeaders | null): Promise<AppointmentDto[]> {
    const sp = new URLSearchParams()
    sp.set('branchId', params.branchId)
    if (params.date) sp.set('date', params.date)
    return get<AppointmentDto[]>(`/appointments?${sp}`, tenant)
}

export async function checkInAppointment(id: string, queueDefinitionId: string, tenant: TenantHeaders | null): Promise<AppointmentDto> {
    const sp = new URLSearchParams()
    sp.set('queueDefinitionId', queueDefinitionId)
    return post<AppointmentDto>(`/appointments/${id}/check-in?${sp}`, {}, tenant)
}
