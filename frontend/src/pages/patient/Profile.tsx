import { useQuery } from '@tanstack/react-query'
import { getPortalProfile } from '@/api/portal'
import { useTenant } from '@/context/TenantContext'
import {
    User,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    ShieldCheck,
    Camera,
    Save,
    Calendar,
    Globe
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function PatientProfile() {
    const { headers } = useTenant()

    const { data: profile, isLoading } = useQuery({
        queryKey: ['portal-profile'],
        queryFn: () => getPortalProfile(headers),
        enabled: !!headers?.tenantId
    })

    if (isLoading) return <div className="p-12 text-center text-slate-400 font-bold">Đang tải hồ sơ...</div>

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-12">
            <header>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hồ sơ cá nhân</h1>
                <p className="text-slate-500 font-medium mt-1">Quản lý thông tin cá nhân và cài đặt tài khoản của bạn.</p>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left: Avatar & Quick Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 text-center relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-blue-50 to-transparent" />
                        <div className="relative">
                            <div className="w-32 h-32 mx-auto rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center text-blue-600 text-4xl font-black mb-4 relative group cursor-pointer">
                                {profile?.fullNameVi?.slice(0, 1) || 'P'}
                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">{profile?.fullNameVi}</h2>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Bệnh nhân</p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 space-y-4">
                            <div className="flex items-center gap-3 text-left">
                                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase leading-none">Mã định danh</p>
                                    <p className="text-xs font-bold text-slate-600">#{profile?.id?.slice(0, 8).toUpperCase()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-left">
                                <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase leading-none">Ngày tham gia</p>
                                    <p className="text-xs font-bold text-slate-600">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-sm">
                        Đổi mật khẩu
                    </button>
                </div>

                {/* Right: Detailed Form */}
                <div className="md:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/40"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-slate-900">Thông tin cơ bản</h3>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                                <Save className="w-4 h-4" />
                                Cập nhật
                            </button>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số CCCD/Passport</label>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <CreditCard className="w-5 h-5 text-slate-300" />
                                    <span className="font-bold text-slate-600">{profile?.cccd || 'Cưa cập nhật'}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ngày sinh</label>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <Calendar className="w-5 h-5 text-slate-300" />
                                    <span className="font-bold text-slate-600">{profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <Phone className="w-5 h-5 text-slate-300" />
                                    <span className="font-bold text-slate-600">{profile?.phone || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <Mail className="w-5 h-5 text-slate-300" />
                                    <span className="font-bold text-slate-600">{profile?.email || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Địa chỉ</label>
                                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <MapPin className="w-5 h-5 text-slate-300 mt-0.5" />
                                    <span className="font-bold text-slate-600 leading-tight">
                                        {[profile?.addressLine, profile?.ward, profile?.district, profile?.city].filter(Boolean).join(', ') || 'Chưa cập nhật'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg shadow-slate-200/30">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quốc tịch</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <p className="font-black text-slate-700">{profile?.nationality || 'Việt Nam'}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg shadow-slate-200/30">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Dân tộc</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                                    <User className="w-5 h-5" />
                                </div>
                                <p className="font-black text-slate-700">{profile?.ethnicity || 'Kinh'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
