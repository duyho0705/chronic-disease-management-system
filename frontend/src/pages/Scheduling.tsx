import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTenant } from '@/context/TenantContext'
import { getAppointments, checkInAppointment } from '@/api/scheduling'
import { getQueueDefinitions } from '@/api/queues'
import { toastService } from '@/services/toast'
import { Calendar as CalendarIcon, Clock, User, ArrowRight, CheckCircle2 } from 'lucide-react'

export function Scheduling() {
    const { headers, branchId } = useTenant()
    const queryClient = useQueryClient()
    const today = new Date().toISOString().split('T')[0]
    const [date, setDate] = useState(today)
    const [selectedQueueId, setSelectedQueueId] = useState('')

    const { data: appointments, isLoading } = useQuery({
        queryKey: ['appointments', branchId, date],
        queryFn: () => getAppointments({ branchId: branchId!, date }, headers),
        enabled: !!branchId && !!headers?.tenantId,
    })

    const { data: queueDefinitions } = useQuery({
        queryKey: ['queue-definitions', branchId],
        queryFn: () => getQueueDefinitions(branchId!, headers),
        enabled: !!branchId && !!headers?.tenantId,
    })

    const checkIn = useMutation({
        mutationFn: (id: string) => {
            if (!selectedQueueId) throw new Error('Vui lòng chọn hàng chờ trước khi check-in')
            return checkInAppointment(id, selectedQueueId, headers)
        },
        onSuccess: () => {
            toastService.success('✅ Check-in thành công! Bệnh nhân đã được thêm vào hàng chờ.')
            queryClient.invalidateQueries({ queryKey: ['appointments'] })
            queryClient.invalidateQueries({ queryKey: ['queue-entries'] })
        },
        onError: (e: Error) => toastService.error(e.message),
    })

    return (
        <div className="mx-auto max-w-6xl space-y-8">
            <header className="page-header flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 text-premium">Quản lý Lịch hẹn</h1>
                    <p className="text-sm text-slate-500 mt-1">Quản lý lịch đặt trước và thực hiện check-in cho bệnh nhân.</p>
                </div>
                <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-slate-400" />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="input py-1.5"
                    />
                </div>
            </header>

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Settings Panel */}
                <aside className="lg:col-span-1 space-y-6">
                    <section className="card">
                        <h3 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Cấu hình Check-in</h3>
                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hàng chờ đích</span>
                                <select
                                    value={selectedQueueId}
                                    onChange={(e) => setSelectedQueueId(e.target.value)}
                                    className="input w-full mt-1.5"
                                >
                                    <option value="">-- Chọn hàng chờ --</option>
                                    {queueDefinitions?.map(q => (
                                        <option key={q.id} value={q.id}>{q.nameVi}</option>
                                    ))}
                                </select>
                            </label>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-[10px] text-blue-700 font-medium">
                                    💡 Sau khi check-in, bệnh nhân sẽ tự động xuất hiện trong hàng chờ đã chọn với mức độ ưu tiên mặc định.
                                </p>
                            </div>
                        </div>
                    </section>
                </aside>

                {/* List Panel */}
                <main className="lg:col-span-3 space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                        </div>
                    ) : appointments?.length ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {appointments.map((apt) => (
                                <div key={apt.id} className={`card border-l-4 transition-all hover:shadow-md ${apt.status === 'CHECKED_IN' ? 'border-l-emerald-500 opacity-75' : 'border-l-blue-500'}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                <User className="h-4 w-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{apt.patientName}</h4>
                                                <p className="text-[10px] text-slate-400 font-mono">{apt.id}</p>
                                            </div>
                                        </div>
                                        {apt.status === 'CHECKED_IN' ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        ) : (
                                            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">Confirmed</span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 bg-slate-50 p-2 rounded">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                                            {new Date(apt.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <ArrowRight className="h-3 w-3 text-slate-300" />
                                        <span>Hết: {new Date(apt.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>

                                    {apt.status !== 'CHECKED_IN' && (
                                        <button
                                            onClick={() => checkIn.mutate(apt.id)}
                                            disabled={checkIn.isPending || !selectedQueueId}
                                            className="btn-success w-full py-2 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {checkIn.isPending ? 'Đang check-in...' : 'Check-in ngay'}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-20 border-dashed">
                            <CalendarIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">Không có lịch hẹn</h3>
                            <p className="text-sm text-slate-500">Người bệnh chưa đặt lịch cho ngày hôm nay.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
