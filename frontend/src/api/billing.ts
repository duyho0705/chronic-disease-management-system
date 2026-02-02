import { get, post } from './client'
import type { TenantHeaders } from './client'
import type { InvoiceDto, CreateInvoiceRequest } from '@/types/api'

export async function createInvoice(body: CreateInvoiceRequest, tenant: TenantHeaders | null): Promise<InvoiceDto> {
    return post<InvoiceDto>('/billing/invoices', body, tenant)
}

export async function getInvoice(id: string, tenant: TenantHeaders | null): Promise<InvoiceDto> {
    return get<InvoiceDto>(`/billing/invoices/${id}`, tenant)
}

export async function payInvoice(id: string, paymentMethod: string, tenant: TenantHeaders | null): Promise<InvoiceDto> {
    const sp = new URLSearchParams()
    sp.set('paymentMethod', paymentMethod)
    return post<InvoiceDto>(`/billing/invoices/${id}/pay?${sp.toString()}`, {}, tenant)
}
