import { useQuery } from '@tanstack/react-query'
import { getPortalAppointments } from '@/api/portal'
import { useTenant } from '@/context/TenantContext'
import {
    Calendar,
    Clock,
    MapPin,
    ChevronRight,
    CalendarCheck
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function PatientAppointments() {
    const { headers } = useTenant()
    const navigate = useNavigate()

    const { data: appointments, isLoading } = useQuery({
        queryKey: ['portal-appointments'],
        queryFn: () => getPortalAppointments(headers),
        enabled: !!headers?.tenantId
    })

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-emerald-100 text-emerald-700'
            case 'PENDING': return 'bg-amber-100 text-amber-700'
            case 'CANCELLED': return 'bg-rose-100 text-rose-700'
            case 'COMPLETED': return 'bg-blue-100 text-blue-700'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'Đã xác nhận'
            case 'PENDING': return 'Chờ xử lý'
            case 'CANCELLED': return 'Đã hủy'
            case 'COMPLETED': return 'Đã hoàn thành'
            case 'CHECKED_IN': return 'Đã đến'
            default: return status
        }
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lịch hẹn của tôi</h1>
                    <p className="text-slate-500 font-medium mt-1">Quản lý các cuộc hẹn sắp tới và lịch sử đặt lịch.</p>
                </div>
                <button
                    onClick={() => navigate('/patient/booking')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm tracking-tight hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center gap-2"
                >
                    <CalendarCheck className="w-5 h-5" />
                    Đặt lịch mới
                </button>
            </header>

            <div className="grid gap-4">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-32 bg-white rounded-[2.5rem] animate-pulse" />
                    ))
                ) : (appointments && appointments.length > 0) ? (
                    appointments.map((apt, idx) => (
                        <motion.div
                            key={apt.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex flex-col items-center justify-center border border-blue-100">
                                        <span className="text-[10px] font-black uppercase leading-none mb-1">Th{new Date(apt.appointmentDate).getMonth() + 1}</span>
                                        <span className="text-2xl font-black leading-none">{new Date(apt.appointmentDate).getDate()}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${getStatusStyle(apt.status)}`}>
                                                {getStatusLabel(apt.status)}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px]">
                                                <Clock className="w-3 h-3" />
                                                {apt.startTime} - {apt.endTime}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {apt.appointmentType || 'Khám tổng quát'}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                                            <MapPin className="w-4 h-4 text-slate-300" />
                                            {apt.branchName}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {apt.status === 'PENDING' && (
                                        <button className="px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-100">
                                            Hủy lịch
                                        </button>
                                    )}
                                    <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="bg-white rounded-[3rem] py-24 text-center border border-slate-100 border-dashed">
                        <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-slate-900">Không có lịch hẹn</h3>
                        <p className="text-slate-400 font-medium">Bạn chưa có cuộc hẹn nào được đặt trước.</p>
                        <button
                            onClick={() => navigate('/patient/booking')}
                            className="mt-6 px-10 py-4 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:scale-105 active:scale-95 transition-all"
                        >
                            Đặt lịch ngay bây giờ
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
