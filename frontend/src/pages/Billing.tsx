import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTenant } from '@/context/TenantContext'
import { getInvoice, payInvoice } from '@/api/billing'
import { toastService } from '@/services/toast'
import { CreditCard, Receipt, Clock, CheckCircle, Search } from 'lucide-react'

export function Billing() {
    const { headers } = useTenant()
    const queryClient = useQueryClient()
    const [invoiceId, setInvoiceId] = useState('')
    const [searchId, setSearchId] = useState('')

    const { data: invoice, isLoading, error } = useQuery({
        queryKey: ['invoice', searchId],
        queryFn: () => getInvoice(searchId, headers),
        enabled: !!searchId && !!headers?.tenantId,
        retry: false,
    })

    const pay = useMutation({
        mutationFn: (paymentMethod: string) => payInvoice(searchId, paymentMethod, headers),
        onSuccess: () => {
            toastService.success('💰 Đã xác nhận thanh toán thành công')
            queryClient.invalidateQueries({ queryKey: ['invoice', searchId] })
        },
        onError: (e: Error) => toastService.error(e.message),
    })

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setSearchId(invoiceId.trim())
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <header className="page-header text-center">
                <h1 className="text-3xl font-bold text-slate-900">Thanh toán & Viện phí</h1>
                <p className="text-slate-500 mt-2">Tra cứu hóa đơn và xác nhận thanh toán cho bệnh nhân.</p>
            </header>

            <section className="card max-w-xl mx-auto">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Nhập ID hóa đơn..."
                            value={invoiceId}
                            onChange={(e) => setInvoiceId(e.target.value)}
                            className="input pl-10 w-full"
                        />
                    </div>
                    <button type="submit" className="btn-primary">Tìm kiếm</button>
                </form>
            </section>

            {isLoading && <div className="text-center py-12">Đang tìm kiếm hóa đơn...</div>}

            {error && (
                <div className="card border-red-200 bg-red-50 text-red-700 text-center p-8">
                    Không tìm thấy hóa đơn. Vui lòng kiểm tra lại ID.
                </div>
            )}

            {invoice && (
                <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="card md:col-span-2 space-y-6">
                            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Chi tiết hóa đơn #{invoice.invoiceNumber}</h3>
                                    <p className="text-sm text-slate-500">Ngày tạo: {new Date(invoice.createdAt).toLocaleString('vi-VN')}</p>
                                </div>
                                <StatusBadge status={invoice.status} />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Bệnh nhân</span>
                                    <span className="font-semibold text-slate-900">{invoice.patientName}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">ID Bệnh nhân</span>
                                    <span className="font-mono text-slate-700">{invoice.patientId}</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-slate-500">
                                            <th className="text-left py-2 font-medium">Dịch vụ/Thuốc</th>
                                            <th className="text-right py-2 font-medium">SL</th>
                                            <th className="text-right py-2 font-medium">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {invoice.items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="py-3 text-slate-900 font-medium">{item.itemName}</td>
                                                <td className="py-3 text-right text-slate-600">{item.quantity}</td>
                                                <td className="py-3 text-right font-semibold">{item.lineTotal.toLocaleString('vi-VN')} đ</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="border-t border-slate-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Tạm tính</span>
                                    <span>{invoice.totalAmount.toLocaleString('vi-VN')} đ</span>
                                </div>
                                <div className="flex justify-between text-sm text-red-600">
                                    <span>Giảm giá</span>
                                    <span>-{invoice.discountAmount.toLocaleString('vi-VN')} đ</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t border-slate-100">
                                    <span>Tổng cộng</span>
                                    <span className="text-blue-600">{invoice.finalAmount.toLocaleString('vi-VN')} đ</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="card space-y-4">
                                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-blue-500" />
                                    Thanh toán
                                </h4>
                                {invoice.status === 'PENDING' ? (
                                    <div className="grid gap-2">
                                        <button
                                            onClick={() => pay.mutate('CASH')}
                                            disabled={pay.isPending}
                                            className="btn-success w-full"
                                        >
                                            Tiền mặt
                                        </button>
                                        <button
                                            onClick={() => pay.mutate('BANK_TRANSFER')}
                                            disabled={pay.isPending}
                                            className="btn-secondary w-full"
                                        >
                                            Chuyển khoản
                                        </button>
                                        <button
                                            onClick={() => pay.mutate('E_WALLET')}
                                            disabled={pay.isPending}
                                            className="btn-primary w-full"
                                        >
                                            Ví điện tử
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg flex flex-col items-center gap-2 text-center">
                                        <CheckCircle className="h-8 w-8 text-emerald-500" />
                                        <div>
                                            <p className="font-bold">Đã thanh toán</p>
                                            <p className="text-xs">{invoice.paymentMethod} • {invoice.paidAt && new Date(invoice.paidAt).toLocaleString('vi-VN')}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="card bg-slate-900 text-white space-y-3">
                                <Receipt className="h-8 w-8 text-slate-400" />
                                <h4 className="font-bold">Hỗ trợ xuất hóa đơn</h4>
                                <p className="text-xs text-slate-400">Vui lòng kiểm tra kỹ thông tin bệnh nhân trước khi xác nhận thanh toán.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'PENDING':
            return (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ring-amber-200">
                    <Clock className="h-3 w-3" />
                    CHỜ THANH TOÁN
                </span>
            )
        case 'PAID':
            return (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ring-emerald-200">
                    <CheckCircle className="h-3 w-3" />
                    ĐÃ THANH TOÁN
                </span>
            )
        default:
            return <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>
    }
}
