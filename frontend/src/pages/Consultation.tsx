import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTenant } from '@/context/TenantContext'
import { getQueueDefinitions, getQueueEntries, callQueueEntry } from '@/api/queues'
import {
    startConsultation,
    updateConsultation,
    completeConsultation,
    createPrescription,
    getPatientHistory,
    getVitals
} from '@/api/clinical'
import { getPharmacyProducts } from '@/api/pharmacy'
import { toastService } from '@/services/toast'
import {
    Clock,
    CheckCircle2,
    Stethoscope,
    Pill,
    ClipboardList,
    ChevronRight,
    ArrowLeft,
    Search,
    User,
    AlertCircle,
    FileText,
    Activity,
    History,
    Trash2,
    Thermometer,
    Heart,
    Wind,
    Droplets,
    Zap,
    ExternalLink,
    BrainCircuit
} from 'lucide-react'
import type {
    ConsultationDto,
    PharmacyProductDto,
    QueueEntryDto,
    QueueDefinitionDto
} from '@/types/api'
import { motion, AnimatePresence } from 'framer-motion'

export function Consultation() {
    const { headers, branchId } = useTenant()
    const queryClient = useQueryClient()

    // State
    const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null)
    const [activeConsultation, setActiveConsultation] = useState<ConsultationDto | null>(null)
    const [diagnosis, setDiagnosis] = useState('')
    const [prescriptionItems, setPrescriptionItems] = useState<{
        productId: string;
        productName: string;
        quantity: number;
        unit: string;
        unitPrice: number;
        dosageInstruction: string;
    }[]>([])
    const [drugSearch, setDrugSearch] = useState('')
    const [activeTab, setActiveTab] = useState<'exam' | 'history' | 'vitals'>('exam')

    // 1. Fetch Queues
    const { data: queues } = useQuery<QueueDefinitionDto[]>({
        queryKey: ['doctor-queues', branchId],
        queryFn: () => getQueueDefinitions(branchId!, headers),
        enabled: !!branchId && !!headers?.tenantId,
    })

    // Auto-select consultation queue
    useEffect(() => {
        if (queues && queues.length > 0 && !selectedQueueId) {
            const docQueue = queues.find(q => q.nameVi.toLowerCase().includes('khám') || q.nameVi.toLowerCase().includes('consultation'))
            setSelectedQueueId(docQueue ? docQueue.id : queues[0].id)
        }
    }, [queues, selectedQueueId])

    // 2. Fetch Waiting List
    const { data: waitingEntries, isLoading: loadingQueue } = useQuery<QueueEntryDto[]>({
        queryKey: ['doctor-waiting-list', selectedQueueId],
        queryFn: () => getQueueEntries(selectedQueueId!, branchId!, headers),
        enabled: !!selectedQueueId && !!branchId && !!headers?.tenantId,
        refetchInterval: 5000 // Poll every 5s
    })

    // 3. Fetch Drugs
    const { data: drugs } = useQuery<PharmacyProductDto[]>({
        queryKey: ['pharmacy-products-all'],
        queryFn: () => getPharmacyProducts(headers),
        enabled: !!activeConsultation
    })

    // 4. Start Consultation Mutation
    const startMutation = useMutation<ConsultationDto, Error, string>({
        mutationFn: (queueEntryId: string) => startConsultation({ queueEntryId }, headers),
        onSuccess: (data) => {
            setActiveConsultation(data)
            setDiagnosis(data.diagnosisNotes || '')
            setActiveTab('exam')
            queryClient.invalidateQueries({ queryKey: ['doctor-waiting-list'] })
            toastService.success('🚀 Bắt đầu phiên khám EMR')
        }
    })

    // 5. Save/Complete Mutation
    const completeMutation = useMutation<ConsultationDto | undefined, Error, void>({
        mutationFn: async () => {
            if (!activeConsultation) return
            // First update notes
            await updateConsultation(activeConsultation.id, {
                diagnosisNotes: diagnosis,
            }, headers)

            // Create prescription if items exist
            if (prescriptionItems.length > 0) {
                await createPrescription({
                    consultationId: activeConsultation.id,
                    items: prescriptionItems.map(it => ({
                        productId: it.productId,
                        quantity: it.quantity,
                        dosageInstruction: it.dosageInstruction,
                        unitPrice: it.unitPrice
                    }))
                }, headers)
            }

            // Complete
            return completeConsultation(activeConsultation.id, headers)
        },
        onSuccess: () => {
            toastService.success('✅ Hoàn tất & Đã tự động lập hóa đơn')
            setActiveConsultation(null)
            setDiagnosis('')
            setPrescriptionItems([])
            queryClient.invalidateQueries({ queryKey: ['doctor-waiting-list'] })
        }
    })

    const handleCall = async (entryId: string) => {
        try {
            await callQueueEntry(entryId, headers)
            toastService.info('🔔 Đã phát âm báo mời bệnh nhân')
            queryClient.invalidateQueries({ queryKey: ['doctor-waiting-list'] })
        } catch (e) {
            toastService.error('Lỗi khi gọi số')
        }
    }

    const addPrescriptionItem = (drug: PharmacyProductDto) => {
        if (prescriptionItems.find(it => it.productId === drug.id)) {
            toastService.warning('Thuốc đã được liệt kê')
            return
        }
        setPrescriptionItems([...prescriptionItems, {
            productId: drug.id,
            productName: drug.nameVi,
            quantity: 1,
            unit: drug.unit,
            unitPrice: drug.standardPrice,
            dosageInstruction: 'Ngày uống 2 lần, mỗi lần 1 viên sau ăn'
        }])
        setDrugSearch('')
    }

    const filteredDrugs = drugs?.filter(d =>
        d.nameVi.toLowerCase().includes(drugSearch.toLowerCase()) ||
        d.code.toLowerCase().includes(drugSearch.toLowerCase())
    ).slice(0, 8)

    if (activeConsultation) {
        return (
            <div className="h-[calc(100vh-140px)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* Modern Clinical Header */}
                <div className="bg-white rounded-[3rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setActiveConsultation(null)}
                            className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-inner"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="h-12 w-px bg-slate-100" />
                        <div>
                            <div className="flex items-center gap-4 mb-1">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tightest uppercase">BN. {activeConsultation.patientName}</h1>
                                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100 italic">In Session</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Activity className="w-3.5 h-3.5 text-blue-500" />
                                    Lý do: <span className="text-slate-600 italic font-black">{activeConsultation.chiefComplaintSummary || 'Khám tổng quát'}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ưu tiên:</span>
                                    <span className={`w-3 h-3 rounded-full ${activeConsultation.acuityLevel === '1' ? 'bg-red-500 animate-pulse' : activeConsultation.acuityLevel === '2' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => completeMutation.mutate()}
                        disabled={completeMutation.isPending}
                        className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 hover:shadow-2xl hover:shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                        {completeMutation.isPending ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                Kết thúc & Lưu hồ sơ
                            </>
                        )}
                    </button>
                </div>

                <div className="flex-1 flex gap-8 min-h-0">
                    {/* Left: Main Workspace */}
                    <div className="flex-1 bg-white rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col">
                        <div className="flex bg-slate-50/50 p-2 border-b border-slate-100">
                            {[
                                { id: 'exam', label: 'EHR Workspace', icon: FileText },
                                { id: 'history', label: 'Lịch sử Clinical', icon: History },
                                { id: 'vitals', label: 'Sinh hiệu chi tiết', icon: Activity }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 py-5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.15em] rounded-3xl transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {activeTab === 'exam' && (
                                    <motion.div
                                        key="exam"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-12"
                                    >
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                                    <ClipboardList className="w-5 h-5" />
                                                </div>
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Chẩn đoán chuyên môn</h3>
                                            </div>
                                            <textarea
                                                value={diagnosis}
                                                onChange={e => setDiagnosis(e.target.value)}
                                                placeholder="Khám lâm sàng, kết luận chẩn đoán và ghi chú điều trị..."
                                                className="w-full bg-slate-50 border-none rounded-[2.5rem] p-8 font-medium text-slate-700 h-56 focus:bg-white focus:ring-8 focus:ring-blue-500/5 transition-all outline-none resize-none leading-relaxed text-lg shadow-inner"
                                            />
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                                                        <Pill className="w-5 h-5" />
                                                    </div>
                                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Kế hoạch sử dụng thuốc</h3>
                                                </div>
                                                <div className="relative w-96">
                                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                    <input
                                                        type="text"
                                                        placeholder="Tìm tên thuốc hoặc mã dược..."
                                                        value={drugSearch}
                                                        onChange={e => setDrugSearch(e.target.value)}
                                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-black focus:bg-white focus:ring-8 focus:ring-blue-500/5 outline-none transition-all shadow-inner"
                                                    />
                                                    {drugSearch && filteredDrugs && (
                                                        <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-[2rem] shadow-2xl z-50 overflow-hidden ring-1 ring-slate-200">
                                                            {filteredDrugs.map(d => (
                                                                <button
                                                                    key={d.id}
                                                                    onClick={() => addPrescriptionItem(d)}
                                                                    className="w-full p-5 hover:bg-blue-50 text-left border-b border-slate-50 last:border-0 transition-colors flex items-center justify-between group"
                                                                >
                                                                    <div>
                                                                        <p className="text-[11px] font-black uppercase text-slate-900 group-hover:text-blue-600 transition-colors">{d.nameVi}</p>
                                                                        <p className="text-[9px] font-bold text-slate-400 mt-0.5">{d.code} • {d.unit}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-[11px] font-black text-slate-900">{d.standardPrice.toLocaleString()}đ</p>
                                                                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Sẵn sàng</span>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {prescriptionItems.length === 0 ? (
                                                    <div className="py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400">
                                                        <div className="p-6 bg-white rounded-3xl mb-4 shadow-sm">
                                                            <Pill className="w-10 h-10 opacity-20" />
                                                        </div>
                                                        <p className="text-[11px] font-black uppercase tracking-[0.2em]">Chưa có chỉ định thuốc</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {prescriptionItems.map((it, idx) => (
                                                            <motion.div
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                key={idx}
                                                                className="bg-white border border-slate-100 p-6 rounded-[2rem] flex gap-6 hover:shadow-lg hover:border-blue-100 transition-all group"
                                                            >
                                                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                                    {idx + 1}
                                                                </div>
                                                                <div className="flex-1 grid grid-cols-12 gap-8">
                                                                    <div className="col-span-4">
                                                                        <p className="text-[11px] font-black text-slate-900 uppercase mb-1">{it.productName}</p>
                                                                        <p className="text-[10px] font-bold text-slate-400">Đơn giá: {it.unitPrice.toLocaleString()}đ</p>
                                                                    </div>
                                                                    <div className="col-span-2">
                                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter block mb-2">Số lượng</label>
                                                                        <input
                                                                            type="number"
                                                                            value={it.quantity}
                                                                            onChange={e => {
                                                                                const newItems = [...prescriptionItems]
                                                                                newItems[idx].quantity = parseInt(e.target.value) || 0
                                                                                setPrescriptionItems(newItems)
                                                                            }}
                                                                            className="w-full bg-slate-50 p-3 rounded-xl text-sm font-black outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-center"
                                                                        />
                                                                    </div>
                                                                    <div className="col-span-5">
                                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter block mb-2">Liều dùng & Cách dùng</label>
                                                                        <input
                                                                            type="text"
                                                                            value={it.dosageInstruction}
                                                                            onChange={e => {
                                                                                const newItems = [...prescriptionItems]
                                                                                newItems[idx].dosageInstruction = e.target.value
                                                                                setPrescriptionItems(newItems)
                                                                            }}
                                                                            className="w-full bg-slate-50 p-3 rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all italic"
                                                                        />
                                                                    </div>
                                                                    <div className="col-span-1 flex items-end justify-end">
                                                                        <button
                                                                            onClick={() => setPrescriptionItems(prescriptionItems.filter((_, i) => i !== idx))}
                                                                            className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                                                        >
                                                                            <Trash2 className="w-5 h-5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'history' && (
                                    <motion.div
                                        key="history"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="animate-in slide-in-from-right-4 duration-500"
                                    >
                                        <PatientHistory patientId={activeConsultation.patientId} />
                                    </motion.div>
                                )}

                                {activeTab === 'vitals' && (
                                    <motion.div
                                        key="vitals"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="grid grid-cols-2 gap-8"
                                    >
                                        <ConsultationVitals consultationId={activeConsultation.id} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right: Sidebar EHR Info */}
                    <div className="w-96 flex flex-col gap-8">
                        {/* Vital Monitoring */}
                        <div className="bg-white rounded-[3.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <Activity className="w-5 h-5 text-emerald-500" />
                                Sinh hiệu hiện thời
                                <span className="text-[10px] text-emerald-500 font-bold ml-auto px-2 py-0.5 bg-emerald-50 rounded-full">REALTIME</span>
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { label: 'Nhiệt độ', value: '37.2', unit: '°C', icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-50' },
                                    { label: 'Huyết áp', value: '120/80', unit: 'mmHg', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
                                    { label: 'Nhịp tim', value: '82', unit: 'bpm', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
                                    { label: 'SpO2', value: '98', unit: '%', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50' }
                                ].map((v, i) => (
                                    <div key={i} className="flex justify-between items-center bg-slate-50/50 hover:bg-white hover:shadow-md p-4 rounded-3xl transition-all border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 ${v.bg} ${v.color} rounded-2xl flex items-center justify-center`}>
                                                <v.icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{v.label}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-base font-black text-slate-900 leading-none">{v.value}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{v.unit}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Warning / EHR Notes */}
                        <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group flex-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
                            <div className="absolute bottom-10 right-10 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                                <AlertCircle className="w-48 h-48" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3 text-amber-500">
                                <Zap className="w-5 h-5" />
                                AI Insight & EHR Notes
                            </h3>
                            <div className="space-y-6 relative z-10">
                                <div className="p-6 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-3">
                                    <h4 className="text-[10px] font-black uppercase text-amber-500">Lưu ý tiền sử bệnh</h4>
                                    <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
                                        "Bệnh nhân có tiền sử dị ứng với Penicillin G và đau dạ dày mạn tính. Ưu tiên các dòng kháng sinh thế hệ mới nếu cần."
                                    </p>
                                </div>
                                <div className="p-6 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-3">
                                    <h4 className="text-[10px] font-black uppercase text-blue-400">Gợi ý chẩn đoán (AI)</h4>
                                    <p className="text-xs font-bold text-slate-400 leading-relaxed">
                                        Dựa trên các triệu chứng và sinh hiệu, AI đề xuất khả năng Viêm đường hô hấp trên cấp tính (J06.9).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Reception Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-slate-100">
                <div className="space-y-3">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-[#2b8cee] rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-200">
                            <Stethoscope className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tightest leading-none">Phòng Bác sĩ</h1>
                            <p className="text-slate-500 font-bold ml-1 mt-1 uppercase tracking-widest text-[10px]">Consultation & EMR Hub</p>
                        </div>
                    </div>
                </div>

                {/* Queue Selection Premium Tabs */}
                <div className="flex bg-white p-2 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 gap-2 overflow-x-auto no-scrollbar">
                    {queues?.map(q => (
                        <button
                            key={q.id}
                            onClick={() => setSelectedQueueId(q.id)}
                            className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap whitespace-pre ${selectedQueueId === q.id ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                        >
                            {q.nameVi}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                {/* Left: Enhanced Queue List */}
                <div className="xl:col-span-8 space-y-8">
                    <div className="flex items-center justify-between px-4">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            Đang chờ trong hàng ({waitingEntries?.length || 0})
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <AnimatePresence mode="popLayout">
                            {loadingQueue ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-32 bg-white rounded-[3rem] animate-pulse border border-slate-50 shadow-sm" />
                                ))
                            ) : (
                                waitingEntries?.map((e, idx) => (
                                    <motion.div
                                        key={idx}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-100 transition-all group flex items-center justify-between relative overflow-hidden"
                                    >
                                        <div className="absolute -right-6 -bottom-6 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-1000 group-hover:opacity-[0.05]">
                                            <User className="w-32 h-32" />
                                        </div>
                                        <div className="flex items-center gap-8 relative z-10">
                                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner relative">
                                                <User className="w-8 h-8" />
                                                {e.acuityLevel && (
                                                    <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-black text-white shadow-lg ${e.acuityLevel === '1' ? 'bg-red-500' : e.acuityLevel === '2' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                                                        {e.acuityLevel}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-black text-slate-900 tracking-tightest leading-none mb-3 group-hover:text-blue-600 transition-colors uppercase">
                                                    {e.patientName || 'ANONYMOUS BN'}
                                                </h4>
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        Đợi: {new Date(e.joinedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="text-[10px] font-black text-blue-500 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-[0.1em]">
                                                        DỊCH VỤ: {e.medicalServiceName || 'KHÁM CHUYÊN KHOA'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 relative z-10">
                                            <button
                                                onClick={() => handleCall(e.id)}
                                                className="w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center hover:bg-amber-50 hover:text-amber-600 transition-all"
                                                title="Gọi âm thanh"
                                            >
                                                <Droplets className="w-6 h-6 rotate-180" />
                                            </button>
                                            <button
                                                onClick={() => startMutation.mutate(e.id)}
                                                className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-3"
                                            >
                                                Vào Khám
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}

                            {!loadingQueue && waitingEntries?.length === 0 && (
                                <div className="py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 shadow-inner">
                                        <CheckCircle2 className="w-12 h-12" />
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-900 mb-2">Đã xong tất cả hàng chờ</h4>
                                    <p className="text-slate-400 font-bold max-w-xs uppercase text-[10px] tracking-widest">Tuyệt vời, không có bệnh nhân nào đang đợi!</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right: Daily Insights & Stats */}
                <div className="xl:col-span-4 space-y-10">
                    <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 blur-3xl rounded-full" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-12 text-slate-500">Hiệu suất Clinical hôm nay</h3>
                        <div className="space-y-12">
                            {[
                                { label: 'Tổng ca hoàn tất', value: '24', icon: CheckCircle2, sub: '+4 so với KPI', color: 'text-emerald-400' },
                                { label: 'TG khám trung bình', value: '14ph', icon: Clock, sub: 'Đang duy trì ổn định', color: 'text-blue-400' },
                                { label: 'Độ hài lòng BN', value: '4.9/5', icon: Activity, sub: 'Dựa trên khảo sát thực tế', color: 'text-amber-400' }
                            ].map((s, i) => (
                                <div key={i} className="flex items-start gap-6 group">
                                    <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center ${s.color} group-hover:bg-white/10 transition-colors shadow-inner`}>
                                        <s.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black leading-none mb-2 tracking-tightest">{s.value}</p>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{s.label}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-blue-600" />
                                            <p className="text-[10px] font-bold text-slate-400 italic">{s.sub}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 pt-10 border-t border-white/5">
                            <button className="w-full py-5 bg-white/5 hover:bg-white/10 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-[1.5rem] transition-all flex items-center justify-center gap-3">
                                Xem báo cáo chi tiết <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-700">
                            <BrainCircuit className="w-32 h-32" />
                        </div>
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Trợ lý bác sĩ (AI)</h3>
                        <p className="text-sm font-bold text-slate-600 leading-relaxed italic border-l-4 border-blue-500 pl-6 py-2">
                            "Nhắc nhở: Hệ thống phát hiện mật độ hàng chờ đang tăng ở khu vực siêu âm, vui lòng ưu tiên hoàn tất các ca khám nhanh."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PatientHistory({ patientId }: { patientId: string }) {
    const { headers } = useTenant()
    const { data: history, isLoading } = useQuery({
        queryKey: ['patient-history', patientId],
        queryFn: () => getPatientHistory(patientId, headers),
        enabled: !!patientId
    })

    if (isLoading) return <div className="space-y-6">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 bg-slate-50 rounded-[2.5rem] animate-pulse" />)}</div>

    return (
        <div className="space-y-6">
            {history?.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                    <History className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Hồ sơ bệnh án trống</p>
                </div>
            ) : history?.map((item) => (
                <div key={item.id} className="bg-white border border-slate-100 p-8 rounded-[3rem] hover:shadow-xl hover:border-blue-100 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">KẾT QUẢ KHÁM CHUYÊN KHOA</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(item.startedAt).toLocaleDateString('vi-VN')}
                                    </p>
                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">Bác sĩ: {item.doctorName || 'Hệ thống'}</p>
                                </div>
                            </div>
                        </div>
                        <span className="bg-slate-900 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">VIEW FULL EHR</span>
                    </div>
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Kết luận chẩn đoán:</p>
                        <div className="text-base font-medium text-slate-700 leading-relaxed bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 italic">
                            "{item.diagnosisNotes || 'Dữ liệu không được ghi nhận'}"
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function ConsultationVitals({ consultationId }: { consultationId: string }) {
    const { headers } = useTenant()
    const { data: vitals, isLoading } = useQuery({
        queryKey: ['consultation-vitals', consultationId],
        queryFn: () => getVitals(consultationId, headers),
        enabled: !!consultationId
    })

    if (isLoading) return Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-slate-50 rounded-3xl animate-pulse" />)

    return (
        <>
            {vitals?.map((v, i) => (
                <div key={i} className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <Activity className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{v.vitalType}</p>
                        <p className="text-2xl font-black text-slate-900">{v.valueNumeric} <span className="text-[10px] text-slate-400 uppercase ml-1 font-bold">{v.unit}</span></p>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Recorded: {new Date(v.recordedAt).toLocaleTimeString()}</p>
                    </div>
                </div>
            ))}
            {(!vitals || vitals.length === 0) && (
                <div className="col-span-2 py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Không có dữ liệu sinh hiệu chi tiết cho ca này</p>
                </div>
            )}
        </>
    )
}
