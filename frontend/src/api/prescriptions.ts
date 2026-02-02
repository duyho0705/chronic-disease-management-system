import { get, post } from './client'
import type { TenantHeaders } from './client'
import type { PrescriptionDto, CreatePrescriptionRequest } from '@/types/api'

export async function getPendingPrescriptions(branchId: string, tenant: TenantHeaders | null): Promise<PrescriptionDto[]> {
    return get<PrescriptionDto[]>(`/prescriptions/pending?branchId=${branchId}`, tenant)
}

export async function createPrescription(body: CreatePrescriptionRequest, tenant: TenantHeaders | null): Promise<PrescriptionDto> {
    return post<PrescriptionDto>('/prescriptions', body, tenant)
}

export async function dispensePrescription(id: string, tenant: TenantHeaders | null): Promise<void> {
    return post<void>(`/prescriptions/${id}/dispense`, {}, tenant)
}
