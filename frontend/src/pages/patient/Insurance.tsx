import { motion } from 'framer-motion'
import { ShieldCheck, QrCode, Calendar, Info, ChevronRight, CreditCard, ExternalLink, Zap } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getPortalProfile } from '@/api/portal'
import { useTenant } from '@/context/TenantContext'

export default function PatientInsurance() {
    const { headers } = useTenant()
    const { data: profile } = useQuery({
        queryKey: ['portal-profile'],
        queryFn: () => getPortalProfile(headers),
        enabled: !!headers?.tenantId
    })

    return (
        <div className="max-w-[1200px] mx-auto space-y-12 pb-20">
            <header className="space-y-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                    <div className="p-3 bg-orange-500 rounded-2xl text-white shadow-xl shadow-orange-200">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    Thẻ Bảo hiểm Y tế
                </h1>
                <p className="text-slate-500 font-medium text-lg ml-16">Quản lý và sử dụng thẻ BHYT điện tử của bạn cho mọi dịch vụ khám chữa bệnh.</p>
            </header>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Virtual Card Section */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        className="relative"
                    >
                        {/* The Premium Insurance Card */}
                        <div className="aspect-[1.586/1] w-full bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-[0_32px_64px_-12px_rgba(59,130,246,0.3)] relative overflow-hidden group">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] -mr-32 -mt-32" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-[40px] -ml-24 -mb-24" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none">
                                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="white" strokeWidth="0.5" />
                                    <path d="M0,60 Q25,10 50,60 T100,60" fill="none" stroke="white" strokeWidth="0.5" />
                                </svg>
                            </div>

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60">Cơ quan Bảo hiểm Xã hội Việt Nam</p>
                                        <h3 className="text-lg font-black tracking-tight italic">VIETNAM SOCIAL SECURITY</h3>
                                    </div>
                                    <div className="w-16 h-16 bg-white flex items-center justify-center rounded-2xl p-2 shadow-inner">
                                        <QrCode className="w-full h-full text-slate-900" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-200/50">Mã số thẻ</p>
                                        <p className="text-3xl font-black tracking-[0.1em] font-mono">GD 4 79 1234567890</p>
                                    </div>
                                    <div className="flex gap-12">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-blue-200/50">Họ và tên</p>
                                            <p className="text-sm font-black uppercase">{profile?.fullNameVi || 'NGUYỄN VĂN A'}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-blue-200/50">Hạn sử dụng</p>
                                            <p className="text-sm font-black uppercase">31/12/2026</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-2xl shadow-xl border border-blue-50 flex items-center gap-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Thẻ đang hoạt động</span>
                        </div>
                    </motion.div>

                    <div className="pt-12 grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-3 p-5 bg-white border border-slate-100 rounded-3xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                            <QrCode className="w-5 h-5" />
                            Hiện QR Code
                        </button>
                        <button className="flex items-center justify-center gap-3 p-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                            <CreditCard className="w-5 h-5" />
                            Thêm thẻ mới
                        </button>
                    </div>
                </div>

                {/* Benefits & Info Section */}
                <div className="space-y-8">
                    <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/20">
                        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                <Info className="w-5 h-5" />
                            </div>
                            Quyền lợi Bảo hiểm
                        </h3>
                        <div className="space-y-4">
                            {[
                                { title: 'Mức hưởng', value: '80%', desc: 'Được hỗ trợ 80% chi phí khám chữa bệnh đúng tuyến.' },
                                { title: 'Nơi ĐKKCBBĐ', value: 'Bệnh viện ĐK Tuy Hòa', desc: 'Sử dụng thẻ tại cơ sở dược chỉ định' },
                                { title: 'Thời điểm 5 năm liên tục', value: '01/01/2028', desc: 'Tận hưởng quyền lợi tối đa sau 5 năm.' }
                            ].map((item, i) => (
                                <div key={i} className="p-5 bg-slate-50/50 rounded-3xl border border-slate-50 hover:border-blue-100 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.title}</p>
                                        <span className="text-sm font-black text-blue-600">{item.value}</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-600 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-200">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Zap className="w-20 h-20" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="space-y-2">
                                <h4 className="text-xl font-black tracking-tight">Thanh toán tự động</h4>
                                <p className="text-emerald-100 text-xs font-bold leading-relaxed">Kết nối BHYT trực tiếp khi đặt lịch khám để hệ thống tự động khấu trừ chi phí.</p>
                            </div>
                            <button className="w-full py-4 bg-white text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                                Kết nối ngay
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            {/* History Section */}
            <section className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 px-2 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-slate-400" />
                    Lịch sử sử dụng BHYT
                </h3>
                <div className="space-y-4">
                    {[1, 2].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <ExternalLink className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">24/01/2026 · Khám Nội tổng quát</p>
                                    <h4 className="font-black text-slate-900 tracking-tight">Kê đơn & Xét nghiệm máu</h4>
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1 mt-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        Đã trừ 1.250.000đ từ BHYT
                                    </p>
                                </div>
                            </div>
                            <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
