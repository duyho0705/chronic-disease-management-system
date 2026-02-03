import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTenant } from '@/context/TenantContext'
import { getQueueDefinitions, getQueueEntries, callQueueEntry } from '@/api/queues'
import { startConsultation, updateConsultation, completeConsultation, createPrescription, getPatientHistory } from '@/api/clinical'
import { getPharmacyProducts } from '@/api/pharmacy'
import { toastService } from '@/services/toast'
import {
    Clock, CheckCircle2,
    Stethoscope, Pill, ClipboardList,
    ChevronRight, ArrowLeft, Search,
    User, AlertCircle, FileText, Activity,
    History, Trash2
} from 'lucide-react'
import type {
    ConsultationDto,
    PharmacyProductDto
} from '@/types/api'

export function Consultation() {
    const { headers, branchId } = useTenant()
    const queryClient = useQueryClient()

    // State
    const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null)
    const [activeConsultation, setActiveConsultation] = useState<ConsultationDto | null>(null)
    const [diagnosis, setDiagnosis] = useState('')
    const [prescriptionItems, setPrescriptionItems] = useState<any[]>([])
    const [drugSearch, setDrugSearch] = useState('')
    const [activeTab, setActiveTab] = useState<'exam' | 'history' | 'vitals'>('exam')

    // 1. Fetch Queues
    const { data: queues } = useQuery({
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
    const { data: waitingEntries, isLoading: loadingQueue } = useQuery({
        queryKey: ['doctor-waiting-list', selectedQueueId],
        queryFn: () => getQueueEntries(selectedQueueId!, branchId!, headers),
        enabled: !!selectedQueueId && !!branchId && !!headers?.tenantId,
        refetchInterval: 5000 // Poll every 5s
    })

    // 3. Fetch Drugs
    const { data: drugs } = useQuery({
        queryKey: ['pharmacy-products-all'],
        queryFn: () => getPharmacyProducts(headers),
        enabled: !!activeConsultation
    })

    // 4. Start Consultation Mutation
    const startMutation = useMutation({
        mutationFn: (queueEntryId: string) => startConsultation({ queueEntryId }, headers),
        onSuccess: (data) => {
            setActiveConsultation(data)
            setDiagnosis(data.diagnosisNotes || '')
            setActiveTab('exam')
            queryClient.invalidateQueries({ queryKey: ['doctor-waiting-list'] })
            toastService.success('🚀 Đã bắt đầu phiên khám')
        }
    })

    // 5. Save/Complete Mutation
    const completeMutation = useMutation({
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
            toastService.success('✅ Đã hoàn tất phiên khám & xuất hóa đơn')
            setActiveConsultation(null)
            setDiagnosis('')
            setPrescriptionItems([])
            queryClient.invalidateQueries({ queryKey: ['doctor-waiting-list'] })
        }
    })

    const handleCall = async (entryId: string) => {
        try {
            await callQueueEntry(entryId, headers)
            toastService.info('🔔 Đã gọi bệnh nhân vào phòng')
            queryClient.invalidateQueries({ queryKey: ['doctor-waiting-list'] })
        } catch (e) {
            toastService.error('Không thể gọi số')
        }
    }

    const addPrescriptionItem = (drug: PharmacyProductDto) => {
        if (prescriptionItems.find(it => it.productId === drug.id)) {
            toastService.warning('Thuốc này đã có trong đơn')
            return
        }
        setPrescriptionItems([...prescriptionItems, {
            productId: drug.id,
            productName: drug.nameVi,
            quantity: 1,
            unit: drug.unit,
            unitPrice: drug.standardPrice,
            dosageInstruction: 'Uống sáng 1 viên, chiều 1 viên sau ăn'
        }])
        setDrugSearch('')
    }

    const filteredDrugs = drugs?.filter(d =>
        d.nameVi.toLowerCase().includes(drugSearch.toLowerCase()) ||
        d.code.toLowerCase().includes(drugSearch.toLowerCase())
    ).slice(0, 5)

    if (activeConsultation) {
        return (
            <div className="h-[calc(100vh-140px)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Active Consultation Header */}
                <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setActiveConsultation(null)}
                            className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="h-10 w-px bg-slate-100" />
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">BN. {activeConsultation.patientName}</h2>
                                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Đang khám</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-3 h-3 text-emerald-500" />
                                Lý do: {activeConsultation.chiefComplaintSummary || 'Khám tổng quát'}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => completeMutation.mutate()}
                            disabled={completeMutation.isPending}
                            className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-100 transition-all flex items-center gap-2"
                        >
                            {completeMutation.isPending ? 'Đang lưu...' : (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    Hoàn tất & Kết thúc
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex gap-6 min-h-0">
                    {/* Left: Main Workspace */}
                    <div className="flex-1 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="flex border-b border-slate-50">
                            {[
                                { id: 'exam', label: 'Khám bệnh & Chẩn đoán', icon: Stethoscope },
                                { id: 'history', label: 'Lịch sử bệnh án', icon: History },
                                { id: 'vitals', label: 'Chỉ số sinh tồn', icon: Activity }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 py-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {activeTab === 'exam' && (
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                                <ClipboardList className="w-4 h-4" />
                                            </div>
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Chẩn đoán của Bác sĩ</h3>
                                        </div>
                                        <textarea
                                            value={diagnosis}
                                            onChange={e => setDiagnosis(e.target.value)}
                                            placeholder="Nhập chẩn đoán, triệu chứng lâm sàng và hướng xử lý..."
                                            className="w-full bg-slate-50 border-transparent rounded-3xl p-6 font-medium text-slate-700 h-40 focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none resize-none"
                                        />
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                                                    <Pill className="w-4 h-4" />
                                                </div>
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Đơn thuốc chỉ định</h3>
                                            </div>
                                            <div className="relative w-72">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="text"
                                                    placeholder="Tìm thuốc thêm vào đơn..."
                                                    value={drugSearch}
                                                    onChange={e => setDrugSearch(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                                                />
                                                {drugSearch && filteredDrugs && (
                                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-20 overflow-hidden">
                                                        {filteredDrugs.map(d => (
                                                            <button
                                                                key={d.id}
                                                                onClick={() => addPrescriptionItem(d)}
                                                                className="w-full p-4 hover:bg-slate-50 text-left border-b border-slate-50 last:border-0"
                                                            >
                                                                <p className="text-[10px] font-black uppercase text-slate-900">{d.nameVi}</p>
                                                                <p className="text-[9px] font-bold text-slate-400">{d.standardPrice.toLocaleString()}đ · Còn: {d.active ? 'Sẵn sàng' : 'Hết hàng'}</p>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {prescriptionItems.length === 0 ? (
                                                <div className="py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400">
                                                    <Pill className="w-8 h-8 mb-2 opacity-20" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest">Chưa có thuốc trong đơn</p>
                                                </div>
                                            ) : prescriptionItems.map((it, idx) => (
                                                <div key={idx} className="bg-white border border-slate-100 p-4 rounded-[1.5rem] flex gap-4 group">
                                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1 grid grid-cols-12 gap-4">
                                                        <div className="col-span-4">
                                                            <p className="text-[10px] font-black text-slate-900 uppercase mb-1">{it.productName}</p>
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Giá: {it.unitPrice.toLocaleString()}đ</p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-tighter block mb-1">Số lượng</label>
                                                            <input
                                                                type="number"
                                                                value={it.quantity}
                                                                onChange={e => {
                                                                    const newItems = [...prescriptionItems]
                                                                    newItems[idx].quantity = parseInt(e.target.value) || 0
                                                                    setPrescriptionItems(newItems)
                                                                }}
                                                                className="w-full bg-slate-50 p-2 rounded-lg text-xs font-black outline-none focus:bg-white"
                                                            />
                                                        </div>
                                                        <div className="col-span-5">
                                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-tighter block mb-1">Hướng dẫn sử dụng</label>
                                                            <input
                                                                type="text"
                                                                value={it.dosageInstruction}
                                                                onChange={e => {
                                                                    const newItems = [...prescriptionItems]
                                                                    newItems[idx].dosageInstruction = e.target.value
                                                                    setPrescriptionItems(newItems)
                                                                }}
                                                                className="w-full bg-slate-50 p-2 rounded-lg text-xs font-bold outline-none focus:bg-white"
                                                            />
                                                        </div>
                                                        <div className="col-span-1 flex items-end">
                                                            <button
                                                                onClick={() => setPrescriptionItems(prescriptionItems.filter((_, i) => i !== idx))}
                                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <PatientHistory patientId={activeConsultation.patientId} />
                            )}
                        </div>
                    </div>

                    {/* Right: Quick Tools / EHR Sidebar */}
                    <div className="w-80 flex flex-col gap-6">
                        <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex-1">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                Sinh hiệu hiện tại
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Nhiệt độ', value: '37.2', unit: '°C' },
                                    { label: 'Huyết áp', value: '120/80', unit: 'mmHg' },
                                    { label: 'Nhịp tim', value: '82', unit: 'bpm' },
                                    { label: 'SpO2', value: '98', unit: '%' }
                                ].map((v, i) => (
                                    <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{v.label}</span>
                                        <p className="text-sm font-black text-slate-900">{v.value} <span className="text-[10px] text-slate-400 font-bold">{v.unit}</span></p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl -mr-10 -mt-10" />
                            <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                Cảnh báo & Lưu ý
                            </h3>
                            <p className="text-xs font-medium text-slate-400">Bệnh nhân có tiểu sử dị ứng với Penicillin. Cần lưu ý khi kê đơn kháng sinh.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#2b8cee] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                            <Stethoscope className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Phòng khám Bác sĩ</h1>
                    </div>
                    <p className="text-slate-500 font-medium ml-1">Quản lý hàng chờ khám và ghi nhận kết quả điều trị.</p>
                </div>

                {/* Queue Selection Tabs */}
                <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm gap-1">
                    {queues?.map(q => (
                        <button
                            key={q.id}
                            onClick={() => setSelectedQueueId(q.id)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedQueueId === q.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {q.nameVi}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Queue List */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Đang chờ trong hàng ({waitingEntries?.length || 0})
                        </h3>
                    </div>

                    {loadingQueue ? (
                        <div className="space-y-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-24 bg-white rounded-[2rem] animate-pulse border border-slate-50" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {waitingEntries?.map((e) => (
                                <div
                                    key={e.id}
                                    className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner relative">
                                            <User className="w-6 h-6" />
                                            {e.acuityLevel && (
                                                <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white ${e.acuityLevel === '1' ? 'bg-red-500' : e.acuityLevel === '2' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                                                    {e.acuityLevel}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-2 group-hover:text-blue-600 transition-colors uppercase">
                                                {e.patientName || 'BN.' + e.patientId.substring(0, 8)}
                                            </h4>
                                            <div className="flex items-center gap-4">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(e.joinedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                    Dịch vụ: {e.medicalServiceName || 'Khám chung'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCall(e.id)}
                                            className="px-6 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-50 hover:text-amber-600 transition-all"
                                        >
                                            Gọi BN
                                        </button>
                                        <button
                                            onClick={() => startMutation.mutate(e.id)}
                                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-100 transition-all flex items-center gap-2"
                                        >
                                            Vào khám
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {waitingEntries?.length === 0 && (
                                <div className="py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 mb-2">Hàng chờ hiện đang trống</h4>
                                    <p className="text-slate-400 font-medium max-w-xs">Hệ thống sẽ tự động cập nhật khi có bệnh nhân mới được tiếp đón.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: Insights / Today Stats */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-slate-500">Hiệu suất hôm nay</h3>
                        <div className="space-y-8">
                            {[
                                { label: 'Đã hoàn tất', value: '18', icon: CheckCircle2, sub: '+3 so với hôm qua' },
                                { label: 'Thời gian khám TB', value: '12m', icon: Clock, sub: 'Đang duy trì tốt' },
                                { label: 'Chỉ số hài lòng', value: '4.8/5', icon: Activity, sub: 'Dựa trên 12 đánh giá' }
                            ].map((s, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-400">
                                        <s.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black leading-none mb-1">{s.value}</p>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                                        <p className="text-[9px] font-bold text-blue-500 italic">{s.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
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

    if (isLoading) return <div className="space-y-4 animate-pulse">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 bg-slate-50 rounded-2xl" />)}</div>

    return (
        <div className="space-y-6">
            {history?.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl">
                    <History className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                    <p className="text-xs font-black text-slate-400 uppercase">Chưa có lịch sử khám bệnh</p>
                </div>
            ) : history?.map((item) => (
                <div key={item.id} className="bg-white border border-slate-100 p-6 rounded-[2rem] hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-900 uppercase">Khám chuyên khoa</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(item.startedAt).toLocaleDateString('vi-VN')}</p>
                            </div>
                        </div>
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Hoàn tất</span>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">Chẩn đoán:</p>
                        <p className="text-sm font-medium text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl">{item.diagnosisNotes || 'Không có ghi chú'}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
