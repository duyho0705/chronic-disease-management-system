import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getPublicQueues, registerFromKiosk } from '@/api/public'
import {
    QrCode,
    User,
    Phone,
    Calendar,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Printer,
    ChevronLeft
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function KioskPage() {
    const { branchId } = useParams()
    const [step, setStep] = useState<'HOME' | 'BOOKING_TYPE' | 'FORM' | 'SUCCESS'>('HOME')
    const [lang, setLang] = useState<'VN' | 'EN'>('VN')
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        dateOfBirth: '',
        queueDefinitionId: '',
    })
    const [registeredEntry, setRegisteredEntry] = useState<any>(null)
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

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

    const t = {
        VN: {
            welcome: 'XIN CHÀO!',
            subtitle: 'Chào mừng quý khách đến với Hệ thống Y tế Thông minh',
            getTicket: 'Bấm để lấy số',
            getTicketSub: 'Dành cho bệnh nhân mới hoặc tái khám',
            scanQr: 'Quét mã QR',
            scanQrSub: 'Nếu quý khách đã có lịch hẹn trước',
            choosetype: 'Quý khách cần khám gì?',
            back: 'Quay lại',
            formTitle: 'Thông tin cá nhân',
            name: 'Họ và tên quý khách...',
            phone: 'Số điện thoại liên hệ...',
            dob: 'Ngày tháng năm sinh...',
            confirm: 'XÁC NHẬN',
            success: 'Đăng ký thành công!',
            successSub: 'Vui lòng nhận phiếu và chờ gọi tên tại sảnh.',
            yourNumber: 'Số thứ tự của quý khách',
            done: 'Hoàn tất',
            printing: 'Đang in phiếu...',
        },
        EN: {
            welcome: 'WELCOME!',
            subtitle: 'Welcome to our Smart Healthcare System',
            getTicket: 'Get a Ticket',
            getTicketSub: 'For new or returning patients',
            scanQr: 'Scan QR Code',
            scanQrSub: 'If you already have an appointment',
            choosetype: 'What is your clinical need?',
            back: 'Back',
            formTitle: 'Personal Information',
            name: 'Your Full Name...',
            phone: 'Contact Phone Number...',
            dob: 'Date of Birth...',
            confirm: 'CONFIRM',
            success: 'Registered Successfully!',
            successSub: 'Please take your ticket and wait for your turn.',
            yourNumber: 'Your Queue Number',
            done: 'Done',
            printing: 'Printing ticket...',
        }
    }

    const currentT = t[lang]

    return (
        <div className="h-screen w-screen bg-[#0f172a] text-slate-900 flex flex-col items-center justify-center font-sans select-none overflow-hidden relative">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [0, -50, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/20 blur-[120px] rounded-full"
                />
            </div>

            {/* Top Bar: Time & Language */}
            <div className="absolute top-10 left-10 right-10 flex justify-between items-center z-50">
                <div className="flex items-center gap-6">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-3xl text-white">
                        <div className="text-3xl font-black tracking-tighter tabular-nums">
                            {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">
                            {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setLang('VN')}
                        className={`px - 8 py - 4 rounded - 3xl font - black text - sm tracking - widest transition - all ${lang === 'VN' ? 'bg-white text-slate-900 shadow-2xl scale-110' : 'bg-white/10 text-white border border-white/20'} `}
                    >
                        TIẾNG VIỆT
                    </button>
                    <button
                        onClick={() => setLang('EN')}
                        className={`px - 8 py - 4 rounded - 3xl font - black text - sm tracking - widest transition - all ${lang === 'EN' ? 'bg-white text-slate-900 shadow-2xl scale-110' : 'bg-white/10 text-white border border-white/20'} `}
                    >
                        ENGLISH
                    </button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="max-w-6xl w-full mx-6 relative z-10">
                <AnimatePresence mode="wait">
                    {step === 'HOME' && (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
                            className="text-center space-y-20 py-20"
                        >
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-500/40 mb-10"
                                >
                                    <Sparkles className="w-12 h-12" />
                                </motion.div>
                                <h1 className="text-8xl font-black text-white tracking-tightest leading-none">
                                    {currentT.welcome}
                                </h1>
                                <p className="text-3xl text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed">
                                    {currentT.subtitle}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-10">
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -10 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setStep('BOOKING_TYPE')}
                                    className="group relative bg-white p-12 rounded-[4rem] shadow-3xl flex items-center gap-10 text-left overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-12 bg-blue-50/50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-600 transition-colors duration-500" />
                                    <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform">
                                        <ArrowRight className="h-12 w-12" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-5xl font-black text-slate-900 uppercase tracking-tightest mb-2 group-hover:text-blue-600 transition-colors">
                                            {currentT.getTicket}
                                        </div>
                                        <div className="text-slate-500 text-xl font-bold uppercase tracking-widest text-[11px] opacity-60">
                                            {currentT.getTicketSub}
                                        </div>
                                    </div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02, y: -10 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative bg-slate-800/50 backdrop-blur-2xl border border-white/10 p-12 rounded-[4rem] shadow-2xl flex items-center gap-10 text-left"
                                >
                                    <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center text-white/50 group-hover:text-white transition-all">
                                        <QrCode className="h-12 w-12" />
                                    </div>
                                    <div>
                                        <div className="text-5xl font-black text-white uppercase tracking-tightest mb-2">
                                            {currentT.scanQr}
                                        </div>
                                        <div className="text-white/40 text-xl font-bold uppercase tracking-widest text-[11px]">
                                            {currentT.scanQrSub}
                                        </div>
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'BOOKING_TYPE' && (
                        <motion.div
                            key="booking"
                            initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }}
                            className="bg-white rounded-[5rem] p-20 shadow-4xl space-y-12"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-12">
                                <h2 className="text-6xl font-black text-slate-900 tracking-tightest uppercase">{currentT.choosetype}</h2>
                                <button
                                    onClick={() => setStep('HOME')}
                                    className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-inner"
                                >
                                    <ChevronLeft className="h-10 w-10" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                {queues?.map((q, idx) => (
                                    <motion.button
                                        key={q.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => {
                                            setFormData({ ...formData, queueDefinitionId: q.id! })
                                            setStep('FORM')
                                        }}
                                        className="group p-10 bg-slate-50 hover:bg-white border-2 border-transparent hover:border-blue-600 rounded-[3rem] text-left transition-all hover:shadow-2xl hover:shadow-blue-500/10 flex items-center justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{q.nameVi}</div>
                                            <div className="text-slate-400 font-bold uppercase tracking-widest text-[11px] leading-relaxed max-w-[280px]">
                                                {q.description || 'Clinical consultation and healthcare advice.'}
                                            </div>
                                        </div>
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                            <ArrowRight className="w-8 h-8" />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 'FORM' && (
                        <motion.div
                            key="form"
                            initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }}
                            className="bg-white rounded-[5rem] p-20 shadow-4xl space-y-16"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-12">
                                <h2 className="text-6xl font-black text-slate-900 tracking-tightest uppercase">{currentT.formTitle}</h2>
                                <button
                                    onClick={() => setStep('BOOKING_TYPE')}
                                    className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-inner"
                                >
                                    <ChevronLeft className="h-10 w-10" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 gap-8">
                                    <div className="relative">
                                        <User className="absolute left-10 top-1/2 -translate-y-1/2 h-10 w-10 text-slate-300" />
                                        <input
                                            required autoFocus
                                            type="text"
                                            placeholder={currentT.name}
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full bg-slate-50 border-none rounded-[3rem] p-12 pl-24 text-4xl font-black placeholder:text-slate-200 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="relative">
                                            <Phone className="absolute left-10 top-1/2 -translate-y-1/2 h-10 w-10 text-slate-300" />
                                            <input
                                                required
                                                type="tel"
                                                placeholder={currentT.phone}
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-slate-50 border-none rounded-[3rem] p-12 pl-24 text-4xl font-black placeholder:text-slate-200 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Calendar className="absolute left-10 top-1/2 -translate-y-1/2 h-10 w-10 text-slate-300" />
                                            <input
                                                required
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                                className="w-full bg-slate-50 border-none rounded-[3rem] p-12 pl-24 text-4xl font-black placeholder:text-slate-200 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={registerMutation.isPending}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-12 rounded-[3.5rem] font-black text-4xl uppercase tracking-[0.2em] shadow-3xl shadow-blue-500/40 active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-50"
                                >
                                    {registerMutation.isPending ? currentT.printing : currentT.confirm}
                                    <ArrowRight className="w-12 h-12" />
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === 'SUCCESS' && (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-[5rem] p-24 shadow-4xl text-center space-y-16 relative overflow-hidden"
                        >
                            {/* Confetti-like decor */}
                            <div className="absolute top-0 inset-x-0 flex justify-center">
                                <motion.div
                                    initial={{ y: -100 }} animate={{ y: 0 }}
                                    className="w-32 h-2 bg-emerald-500 rounded-b-full shadow-lg"
                                />
                            </div>

                            <div className="space-y-8">
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="w-40 h-40 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mx-auto shadow-inner"
                                >
                                    <CheckCircle2 className="h-24 w-24" />
                                </motion.div>
                                <div>
                                    <h2 className="text-7xl font-black text-slate-900 uppercase tracking-tightest">{currentT.success}</h2>
                                    <p className="text-3xl text-slate-400 font-bold mt-4">{currentT.successSub}</p>
                                </div>
                            </div>

                            <div className="relative group inline-block">
                                <div className="absolute inset-0 bg-blue-600 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative bg-slate-900 px-32 py-20 rounded-[4rem] text-white shadow-3xl border-4 border-slate-800">
                                    <div className="text-slate-500 font-black uppercase tracking-[0.3em] text-xl mb-6">{currentT.yourNumber}</div>
                                    <div className="text-[14rem] font-black leading-none tracking-tighter tabular-nums mb-4 drop-shadow-2xl">
                                        {registeredEntry?.position || '--'}
                                    </div>
                                    <div className="text-blue-500 font-black text-2xl uppercase tracking-widest bg-blue-500/10 px-6 py-2 rounded-2xl inline-block">
                                        {formData.fullName}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-6">
                                <div className="flex items-center gap-4 text-emerald-500 bg-emerald-50 px-10 py-5 rounded-full border border-emerald-100 animate-pulse">
                                    <Printer className="w-10 h-10" />
                                    <span className="text-2xl font-black uppercase tracking-widest">{currentT.printing}</span>
                                </div>
                                <button
                                    onClick={() => setStep('HOME')}
                                    className="mt-10 px-20 py-8 bg-slate-100 hover:bg-slate-950 hover:text-white rounded-[2.5rem] font-black text-3xl uppercase tracking-[0.2em] transition-all active:scale-95"
                                >
                                    {currentT.done}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Status Branding */}
            <div className="absolute bottom-10 inset-x-0 px-20 flex justify-between items-end pointer-events-none">
                <div className="space-y-1">
                    <p className="text-white/20 font-black text-6xl tracking-tighter uppercase leading-none">Smart</p>
                    <p className="text-white/10 font-black text-6xl tracking-tighter uppercase leading-none">Healthcare</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-10 py-5 rounded-[2.5rem] border border-white/10 flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">System Online</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
