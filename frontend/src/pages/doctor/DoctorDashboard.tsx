import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTenant } from '@/context/TenantContext'
import { useQuery } from '@tanstack/react-query'
import {
    User,
    Mail,
    CalendarDays,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    MoreVertical,
    TrendingUp,
    FileText,
    Send,
    Loader2,
    ChevronDown,
    X,
    Search,
    Pill,
    PlusCircle,
    Trash2,
    StickyNote,
    Clock
} from 'lucide-react'

import {
    AreaChart,
    Area,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts'

import { getDoctorDashboard, getDoctorPatients } from '@/api/doctor'

export function DoctorDashboard() {
    const { headers, tenantId } = useTenant()
    const navigate = useNavigate()
    const [timeRange, setTimeRange] = useState('7 ngày qua')
    const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false)
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false)
    const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false)
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)

    // ─── Dummy Data for Chart ───
    const communityHealthData = [
        { name: 'Th2', 'Chỉ số': 45 },
        { name: 'Th3', 'Chỉ số': 52 },
        { name: 'Th4', 'Chỉ số': 48 },
        { name: 'Th5', 'Chỉ số': 70 },
        { name: 'Th6', 'Chỉ số': 65 },
        { name: 'Th7', 'Chỉ số': 80 },
        { name: 'CN', 'Chỉ số': 75 },
    ]


    // ─── Fetch Real Data ───
    const { data: dashboard, isLoading: loadingDash } = useQuery({
        queryKey: ['doctor-dashboard', tenantId],
        queryFn: () => getDoctorDashboard(headers),
        enabled: !!tenantId
    })

    const { data: patientList, isLoading: loadingPatients } = useQuery({
        queryKey: ['doctor-patients', tenantId],
        queryFn: () => getDoctorPatients(headers, 0, 5),
        enabled: !!tenantId
    })

    if (loadingDash || loadingPatients) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                <p className="font-bold text-sm uppercase tracking-widest">Đang tải dữ liệu thực tế...</p>
            </div>
        )
    }

    // ─── Map Real Data to UI ───
    const stats = [
        {
            label: 'Tổng bệnh nhân',
            value: dashboard?.totalPatientsToday.toLocaleString() || '1,250',
            trend: '+2.4%',
            trendIcon: TrendingUp,
            icon: User,
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        {
            label: 'Nguy cơ cao',
            value: dashboard?.riskPatients.length.toString() || '12',
            trend: 'Cảnh báo',
            isWarning: true,
            icon: AlertTriangle,
            color: 'text-red-500',
            bg: 'bg-red-100 dark:bg-red-900/30'
        },
        {
            label: 'Lịch hẹn chờ',
            value: dashboard?.pendingConsultations.toString() || '08',
            icon: CalendarDays,
            color: 'text-blue-500',
            bg: 'bg-blue-100 dark:bg-blue-900/30'
        },
        {
            label: 'Tin nhắn mới',
            value: '05',
            icon: Mail,
            color: 'text-amber-500',
            bg: 'bg-amber-100 dark:bg-amber-900/30'
        }
    ]

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700 font-display min-h-screen bg-slate-50/50 -m-8 p-8">
            {/* ─── Summary Cards ─── */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            {stat.trend && (
                                <span className={`text-xs font-bold ${stat.isWarning ? 'bg-red-500 text-white' : 'text-green-500'} flex items-center gap-1 ${stat.isWarning ? 'px-2 py-1 rounded-full' : ''}`}>
                                    {stat.trend} {stat.trendIcon && <stat.trendIcon className="w-3 h-3" />}
                                </span>
                            )}
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
                        <p className={`text-3xl font-extrabold mt-1 ${stat.isWarning ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{stat.value}</p>
                    </motion.div>
                ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ─── High Risk Patients Section (Left 2 cols) ─── */}
                <section className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-extrabold flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500 fill-red-500/20" />
                            Phân tích nguy cơ cao
                        </h2>
                        <button className="text-primary text-sm font-bold hover:underline">Xem tất cả</button>
                    </div>

                    <div className="space-y-4">
                        {dashboard?.riskPatients && dashboard.riskPatients.length > 0 ? (
                            dashboard.riskPatients.slice(0, 3).map((risk: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                    className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border-l-4 ${risk.riskLevel === 'CRITICAL' ? 'border-l-red-500' : 'border-l-amber-500'
                                        } border-y border-r border-primary/5 flex items-center justify-between shadow-sm group hover:border-primary transition-all cursor-pointer`}
                                    onClick={() => navigate(`/patients/${risk.patientId}/ehr`)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
                                            {risk.patientAvatar ? (
                                                <img src={risk.patientAvatar} alt={risk.patientName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-black text-slate-400 bg-slate-100 dark:bg-slate-800">
                                                    {risk.patientName?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg group-hover:text-primary transition-colors">{risk.patientName}</p>
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <span>65 tuổi</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span className="truncate max-w-[150px]">{risk.reason}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center px-6 hidden sm:block">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái</p>
                                        <p className={`font-extrabold text-lg ${risk.riskLevel === 'CRITICAL' ? 'text-red-500' : 'text-amber-500'}`}>{risk.riskLevel}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Hệ thống AI đề xuất</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full text-center ${risk.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                            {risk.riskLevel === 'CRITICAL' ? 'Nguy cấp' : 'Cần theo dõi'}
                                        </span>
                                        <button className="bg-primary text-slate-900 text-xs font-bold py-2 px-4 rounded-xl hover:bg-primary/90 transition-all shadow-sm active:scale-95">Chi tiết</button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-dashed border-primary/20 text-center">
                                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500 opacity-20" />
                                <p className="text-sm font-bold text-slate-500">Không có cảnh báo nguy cơ</p>
                            </div>
                        )}
                    </div>

                    {/* ─── Health Trend Chart Preview ─── */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Xu hướng sức khỏe cộng đồng</h3>
                                <p className="text-xs text-slate-500">Thống kê dữ liệu lâm sàng theo tuần</p>
                            </div>

                            {/* Custom Premium Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm"
                                >
                                    <span>{timeRange}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isTimeDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isTimeDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5"
                                        >
                                            {['7 ngày qua', '30 ngày qua', '90 ngày qua'].map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => {
                                                        setTimeRange(option)
                                                        setIsTimeDropdownOpen(false)
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${timeRange === option
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="h-56 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={communityHealthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="doctorCommunityGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4ade80" strokeOpacity={0.05} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                                        dy={10}
                                    />
                                    <YAxis hide domain={['auto', 'auto']} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#0f172a',
                                            border: 'none',
                                            borderRadius: '16px',
                                            padding: '12px',
                                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
                                        }}
                                        itemStyle={{ color: '#4ade80', fontSize: '11px', fontWeight: 'bold' }}
                                        labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '4px', fontWeight: 'bold' }}
                                        cursor={{ stroke: '#4ade80', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="Chỉ số"
                                        stroke="#4ade80"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#doctorCommunityGrad)"
                                        animationDuration={2000}
                                        dot={{ fill: '#4ade80', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#4ade80' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>

                {/* ─── Sidebar Area (1 col) ─── */}
                <aside className="space-y-8">
                    {/* Quick Actions */}
                    <section>
                        <h2 className="text-xl font-extrabold mb-4">Thao tác nhanh</h2>
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => setIsPrescriptionModalOpen(true)}
                                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-2xl border border-primary/10 shadow-sm text-left group active:scale-95"
                            >
                                <div className="w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center transition-colors">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-sm">Kê đơn thuốc mới</span>
                            </button>
                            <button
                                onClick={() => setIsAdviceModalOpen(true)}
                                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-2xl border border-primary/10 shadow-sm text-left group active:scale-95"
                            >
                                <div className="w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center transition-colors">
                                    <Send className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-sm">Gửi lời khuyên</span>
                            </button>
                            <button
                                onClick={() => setIsAppointmentModalOpen(true)}
                                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-2xl border border-primary/10 shadow-sm text-left group active:scale-95"
                            >
                                <div className="w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center transition-colors">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-sm">Đặt lịch tái khám</span>
                            </button>
                        </div>
                    </section>

                    {/* Recent Appointments */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-extrabold">Lịch hẹn khám sắp tới</h2>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 shadow-sm divide-y divide-primary/5 overflow-hidden">
                            {dashboard?.upcomingAppointments && dashboard.upcomingAppointments.length > 0 ? (
                                dashboard.upcomingAppointments.slice(0, 3).map((apt: any, i: number) => (
                                    <div key={i} className="p-4 flex items-center gap-4 hover:bg-primary/5 transition-colors cursor-pointer" onClick={() => navigate('/scheduling')}>
                                        <div className="flex-shrink-0 text-center">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Hôm nay</p>
                                            <p className="text-lg font-extrabold text-primary leading-none">{apt.startTime?.slice(0, 5)}</p>
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-bold truncate text-sm text-slate-900 dark:text-white uppercase">{apt.patientName}</p>
                                            <p className="text-xs text-slate-500 truncate">{apt.appointmentType || 'Khám định kỳ'}</p>
                                        </div>
                                        <MoreVertical className="w-4 h-4 text-slate-300" />
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-400 text-xs italic">Không có lịch hẹn hôm nay</div>
                            )}
                        </div>
                        <button
                            onClick={() => navigate('/scheduling')}
                            className="w-full mt-4 py-3 border border-dashed border-primary/30 text-primary font-bold text-sm rounded-xl hover:bg-primary/5 transition-colors active:scale-[0.98]"
                        >
                            Xem toàn bộ lịch trình
                        </button>
                    </section>
                </aside>
            </div>

            {/* ─── Patient Management Table ─── */}
            <section className="mt-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Quản lý bệnh nhân gần đây</h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Hồ sơ bệnh nhân mới được cập nhật chỉ số sức khỏe</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all">Lọc theo khoa</button>
                        <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all">Xuất báo cáo</button>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-primary/5 border-b border-primary/5">
                                <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Bệnh nhân</th>
                                    <th className="px-6 py-4">Chỉ số gần nhất</th>
                                    <th className="px-6 py-4">Tình trạng</th>
                                    <th className="px-6 py-4">Cập nhật lần cuối</th>
                                    <th className="px-6 py-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {patientList?.content.map((patient: any, i: number) => (
                                    <tr key={i} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs border border-emerald-100 group-hover:scale-110 transition-transform">
                                                    {patient.fullNameVi?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{patient.fullNameVi}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">ID: #SK-{patient.externalId || patient.id.slice(0, 4)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-4">
                                                <div className="text-xs">
                                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">Đường huyết</p>
                                                    <p className="font-extrabold text-slate-700 dark:text-slate-300">7.2 <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter ml-1">mmol/L</span></p>
                                                </div>
                                                <div className="text-xs">
                                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">Huyết áp</p>
                                                    <p className="font-extrabold text-slate-700 dark:text-slate-300">120/80 <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter ml-1">mmHg</span></p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${patient.isActive ? 'bg-green-100 text-green-600 border border-green-200' : 'bg-slate-100 text-slate-400'}`}>
                                                {patient.isActive ? 'Ổn định' : 'Ngưng theo dõi'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                                            {patient.updatedAt ? new Date(patient.updatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '10 phút trước'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => navigate(`/patients/${patient.id}/ehr`)}
                                                className="p-2.5 text-slate-400 hover:text-primary transition-all rounded-xl hover:bg-white shadow-none hover:shadow-sm"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ─── New Prescription Modal ─── */}
            <AnimatePresence>
                {isPrescriptionModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsPrescriptionModalOpen(false)}
                            className="absolute inset-0 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col no-scrollbar"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <FileText className="w-6 h-6 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight">Kê đơn thuốc mới</h2>
                                </div>
                                <button
                                    onClick={() => setIsPrescriptionModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-8">
                                {/* Patient & Diagnosis Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bệnh nhân</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <select className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none text-sm font-medium">
                                                <option>Nguyễn Văn A</option>
                                                <option>Trần Thị B</option>
                                                <option>Lê Văn C</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chẩn đoán hiện tại</label>
                                        <input
                                            type="text"
                                            defaultValue="Viêm họng cấp / Theo dõi đái tháo đường"
                                            placeholder="Nhập chẩn đoán..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Medication Dynamic List */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                            <Pill className="w-5 h-5 text-primary" />
                                            Danh sách thuốc
                                        </h3>
                                        <button className="flex items-center gap-1.5 text-sm font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
                                            <PlusCircle className="w-4 h-4" />
                                            Thêm thuốc
                                        </button>
                                    </div>
                                    <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-2xl">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                                                    <tr>
                                                        <th className="px-6 py-4">Tên thuốc & Hàm lượng</th>
                                                        <th className="px-6 py-4">Liều dùng</th>
                                                        <th className="px-6 py-4">Tần suất</th>
                                                        <th className="px-6 py-4">Thời gian</th>
                                                        <th className="px-6 py-4 text-right">Thao tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-sm">Metformin 500mg</div>
                                                            <div className="text-[10px] text-slate-400 font-medium">Uống sau khi ăn</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium">1 viên</td>
                                                        <td className="px-6 py-4 text-sm font-medium">Sáng 1, Tối 1</td>
                                                        <td className="px-6 py-4 text-sm font-black text-primary">30 ngày</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-sm">Paracetamol 500mg</div>
                                                            <div className="text-[10px] text-slate-400 font-medium">Khi sốt trên 38.5 độ</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium">1 viên</td>
                                                        <td className="px-6 py-4 text-sm font-medium">Cách 4-6 giờ</td>
                                                        <td className="px-6 py-4 text-sm font-black text-primary">5 ngày</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes & Follow-up Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                            <StickyNote className="w-4 h-4 text-slate-400" />
                                            Ghi chú dược sĩ/bệnh nhân
                                        </label>
                                        <textarea
                                            rows={3}
                                            placeholder="Nhập lời dặn thêm..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Clock className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">Hẹn tái khám</p>
                                                    <p className="text-[10px] text-slate-500 font-medium">Tự động nhắc lịch cho bệnh nhân</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngày tái khám dự kiến</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="date"
                                                    defaultValue="2023-12-25"
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setIsPrescriptionModalOpen(false)}
                                    className="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                                >
                                    Hủy
                                </button>
                                <button
                                    className="px-8 py-2.5 rounded-xl font-bold bg-primary text-slate-900 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 text-sm active:scale-95"
                                >
                                    <Send className="w-4 h-4" />
                                    Lưu & Gửi
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ─── Advice Modal ─── */}
            <AnimatePresence>
                {isAdviceModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAdviceModalOpen(false)}
                            className="absolute inset-0 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col no-scrollbar"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0">
                                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Gửi lời khuyên chuyên môn</h2>
                                <button
                                    onClick={() => setIsAdviceModalOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh] no-scrollbar">
                                {/* Patient Info Card */}
                                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-black text-xs">
                                            NA
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">Nguyễn Văn A</p>
                                        <p className="text-xs text-slate-500 font-medium tracking-tight uppercase">ID: #BN-12345678</p>
                                    </div>
                                </div>

                                {/* Category Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Danh mục lời khuyên</label>
                                    <div className="relative">
                                        <select className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-primary focus:border-primary outline-none appearance-none px-4 py-2.5">
                                            <option>Dinh dưỡng</option>
                                            <option>Vận động / Thể dục</option>
                                            <option>Sử dụng thuốc</option>
                                            <option>Theo dõi tại nhà</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nội dung chi tiết</label>
                                    <textarea
                                        className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary min-h-[120px] p-4 font-medium outline-none resize-none transition-all"
                                        placeholder="Nhập lời khuyên chuyên môn tại đây..."
                                    />
                                </div>

                                {/* Template Library */}
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mẫu lời khuyên nhanh</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Hạn chế muối', 'Đi bộ 30p mỗi ngày', 'Theo dõi huyết áp', 'Uống đủ nước'].map((tag) => (
                                            <button
                                                key={tag}
                                                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-primary hover:text-white rounded-full text-[11px] font-bold transition-all text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700 active:scale-95"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Delivery Options */}
                                <div className="space-y-3">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Phương thức gửi</p>
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                defaultChecked
                                                className="rounded text-primary focus:ring-primary w-4 h-4 border-slate-300 transition-all cursor-pointer"
                                            />
                                            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium group-hover:text-primary transition-colors">Tin nhắn hệ thống</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="rounded text-primary focus:ring-primary w-4 h-4 border-slate-300 transition-all cursor-pointer"
                                            />
                                            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium group-hover:text-primary transition-colors">Thông báo Push</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
                                <button
                                    onClick={() => setIsAdviceModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    className="flex-[1.5] py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-slate-900 font-extrabold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95"
                                >
                                    Gửi ngay
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ─── Appointment Modal ─── */}
            <AnimatePresence>
                {isAppointmentModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAppointmentModalOpen(false)}
                            className="absolute inset-0 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Đặt lịch tái khám</h2>
                                </div>
                                <button
                                    onClick={() => setIsAppointmentModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content (Scrollable) */}
                            <div className="p-6 space-y-6">
                                {/* Patient Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bệnh nhân</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                            <User className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <select className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white appearance-none text-sm font-medium">
                                            <option value="1">Nguyễn Văn A - ID: 2024001</option>
                                            <option value="2">Trần Thị B - ID: 2024002</option>
                                            <option value="3">Lê Văn C - ID: 2024003</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                            <ChevronDown className="w-4 h-4 text-slate-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment Type */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hình thức khám</label>
                                    <div className="flex gap-4">
                                        <label className="flex-1 cursor-pointer group">
                                            <input type="radio" name="type" defaultChecked className="peer hidden" />
                                            <div className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary transition-all font-bold text-sm">
                                                <User className="w-5 h-5" />
                                                <span>Khám trực tiếp</span>
                                            </div>
                                        </label>
                                        <label className="flex-1 cursor-pointer group">
                                            <input type="radio" name="type" className="peer hidden" />
                                            <div className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary transition-all font-bold text-sm">
                                                <Calendar className="w-5 h-5" />
                                                <span>Tư vấn trực tuyến</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Date & Time Picker Container */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Calendar */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chọn ngày</label>
                                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                                            <div className="flex items-center justify-between mb-4">
                                                <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                                    <ChevronDown className="w-4 h-4 rotate-90" />
                                                </button>
                                                <span className="text-sm font-bold">Tháng 03 2026</span>
                                                <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                                    <ChevronDown className="w-4 h-4 -rotate-90" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                                                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                                            </div>
                                            <div className="grid grid-cols-7 gap-1">
                                                {[...Array(31)].map((_, i) => (
                                                    <button
                                                        key={i}
                                                        className={`text-xs h-8 flex items-center justify-center rounded-lg transition-all font-bold ${i + 1 === 4 ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20' : 'hover:bg-primary/10 text-slate-600 dark:text-slate-400 hover:text-primary'}`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Time Slots */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Giờ khám trống</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30'].map((time) => (
                                                <button
                                                    key={time}
                                                    className={`py-2.5 text-xs font-bold border rounded-xl transition-all active:scale-95 ${time === '09:00'
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ghi chú dặn dò bệnh nhân</label>
                                    <textarea
                                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium resize-none transition-all"
                                        placeholder="Ví dụ: Nhịn ăn sáng trước khi lấy máu, mang theo kết quả cũ..."
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setIsAppointmentModalOpen(false)}
                                    className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-95"
                                >
                                    Hủy bỏ
                                </button>
                                <button className="px-8 py-2.5 text-sm font-extrabold text-slate-900 bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95">
                                    <Send className="w-4 h-4" />
                                    Lưu & Gửi thông báo
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

