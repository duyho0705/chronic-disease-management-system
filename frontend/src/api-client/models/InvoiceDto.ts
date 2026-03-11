/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvoiceItemDto } from './InvoiceItemDto';
export type InvoiceDto = {
    id?: string;
    invoiceNumber?: string;
    patientId?: string;
    patientName?: string;
    consultationId?: string;
    totalAmount?: number;
    discountAmount?: number;
    finalAmount?: number;
    status?: string;
    paymentMethod?: string;
    paidAt?: string;
    createdAt?: string;
    items?: Array<InvoiceItemDto>;
};

