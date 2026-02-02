import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getPublicQueues, registerFromKiosk } from '@/api/public'
import { QrCode, User, Phone, Calendar, ArrowRight, CheckCircle2, Home } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function KioskPage() {
    const { branchId } = useParams()
    const [step, setStep] = useState<'HOME' | 'BOOKING_TYPE' | 'FORM' | 'SUCCESS'>('HOME')
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        dateOfBirth: '',
        queueDefinitionId: '',
    })
    const [registeredEntry, setRegisteredEntry] = useState<any>(null)

    const { data: queues } = useQuery({
        queryKey: ['public-queues', branchId],
        queryFn: () => getPublicQueues(branchId!),
        enabled: !!branchId,
    })

    const registerMutation = useMutation({
        mutationFn: (data: any) => registerFromKiosk({ ...data, branchId }),
        onSuccess: (res) => {
            setRegisteredEntry(res)
            setStep('SUCCESS')
            // Auto return home after 30s
            setTimeout(() => setStep('HOME'), 30000)
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        registerMutation.mutate(formData)
    }

    return (
        <div className="h-screen w-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans select-none overflow-hidden">
            <div className="max-w-4xl w-full bg-white rounded-[40px] shadow-2xl p-12 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

                <AnimatePresence mode="wait">
                    {step === 'HOME' && (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
                            className="text-center space-y-12 py-12"
                        >
                            <div className="space-y-4">
                                <h1 className="text-6xl font-black text-slate-900 tracking-tight">XIN CHÀO!</h1>
                                <p className="text-2xl text-slate-500 font-medium italic">Chào mừng quý khách đến với phòng khám.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-8">
                                <button
                                    onClick={() => setStep('BOOKING_TYPE')}
                                    className="group relative bg-blue-600 hover:bg-blue-700 text-white p-12 rounded-[30px] shadow-xl transition-all hover:-translate-y-2 flex items-center justify-center gap-8"
                                >
                                    <div className="bg-white/20 p-6 rounded-2xl group-hover:scale-110 transition-transform">
                                        <ArrowRight className="h-12 w-12" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-4xl font-black uppercase tracking-wider">Bấm để lấy số</div>
                                        <div className="text-blue-100 text-xl">Dành cho bệnh nhân mới hoặc tái khám</div>
                                    </div>
                                </button>

                                <div className="flex items-center gap-6 p-8 border-2 border-dashed border-slate-200 rounded-[30px] opacity-60">
                                    <QrCode className="h-20 w-20 text-slate-400" />
                                    <div className="text-left">
                                        <div className="text-2xl font-bold text-slate-800 uppercase">Quét mã QR</div>
                                        <div className="text-slate-500 text-lg">Nếu quý khách đã có lịch hẹn trước</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 'BOOKING_TYPE' && (
                        <motion.div
                            key="booking"
                            initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }}
                            className="space-y-8"
                        >
                            <h2 className="text-4xl font-black text-slate-900">Quý khách cần khám gì?</h2>
                            <div className="grid grid-cols-2 gap-6">
                                {queues?.map(q => (
                                    <button
                                        key={q.id}
                                        onClick={() => {
                                            setFormData({ ...formData, queueDefinitionId: q.id! })
                                            setStep('FORM')
                                        }}
                                        className="p-8 border-4 border-slate-100 hover:border-blue-500 rounded-[30px] text-left transition-all hover:bg-blue-50"
                                    >
                                        <div className="text-2xl font-black text-slate-800">{q.nameVi}</div>
                                        <div className="text-slate-500 mt-2 line-clamp-2">{q.description || 'Khám tổng quát, tư vấn sức khỏe...'}</div>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setStep('HOME')}
                                className="btn-secondary text-2xl p-6 rounded-2xl w-full flex items-center justify-center gap-3"
                            >
                                <Home className="h-6 w-6" /> Quay lại
                            </button>
                        </motion.div>
                    )}

                    {step === 'FORM' && (
                        <motion.div
                            key="form"
                            initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }}
                            className="space-y-10"
                        >
                            <h2 className="text-4xl font-black text-slate-900 leading-tight">Vui lòng nhập <br />thông tin cá nhân</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="relative">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="Họ và tên quý khách..."
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full bg-slate-100 border-none rounded-[25px] p-8 pl-20 text-3xl font-bold focus:ring-4 focus:ring-blue-500/20"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400" />
                                        <input
                                            required
                                            type="tel"
                                            placeholder="Số điện thoại liên hệ..."
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-slate-100 border-none rounded-[25px] p-8 pl-20 text-3xl font-bold focus:ring-4 focus:ring-blue-500/20"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400" />
                                        <input
                                            required
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                            className="w-full bg-slate-100 border-none rounded-[25px] p-8 pl-20 text-3xl font-bold focus:ring-4 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setStep('BOOKING_TYPE')} className="flex-[1] btn-secondary text-2xl p-8 rounded-[25px]">Trở lại</button>
                                    <button
                                        type="submit"
                                        disabled={registerMutation.isPending}
                                        className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white text-3xl font-black p-8 rounded-[25px] shadow-lg shadow-blue-500/20 disabled:grayscale transition-all"
                                    >
                                        {registerMutation.isPending ? 'Đang đăng ký...' : 'XÁC NHẬN'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {step === 'SUCCESS' && (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-12 space-y-12"
                        >
                            <div className="flex justify-center">
                                <div className="bg-emerald-100 p-8 rounded-full">
                                    <CheckCircle2 className="h-32 w-32 text-emerald-500" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-slate-900 uppercase">Đăng ký thành công!</h2>
                                <p className="text-2xl text-slate-500 font-medium">Vui lòng ghi nhớ số thứ tự và chờ gọi tên.</p>
                            </div>

                            <div className="bg-slate-50 p-12 rounded-[40px] border-4 border-slate-100 inline-block min-w-[300px]">
                                <div className="text-slate-400 font-bold uppercase tracking-widest text-xl mb-4">Số của quý khách</div>
                                <div className="text-9xl font-black text-blue-600">{registeredEntry?.position || '--'}</div>
                            </div>

                            <div className="pt-8">
                                <button onClick={() => setStep('HOME')} className="btn-secondary text-2xl p-8 rounded-[25px] w-full">Hoàn tất (Xong)</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Helper */}
            <footer className="mt-8 text-slate-400 font-bold flex items-center gap-2 uppercase tracking-widest text-sm">
                PATIENT FLOW KIOSK v1.0 • HỖ TRỢ BỆNH NHÂN 24/7
            </footer>
        </div>
    )
}
