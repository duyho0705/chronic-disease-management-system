import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTenant } from '@/context/TenantContext'
import { getInvoice, payInvoice, listInvoices, createInvoice } from '@/api/billing'
import { listMedicalServices } from '@/api/masterData'
import { findPatientByPhone, findPatientByCccd } from '@/api/patients'
import { toastService } from '@/services/toast'
import {
    CreditCard, Receipt, Clock, CheckCircle, Search, ArrowRight, User,
    Plus, X, Trash2, ShoppingCart, Hash, ShieldCheck, Printer
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MedicalServiceDto, PatientDto, CreateInvoiceRequest } from '@/types/api'

export function Billing() {
    const { headers, branchId } = useTenant()
    const queryClient = useQueryClient()
    const [searchId, setSearchId] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('PENDING')
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)

    // Create Invoice Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [patientSearch, setPatientSearch] = useState('')
    const [selectedPatient, setSelectedPatient] = useState<PatientDto | null>(null)
    const [invoiceItems, setInvoiceItems] = useState<{ serviceId: string, name: string, code: string, price: number, qty: number }[]>([])
    const [discount, setDiscount] = useState(0)

    // List Invoices
    const { data: invoices, isLoading: isListLoading } = useQuery({
        queryKey: ['invoices', branchId, statusFilter],
        queryFn: () => listInvoices({ branchId: branchId!, status: statusFilter }, headers),
        enabled: !!branchId && !!headers?.tenantId,
    })

    // Detail Invoice
    const { data: invoiceDetail, isLoading: isDetailLoading } = useQuery({
        queryKey: ['invoice', selectedInvoiceId],
        queryFn: () => getInvoice(selectedInvoiceId!, headers),
        enabled: !!selectedInvoiceId && !!headers?.tenantId,
    })

    // Medical Services for Catalog
    const { data: services } = useQuery({
        queryKey: ['medical-services-active'],
        queryFn: () => listMedicalServices({ onlyActive: true }, headers),
        enabled: isCreateModalOpen && !!headers?.tenantId,
    })

    const pay = useMutation({
        mutationFn: (paymentMethod: string) => payInvoice(selectedInvoiceId!, paymentMethod, headers),
        onSuccess: () => {
            toastService.success('💰 Đã xác nhận thanh toán thành công')
            queryClient.invalidateQueries({ queryKey: ['invoice', selectedInvoiceId] })
            queryClient.invalidateQueries({ queryKey: ['invoices'] })
        },
        onError: (e: Error) => toastService.error(e.message),
    })

    const createInvoiceMutation = useMutation({
        mutationFn: (data: CreateInvoiceRequest) => createInvoice(data, headers),
        onSuccess: (newInv) => {
            toastService.success('📄 Đã khởi tạo hóa đơn thành công')
            setIsCreateModalOpen(false)
            resetCreateForm()
            setSelectedInvoiceId(newInv.id)
            queryClient.invalidateQueries({ queryKey: ['invoices'] })
        },
        onError: (e: Error) => toastService.error(e.message)
    })

    const searchPatient = async () => {
        if (!patientSearch) return
        let p = await findPatientByPhone(patientSearch, headers)
        if (!p) p = await findPatientByCccd(patientSearch, headers)

        if (p) {
            setSelectedPatient(p)
            toastService.success(`👋 Đã tìm thấy: ${p.fullNameVi}`)
        } else {
            toastService.error('Không tìm thấy bệnh nhân với SĐT/CCCD này')
        }
    }

    const resetCreateForm = () => {
        setSelectedPatient(null)
        setPatientSearch('')
        setInvoiceItems([])
        setDiscount(0)
    }

    const addServiceToInvoice = (s: MedicalServiceDto) => {
        const existing = invoiceItems.find(item => item.serviceId === s.id)
        if (existing) {
            setInvoiceItems(invoiceItems.map(item =>
                item.serviceId === s.id ? { ...item, qty: item.qty + 1 } : item
            ))
        } else {
            setInvoiceItems([...invoiceItems, {
                serviceId: s.id,
                name: s.nameVi,
                code: s.code,
                price: s.unitPrice,
                qty: 1
            }])
        }
    }

    const removeService = (id: string) => {
        setInvoiceItems(invoiceItems.filter(i => i.serviceId !== id))
    }

    const totalBeforeDiscount = invoiceItems.reduce((acc, curr) => acc + (curr.price * curr.qty), 0)
    const finalAmount = Math.max(0, totalBeforeDiscount - discount)

    const handleCreateInvoice = () => {
        if (!selectedPatient) return
        const req: CreateInvoiceRequest = {
            patientId: selectedPatient.id,
            branchId: branchId!,
            discountAmount: discount,
            items: invoiceItems.map(i => ({
                itemCode: i.code,
                itemName: i.name,
                quantity: i.qty,
                unitPrice: i.price
            }))
        }
        createInvoiceMutation.mutate(req)
    }

    const filteredInvoices = invoices?.filter(inv =>
        !searchId ||
        inv.invoiceNumber.toLowerCase().includes(searchId.toLowerCase()) ||
        inv.patientName?.toLowerCase().includes(searchId.toLowerCase())
    )

    return (
        <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in duration-700 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-slate-100">
                <div className="space-y-3">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-slate-200">
                            <CreditCard className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tightest leading-none">Thu ngân</h1>
                            <p className="text-slate-500 font-bold ml-1 mt-1 uppercase tracking-widest text-[10px]">Billing & Revenue Management</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#2b8cee] text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 hover:shadow-2xl hover:shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-3 shadow-xl shadow-blue-100"
                >
                    <Plus className="w-5 h-5" />
                    Tạo Hóa đơn mới
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Side: Search & List */}
                <div className="lg:col-span-1 space-y-6">
                    <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                        <div className="space-y-6">
                            <div className="relative group">
                                <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Mã hóa đơn / Tên bệnh nhân..."
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    className="w-full bg-transparent border-none focus:ring-0 text-lg font-bold placeholder:text-slate-200 pl-8"
                                />
                            </div>
                            <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
                                {[
                                    { id: 'PENDING', label: 'Chờ thu' },
                                    { id: 'PAID', label: 'Đã thu' },
                                    { id: '', label: 'Tất cả' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setStatusFilter(tab.id)}
                                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${statusFilter === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        {isListLoading ? (
                            Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 bg-white border border-slate-50 rounded-[3rem] animate-pulse" />)
                        ) : filteredInvoices?.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <Receipt className="w-10 h-10 text-slate-200" />
                                </div>
                                <h4 className="text-xl font-black text-slate-900 mb-2">Trống danh sách</h4>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest max-w-[180px]">Không tìm thấy hóa đơn nào phù hợp bộ lọc.</p>
                            </div>
                        ) : filteredInvoices?.map((inv) => (
                            <motion.button
                                layout
                                key={inv.id}
                                onClick={() => setSelectedInvoiceId(inv.id)}
                                className={`w-full text-left p-8 rounded-[3.5rem] border transition-all relative overflow-hidden group ${selectedInvoiceId === inv.id ? 'bg-slate-900 text-white border-slate-900 shadow-2xl shadow-slate-900/40' : 'bg-white text-slate-900 border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Hash className={`w-3 h-3 ${selectedInvoiceId === inv.id ? 'text-blue-400' : 'text-slate-300'}`} />
                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] opacity-60 ${selectedInvoiceId === inv.id ? 'text-blue-200' : 'text-slate-400'}`}>{inv.invoiceNumber}</span>
                                        </div>
                                        <h4 className="font-black text-2xl tracking-tightest leading-none uppercase group-hover:text-blue-500 transition-colors">{inv.patientName}</h4>
                                    </div>
                                    <StatusBadge status={inv.status} />
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-3 py-1.5 rounded-full ${selectedInvoiceId === inv.id ? 'bg-white/10 text-white/50' : 'bg-slate-50 text-slate-400'}`}>
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(inv.createdAt).toLocaleDateString('vi-VN')}
                                    </div>
                                    <div className="text-2xl font-black">{inv.finalAmount.toLocaleString('vi-VN')} <span className="text-sm opacity-50">đ</span></div>
                                </div>
                            </motion.button>
                        ))}
                    </section>
                </div>

                {/* Right Side: Detail */}
                <div className="lg:col-span-2">
                    {invoiceDetail ? (
                        isDetailLoading ? (
                            <div className="card h-[600px] animate-pulse bg-slate-50/20" />
                        ) : (
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden flex flex-col h-full sticky top-8">
                                <div className="p-10 border-b border-slate-50 bg-slate-50/10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-slate-200">
                                                <User className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{invoiceDetail.patientName}</h3>
                                                <div className="flex items-center gap-3">
                                                    <StatusBadge status={invoiceDetail.status} size="lg" />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50">#{invoiceDetail.invoiceNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ngày lập phiếu</p>
                                            <p className="font-black text-slate-900">{new Date(invoiceDetail.createdAt).toLocaleString('vi-VN')}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex justify-between items-center shadow-2xl shadow-slate-900/20">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tổng số tiền cần thu</p>
                                            <div className="text-5xl font-black">{invoiceDetail.finalAmount.toLocaleString('vi-VN')} <span className="text-2xl text-slate-500">đ</span></div>
                                        </div>
                                        {invoiceDetail.status === 'PAID' && (
                                            <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center animate-in zoom-in-50">
                                                <ShieldCheck className="w-10 h-10" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-10 flex-1 space-y-10 overflow-y-auto no-scrollbar">
                                    <section>
                                        <h4 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px] mb-8 flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            Danh mục dịch vụ & Thuốc ({invoiceDetail.items.length})
                                        </h4>
                                        <div className="space-y-4">
                                            {invoiceDetail.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-50 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 hover:border-blue-100 transition-all duration-500">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-[11px] font-black group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
                                                            {idx + 1}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 text-sm tracking-tight leading-none mb-1.5 group-hover:text-blue-600 transition-colors uppercase">{item.itemName}</p>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-white px-2 py-0.5 rounded-lg border border-slate-100">SL: {item.quantity}</span>
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Đơn giá: {item.unitPrice.toLocaleString('vi-VN')}đ</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-xl font-black text-slate-900">
                                                        {item.lineTotal.toLocaleString('vi-VN')} <span className="text-xs text-slate-400">đ</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {invoiceDetail.status === 'PENDING' ? (
                                        <div className="space-y-8 pt-10 border-t border-slate-100">
                                            <h4 className="font-black text-slate-900 uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                                                <CreditCard className="w-5 h-5 text-blue-600" />
                                                Chọn phương thức thanh toán
                                            </h4>
                                            <div className="grid grid-cols-3 gap-6">
                                                {[
                                                    { id: 'CASH', label: 'Tiền mặt', icon: CreditCard },
                                                    { id: 'BANK_TRANSFER', label: 'Chuyển khoản', icon: ArrowRight, rotate: -45 },
                                                    { id: 'E_WALLET', label: 'Ví điện tử', icon: CheckCircle }
                                                ].map(m => (
                                                    <button
                                                        key={m.id}
                                                        onClick={() => pay.mutate(m.id)}
                                                        disabled={pay.isPending}
                                                        className="flex flex-col items-center gap-6 p-10 rounded-[3rem] border-2 border-slate-50 hover:border-blue-600 hover:bg-blue-50/40 transition-all group active:scale-95 relative overflow-hidden"
                                                    >
                                                        <div className="w-20 h-20 rounded-[1.5rem] bg-white flex items-center justify-center group-hover:bg-blue-600 transition-all shadow-sm group-hover:shadow-blue-200/50 group-hover:shadow-2xl">
                                                            <m.icon className={`w-10 h-10 text-slate-400 group-hover:text-white transition-all ${m.rotate === -45 ? '-rotate-45' : ''}`} />
                                                        </div>
                                                        <span className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em]">{m.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-emerald-50 border-2 border-emerald-100 rounded-[3.5rem] p-10 flex items-center justify-between mt-10 shadow-xl shadow-emerald-200/20 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                                                <ShieldCheck className="w-32 h-32" />
                                            </div>
                                            <div className="flex items-center gap-8 relative z-10">
                                                <div className="w-20 h-20 rounded-[2rem] bg-white border border-emerald-100 flex items-center justify-center shadow-xl shadow-emerald-200/20">
                                                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-emerald-900 uppercase tracking-[0.2em] text-sm mb-2">Thanh toán thành công</p>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-black text-emerald-600 bg-white px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
                                                            {invoiceDetail.paymentMethod === 'CASH' && 'Tiền mặt'}
                                                            {invoiceDetail.paymentMethod === 'BANK_TRANSFER' && 'Chuyển khoản'}
                                                            {invoiceDetail.paymentMethod === 'E_WALLET' && 'Ví điện tử'}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-emerald-700/50 uppercase tracking-widest">
                                                            {invoiceDetail.paidAt && new Date(invoiceDetail.paidAt).toLocaleTimeString('vi-VN')} · {invoiceDetail.paidAt && new Date(invoiceDetail.paidAt).toLocaleDateString('vi-VN')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => window.print()}
                                                className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all flex items-center gap-3 shadow-xl relative z-10"
                                            >
                                                <Printer className="w-5 h-5" />
                                                In biên lai
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="bg-white h-full min-h-[600px] flex flex-col items-center justify-center py-24 text-center space-y-6 rounded-[3rem] border border-slate-100">
                            <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
                                <Receipt className="w-12 h-12 text-slate-200" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Vui lòng chọn Hóa đơn</h3>
                                <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2">Chọn một hồ sơ từ danh sách bên trái để tiến hành kiểm tra chi tiết và thanh toán.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Invoice Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl" onClick={() => setIsCreateModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[#f8fafc] rounded-[4rem] w-full max-w-6xl shadow-2xl overflow-hidden flex h-[85vh]">
                            {/* Modal Left: Selection */}
                            <div className="w-2/3 flex flex-col bg-white">
                                <div className="p-10 border-b border-slate-50">
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Khởi tạo Hóa đơn mới</h2>

                                    {/* Patient Search */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Bước 1: Tìm kiếm bệnh nhân</label>
                                        <div className="flex gap-4">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                                <input
                                                    placeholder="Gõ Số điện thoại hoặc CCCD..."
                                                    value={patientSearch}
                                                    onChange={e => setPatientSearch(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && searchPatient()}
                                                    className="w-full bg-slate-50 border border-slate-100 pl-14 pr-6 py-5 rounded-[1.5rem] font-black text-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                                />
                                            </div>
                                            <button onClick={searchPatient} className="bg-slate-900 text-white px-8 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-[#2b8cee] transition-colors">Tìm bệnh nhân</button>
                                        </div>
                                        {selectedPatient && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-50 border border-blue-100 p-6 rounded-[1.5rem] flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                                                        <User className="w-7 h-7" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-blue-900 text-lg">{selectedPatient.fullNameVi}</p>
                                                        <p className="text-xs font-black text-blue-600/60 uppercase tracking-widest">SĐT: {selectedPatient.phone} · NS: {new Date(selectedPatient.dateOfBirth).toLocaleDateString('vi-VN')}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setSelectedPatient(null)} className="text-blue-400 hover:text-red-500 transition-colors">
                                                    <X className="w-6 h-6" />
                                                </button>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* Service Catalog Selection */}
                                <div className="p-10 flex-1 flex flex-col min-h-0">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-6">Bước 2: Chọn dịch vụ từ danh mục</label>
                                    <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-4 scrollbar-hide">
                                        {services?.map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => addServiceToInvoice(s)}
                                                className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] text-left hover:border-blue-500 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 transition-all flex flex-col justify-between group h-40"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">#{s.code}</span>
                                                    </div>
                                                    <p className="font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{s.nameVi}</p>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <span className="text-lg font-black text-slate-900">{s.unitPrice.toLocaleString('vi-VN')} đ</span>
                                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                                                        <Plus className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Right: Checkout Preview */}
                            <div className="w-1/3 bg-slate-50 border-l border-slate-100 p-10 flex flex-col">
                                <div className="flex items-center gap-3 mb-10">
                                    <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                                        <ShoppingCart className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Giỏ hàng chờ</h3>
                                </div>

                                <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-hide">
                                    {invoiceItems.length === 0 ? (
                                        <div className="text-center py-20">
                                            <ShoppingCart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                            <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Chưa có dịch vụ nào</p>
                                        </div>
                                    ) : (
                                        invoiceItems.map((item) => (
                                            <motion.div layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={item.serviceId} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-white">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="font-black text-slate-900 text-sm leading-tight pr-4">{item.name}</p>
                                                    <button onClick={() => removeService(item.serviceId)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1">
                                                        <button
                                                            onClick={() => setInvoiceItems(invoiceItems.map(i => i.serviceId === item.serviceId ? { ...i, qty: Math.max(1, i.qty - 1) } : i))}
                                                            className="w-6 h-6 flex items-center justify-center font-bold text-slate-400 hover:text-slate-900 transition-colors"
                                                        >-</button>
                                                        <span className="text-xs font-black w-6 text-center">{item.qty}</span>
                                                        <button
                                                            onClick={() => setInvoiceItems(invoiceItems.map(i => i.serviceId === item.serviceId ? { ...i, qty: i.qty + 1 } : i))}
                                                            className="w-6 h-6 flex items-center justify-center font-bold text-slate-400 hover:text-slate-900 transition-colors"
                                                        >+</button>
                                                    </div>
                                                    <p className="font-black text-slate-900 text-sm">{(item.price * item.qty).toLocaleString('vi-VN')} đ</p>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>

                                <div className="pt-8 space-y-4 border-t border-slate-200 mt-6">
                                    <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                        <span>Tạm tính</span>
                                        <span>{totalBeforeDiscount.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                        <span>Giảm giá</span>
                                        <div className="relative w-32">
                                            <input
                                                type="number"
                                                value={discount || ''}
                                                onChange={e => setDiscount(Number(e.target.value))}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-right font-black text-slate-900 outline-none"
                                            />
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-slate-300">VNĐ</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                                        <span className="text-lg font-black text-slate-900 uppercase tracking-widest">Thanh toán</span>
                                        <span className="text-3xl font-black text-blue-600 leading-none">{finalAmount.toLocaleString('vi-VN')} đ</span>
                                    </div>

                                    <button
                                        disabled={!selectedPatient || invoiceItems.length === 0 || createInvoiceMutation.isPending}
                                        onClick={handleCreateInvoice}
                                        className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-[#2b8cee] transition-all disabled:opacity-30 disabled:grayscale mt-4 active:scale-95 shadow-2xl shadow-slate-900/20"
                                    >
                                        {createInvoiceMutation.isPending ? 'Đang khởi tạo...' : 'Xác nhận & Xuất phiếu'}
                                    </button>
                                    <button onClick={() => setIsCreateModalOpen(false)} className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                                        Hủy thao tác
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function StatusBadge({ status, size = 'sm' }: { status: string; size?: 'sm' | 'lg' }) {
    const isPaid = status === 'PAID'
    return (
        <span className={`inline-flex items-center gap-1.5 font-black uppercase tracking-widest rounded-full ring-1 ring-inset ${isPaid
            ? 'bg-emerald-100 text-emerald-700 ring-emerald-200'
            : 'bg-amber-100 text-amber-700 ring-amber-200'
            } ${size === 'lg' ? 'px-4 py-2 text-[10px]' : 'px-2 py-0.5 text-[8px]'}`}>
            {isPaid ? <CheckCircle className={size === 'lg' ? 'w-4 h-4' : 'w-2.5 h-2.5'} /> : <Clock className={size === 'lg' ? 'w-4 h-4' : 'w-2.5 h-2.5'} />}
            {isPaid ? 'Đã thu tiền' : 'Chờ thu phí'}
        </span>
    )
}
