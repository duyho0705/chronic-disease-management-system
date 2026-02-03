import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTenant } from '@/context/TenantContext'
import { getQueueDefinitions, addQueueEntry } from '@/api/queues'
import { listMedicalServices } from '@/api/masterData'
import { toastService } from '@/services/toast'
import {
    X, ChevronRight, CheckCircle2,
    Stethoscope, User, Search, Tag
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { PatientDto } from '@/types/api'

interface CheckInModalProps {
    patient: PatientDto
    onClose: () => void
    onSuccess: () => void
}

export function CheckInModal({ patient, onClose, onSuccess }: CheckInModalProps) {
    const { headers, branchId } = useTenant()
    const queryClient = useQueryClient()

    const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null)
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
    const [notes, setNotes] = useState('')
    const [serviceSearch, setServiceSearch] = useState('')

    // 1. Get Queues
    const { data: queues, isLoading: loadingQueues } = useQuery({
        queryKey: ['queue-definitions', branchId],
        queryFn: () => getQueueDefinitions(branchId!, headers),
        enabled: !!branchId && !!headers?.tenantId,
    })

    // 2. Get Services
    const { data: services, isLoading: loadingServices } = useQuery({
        queryKey: ['medical-services-active'],
        queryFn: () => listMedicalServices({ onlyActive: true }, headers),
        enabled: !!headers?.tenantId
    })

    // Auto-select first queue
    if (queues && queues.length > 0 && !selectedQueueId) {
        // Prefer "Triage" or "Phân loại"
        const triage = queues.find(q => q.nameVi.toLowerCase().includes('triage') || q.nameVi.toLowerCase().includes('phân loại'))
        setSelectedQueueId(triage ? triage.id : queues[0].id)
    }

    const checkInMutation = useMutation({
        mutationFn: () => {
            if (!selectedQueueId) throw new Error('Vui lòng chọn hàng chờ')
            return addQueueEntry(
                {
                    queueDefinitionId: selectedQueueId,
                    patientId: patient.id!,
                    medicalServiceId: selectedServiceId || undefined,
                    notes: notes || undefined,
                    position: 0,
                },
                headers
            )
        },
        onSuccess: () => {
            toastService.success(`✨ Đã tiếp đón ${patient.fullNameVi} thành công!`)
            queryClient.invalidateQueries({ queryKey: ['queue-entries'] })
            onSuccess()
            onClose()
        },
        onError: (e: Error) => toastService.error(e.message)
    })

    const filteredServices = services?.filter(s =>
        s.nameVi.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        s.code.toLowerCase().includes(serviceSearch.toLowerCase())
    )

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-[#f8fafc] rounded-[3rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
                {/* Left Side: Patient Summary & Queue */}
                <div className="w-full md:w-80 bg-white border-r border-slate-100 p-8 flex flex-col">
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-4">
                            <User className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{patient.fullNameVi}</h2>
                        <div className="flex flex-col gap-1 mt-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{patient.dateOfBirth}</span>
                            <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full w-fit uppercase">{patient.gender === 'MALE' ? 'Nam' : 'Nữ'}</span>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Khu vực tiếp nhận</label>
                            <div className="space-y-2">
                                {loadingQueues ? (
                                    <div className="h-20 bg-slate-50 animate-pulse rounded-2xl" />
                                ) : queues?.map(q => (
                                    <button
                                        key={q.id}
                                        onClick={() => setSelectedQueueId(q.id)}
                                        className={`w-full p-4 rounded-2xl border text-left transition-all ${selectedQueueId === q.id
                                            ? 'bg-slate-900 border-slate-900 shadow-xl'
                                            : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200'}`}
                                    >
                                        <p className={`text-xs font-black uppercase tracking-tight ${selectedQueueId === q.id ? 'text-white' : 'text-slate-900'}`}>{q.nameVi}</p>
                                        <p className={`text-[10px] font-bold ${selectedQueueId === q.id ? 'text-slate-400' : 'text-slate-500'}`}>{q.roomOrStation || 'Sảnh chính'}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Ghi chú tiếp đón</label>
                            <textarea
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                placeholder="Lý do khám, triệu chứng sơ bộ..."
                                className="w-full bg-slate-50 border-transparent text-sm font-medium p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none h-24 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side: Service Selection */}
                <div className="flex-1 p-8 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                <Tag className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Chọn Dịch vụ thực hiện</h3>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Tìm nhanh tên dịch vụ hoặc mã..."
                            value={serviceSearch}
                            onChange={e => setServiceSearch(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 shadow-sm transition-all outline-none"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {loadingServices ? (
                            Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-white animate-pulse rounded-2xl border border-slate-50" />)
                        ) : filteredServices?.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setSelectedServiceId(s.id)}
                                className={`w-full p-4 rounded-[1.5rem] border flex items-center justify-between transition-all group ${selectedServiceId === s.id
                                    ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-100'
                                    : 'bg-white border-slate-50 hover:border-blue-200'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedServiceId === s.id ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                                        <Stethoscope className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-sm font-black uppercase tracking-tight leading-none mb-1 ${selectedServiceId === s.id ? 'text-white' : 'text-slate-900'}`}>{s.nameVi}</p>
                                        <p className={`text-[10px] font-bold ${selectedServiceId === s.id ? 'text-blue-100' : 'text-slate-400'}`}>#{s.code} · {s.category}</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-4">
                                    <div className="mr-2">
                                        <p className={`text-xs font-black ${selectedServiceId === s.id ? 'text-white' : 'text-slate-900'}`}>{s.unitPrice.toLocaleString('vi-VN')} <span className="opacity-50 text-[10px]">đ</span></p>
                                    </div>
                                    {selectedServiceId === s.id ? (
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-slate-100 group-hover:border-blue-200" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-50 flex gap-4">
                        <button
                            onClick={() => checkInMutation.mutate()}
                            disabled={!selectedQueueId || checkInMutation.isPending}
                            className="flex-1 bg-slate-900 text-white py-5 rounded-[1.5rem] font-black tracking-widest text-[10px] uppercase hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {checkInMutation.isPending ? 'Đang xử lý...' : (
                                <>
                                    Tiếp đón & Tạo số thứ tự
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-8 py-5 bg-slate-100 text-slate-500 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
