import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTenant } from '@/context/TenantContext'
import { getPendingPrescriptions, dispensePrescription } from '@/api/pharmacy'
import { toastService } from '@/services/toast'
import {
    Pill,
    Search,
    User,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    PackageCheck,
    ArrowLeft,
    Printer,
    Check
} from 'lucide-react'
import type { PrescriptionDto } from '@/types/api'
import { motion, AnimatePresence } from 'framer-motion'

export function PharmacyDispensing() {
    const { headers, branchId } = useTenant()
    const queryClient = useQueryClient()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionDto | null>(null)

    // 1. Fetch Pending Prescriptions
    const { data: prescriptions, isLoading } = useQuery<PrescriptionDto[]>({
        queryKey: ['pending-prescriptions', branchId],
        queryFn: () => getPendingPrescriptions(branchId!, headers),
        enabled: !!branchId && !!headers?.tenantId,
        refetchInterval: 10000 // Poll every 10s
    })

    // 2. Dispense Mutation
    const dispenseMutation = useMutation<void, Error, string>({
        mutationFn: (id: string) => dispensePrescription(id, headers),
        onSuccess: () => {
            toastService.success('✅ Đã cấp phát thuốc & Cập nhật kho')
            queryClient.invalidateQueries({ queryKey: ['pending-prescriptions'] })
            setSelectedPrescription(null)
        },
        onError: (e: any) => {
            toastService.error(e.message || 'Lỗi khi cấp phát thuốc')
        }
    })

    const filteredPrescriptions = prescriptions?.filter(p =>
        p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const isPaid = (status?: string) => status === 'PAID'

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Pharmacy Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-slate-100">
                <div className="space-y-3">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-emerald-200">
                            <Pill className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tightest leading-none">Quầy Dược</h1>
                            <p className="text-slate-500 font-bold ml-1 mt-1 uppercase tracking-widest text-[10px]">Dispensing & Inventory Control</p>
                        </div>
                    </div>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Tìm bệnh nhân hoặc mã đơn..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] font-bold text-slate-700 shadow-xl shadow-slate-200/40 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* List Section */}
                <div className="xl:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Đơn thuốc chờ xử lý ({filteredPrescriptions?.length || 0})
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <AnimatePresence mode="popLayout">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-40 bg-white rounded-[3rem] animate-pulse border border-slate-50 shadow-sm" />
                                ))
                            ) : filteredPrescriptions?.map((p) => (
                                <motion.div
                                    key={p.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={() => setSelectedPrescription(p)}
                                    className={`bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-100 transition-all group flex items-center justify-between cursor-pointer relative overflow-hidden ${selectedPrescription?.id === p.id ? 'ring-2 ring-emerald-500 border-emerald-500' : ''}`}
                                >
                                    <div className="flex items-center gap-8 relative z-10">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                                            <User className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-4 mb-3">
                                                <h4 className="text-2xl font-black text-slate-900 tracking-tightest leading-none uppercase group-hover:text-emerald-600 transition-colors">
                                                    {p.patientName}
                                                </h4>
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isPaid(p.invoiceStatus) ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                                    {isPaid(p.invoiceStatus) ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {p.id.substring(0, 8)}...
                                                </div>
                                                <div className="text-[10px] font-black text-blue-500 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-[0.1em]">
                                                    Bác sĩ: {p.doctorName || 'Hệ thống'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className="text-right mr-4 hidden md:block">
                                            <p className="text-xs font-black text-slate-900">{p.items.length} loại thuốc</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Click để xem chi tiết</p>
                                        </div>
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                                            <ChevronRight className="w-6 h-6" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {!isLoading && filteredPrescriptions?.length === 0 && (
                                <div className="py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 shadow-inner">
                                        <CheckCircle2 className="w-12 h-12" />
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-900 mb-2">Tất cả đơn đã xử lý</h4>
                                    <p className="text-slate-400 font-bold max-w-xs uppercase text-[10px] tracking-widest">Không còn đơn thuốc nào đang chờ cấp phát!</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Detail Section */}
                <div className="xl:col-span-4 lg:row-start-1 xl:row-start-auto">
                    <AnimatePresence mode="wait">
                        {selectedPrescription ? (
                            <motion.div
                                key={selectedPrescription.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/40 p-10 sticky top-10 space-y-10"
                            >
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => setSelectedPrescription(null)}
                                        className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-inner"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div className="flex gap-2">
                                        <button className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-inner">
                                            <Printer className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                            <PackageCheck className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 uppercase leading-none mb-1">{selectedPrescription.patientName}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {selectedPrescription.id.substring(0, 8)}</p>
                                        </div>
                                    </div>

                                    {!isPaid(selectedPrescription.invoiceStatus) && (
                                        <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 mb-8 flex items-start gap-4">
                                            <AlertCircle className="w-6 h-6 text-amber-500 mt-1" />
                                            <div>
                                                <h5 className="text-xs font-black text-amber-900 uppercase mb-1">Chưa thanh toán</h5>
                                                <p className="text-xs font-bold text-amber-700 leading-relaxed italic">
                                                    Đơn thuốc này chưa được thanh toán tại quầy thu ngân. Vui lòng kiểm tra kỹ trước khi cấp phát.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Nội dung đơn thuốc</h4>
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
                                        {selectedPrescription.items.map((item, idx) => (
                                            <div key={idx} className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-50 group hover:bg-white hover:shadow-lg transition-all">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-black text-slate-900 uppercase">{item.productName}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 italic mt-1">{item.dosageInstruction}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-black text-emerald-600">x{item.quantity}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${(item.availableStock || 0) >= item.quantity ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Kho: {item.availableStock || 0}</span>
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-900">{(item.unitPrice || 0).toLocaleString()}đ</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => dispenseMutation.mutate(selectedPrescription.id)}
                                    disabled={dispenseMutation.isPending || !isPaid(selectedPrescription.invoiceStatus)}
                                    className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-emerald-600 hover:shadow-2xl hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:pointer-events-none"
                                >
                                    {dispenseMutation.isPending ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Check className="w-6 h-6" />
                                            Xác nhận Cấp phát thuốc
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        ) : (
                            <div className="bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-slate-100 p-10 h-full flex flex-col items-center justify-center text-center text-slate-300">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                                    <Pill className="w-10 h-10 opacity-20" />
                                </div>
                                <p className="text-sm font-black uppercase tracking-[0.2em] max-w-[200px]">Chọn một đơn thuốc để xem chi tiết</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
