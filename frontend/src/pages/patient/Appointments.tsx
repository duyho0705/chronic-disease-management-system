import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPortalAppointments, getPortalBranches, getPortalSlots, createPortalAppointment } from '@/api/portal'
import { useTenant } from '@/context/TenantContext'
import {
    Calendar,
    Clock,
    MapPin,
    Video,
    PlusCircle,
    Filter,
    Search,
    Lightbulb,
    X,
    Loader2,
    ChevronRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isAfter, isBefore, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function PatientAppointments() {
    const { headers } = useTenant()
    const queryClient = useQueryClient()
    const [showBooking, setShowBooking] = useState(false)
    const [bookingData, setBookingData] = useState({
        branchId: '',
        appointmentDate: '',
        slotStartTime: '',
        slotEndTime: '',
        appointmentType: 'Trực tiếp',
        notes: ''
    })

    const { data: appointments, isLoading } = useQuery({
        queryKey: ['portal-appointments'],
        queryFn: () => getPortalAppointments(headers),
        enabled: !!headers?.tenantId
    })

    const { data: branches } = useQuery({
        queryKey: ['portal-branches'],
        queryFn: () => getPortalBranches(headers),
        enabled: !!headers?.tenantId && showBooking
    })

    const { data: slots } = useQuery({
        queryKey: ['portal-slots', bookingData.branchId, bookingData.appointmentDate],
        queryFn: () => getPortalSlots(bookingData.branchId, bookingData.appointmentDate, headers),
        enabled: !!bookingData.branchId && !!bookingData.appointmentDate && showBooking
    })

    const createMutation = useMutation({
        mutationFn: () => createPortalAppointment({
            branchId: bookingData.branchId,
            appointmentDate: bookingData.appointmentDate,
            slotStartTime: bookingData.slotStartTime,
            slotEndTime: bookingData.slotEndTime,
            appointmentType: bookingData.appointmentType,
            notes: bookingData.notes
        }, headers),
        onSuccess: () => {
            toast.success('Đặt lịch thành công!')
            queryClient.invalidateQueries({ queryKey: ['portal-appointments'] })
            setShowBooking(false)
            setBookingData({ branchId: '', appointmentDate: '', slotStartTime: '', slotEndTime: '', appointmentType: 'Trực tiếp', notes: '' })
        },
        onError: (err: any) => toast.error(err.message || 'Có lỗi xảy ra khi đặt lịch.')
    })

    const upcomingAppointments = appointments?.filter(apt =>
        isAfter(parseISO(`${apt.appointmentDate}T${apt.startTime}`), new Date()) &&
        apt.status !== 'CANCELLED'
    ) || []

    const historyAppointments = appointments?.filter(apt =>
        isBefore(parseISO(`${apt.appointmentDate}T${apt.startTime}`), new Date()) ||
        apt.status === 'CANCELLED'
    ) || []

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED':
            case 'CONFIRMED':
                return <span className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold">Hoàn tất</span>
            case 'CANCELLED':
                return <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase">Đã hủy</span>
            case 'PENDING':
                return <span className="px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">Chờ xử lý</span>
            default:
                return <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Đã xác nhận</span>
        }
    }

    if (isLoading) return <div className="p-8 text-center text-slate-400 font-bold">Đang tải lịch hẹn...</div>

    return (
        <div className="flex flex-col lg:flex-row gap-8 py-8 pb-12">
            {/* Main Content Area */}
            <div className="flex-1 space-y-8">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Lịch hẹn</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">Quản lý và theo dõi các buổi khám của bạn</p>
                    </div>
                    <button
                        onClick={() => setShowBooking(true)}
                        className="bg-[#4ade80] hover:bg-[#4ade80]/90 text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#4ade80]/20 active:scale-95"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Đặt lịch mới
                    </button>
                </header>

                {/* Upcoming Appointments Section (Red Box 1 in Screenshot) */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Lịch khám sắp tới</h3>
                        <span className="text-sm text-[#4ade80] font-medium cursor-pointer hover:underline">Xem tất cả</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {upcomingAppointments.length > 0 ? upcomingAppointments.map((apt, idx) => (
                            <motion.div
                                key={apt.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex gap-4">
                                        <div className="size-16 rounded-xl bg-emerald-100 flex items-center justify-center border border-slate-50 dark:border-slate-800 shadow-sm text-emerald-600 font-black text-xl">
                                            {apt.doctorName?.charAt(0) || <Calendar className="w-8 h-8 opacity-50" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                                                {apt.doctorName || "Bác sĩ phụ trách"}
                                            </h4>
                                            {apt.doctorSpecialty && (
                                                <p className="text-sm text-[#4ade80] font-medium mt-1">
                                                    {apt.doctorSpecialty}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${apt.appointmentType === 'Online' ? 'bg-blue-100 text-blue-600' : 'bg-[#4ade80]/10 text-[#4ade80]'}`}>
                                        {apt.appointmentType || 'Trực tiếp'}
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm">{format(parseISO(apt.appointmentDate), 'EEEE, dd MMMM, yyyy', { locale: vi })}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm">{apt.startTime} - {apt.endTime}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                        {apt.appointmentType === 'Online' ? (
                                            <>
                                                <Video className="w-4 h-4 text-blue-400" />
                                                <span className="text-sm font-medium text-blue-500 underline cursor-pointer">Liên kết Google Meet</span>
                                            </>
                                        ) : (
                                            <>
                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm truncate">{apt.branchName}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-[#4ade80] hover:bg-[#4ade80]/90 text-slate-900 py-2.5 rounded-lg text-sm font-bold transition-colors">
                                        {apt.appointmentType === 'Online' ? 'Vào phòng chờ' : 'Nhắc tôi'}
                                    </button>
                                    <button className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        Hủy lịch
                                    </button>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-2 py-12 text-center bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 border-dashed shadow-sm">
                                <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-400 font-bold text-sm">Không có lịch khám sắp tới</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* History Section (Red Box 2 in Screenshot) */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Lịch sử khám bệnh</h3>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
                                <Filter className="w-5 h-5 text-slate-500" />
                            </button>
                            <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
                                <Search className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#fcfdfc] dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Ngày khám</th>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Bác sĩ</th>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Chẩn đoán</th>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {historyAppointments.length > 0 ? historyAppointments.map((apt) => (
                                        <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-white">
                                                {format(parseISO(apt.appointmentDate), 'dd/MM/yyyy')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-white dark:border-slate-600 shadow-sm text-xs font-black text-slate-500">
                                                        {apt.doctorName?.charAt(0) || <Calendar className="w-4 h-4 opacity-50" />}
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                        {apt.doctorName || "Đang cập nhật"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                                                {apt.notes}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(apt.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button className="text-[#4ade80] hover:text-[#4ade80]/80 text-sm font-bold transition-all">
                                                    Xem kết quả
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-bold italic">Chưa có lịch sử khám bệnh</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            {/* Right Sidebar Area (Matches design) */}
            <aside className="w-full lg:w-80 space-y-8">
                {/* Mini Calendar Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-900 dark:text-white">Lịch cá nhân</h4>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">{format(new Date(), 'MMMM, yyyy', { locale: vi })}</span>
                    </div>
                    <div className="bg-[#fcfdfc] dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                                <span key={`${d}-${idx}`} className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {Array.from({ length: 31 }).map((_, i) => {
                                const day = i + 1;
                                const isToday = day === new Date().getDate();
                                return (
                                    <div
                                        key={i}
                                        className={`py-2 text-xs font-bold rounded-full transition-all ${isToday ? 'bg-[#4ade80] text-slate-900 shadow-lg shadow-[#4ade80]/20' :
                                            'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 cursor-pointer shadow-sm'
                                            }`}
                                    >
                                        {day}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* My Doctors Section */}
                <section>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4">Bác sĩ của tôi</h4>
                    <div className="py-8 text-center bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 border-dashed">
                        <p className="text-slate-400 font-bold text-xs uppercase">Chưa có danh sách bác sĩ</p>
                    </div>
                </section>

                {/* Health Tip Widget Section */}
                <section className="bg-[#4ade80]/10 dark:bg-[#4ade80]/5 p-5 rounded-2xl border border-[#4ade80]/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <Lightbulb className="w-6 h-6 text-[#4ade80] mb-2" />
                        <h5 className="font-bold text-sm mb-1 text-slate-900 dark:text-slate-100">Lời khuyên hôm nay</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Hãy duy trì thói quen theo dõi sức khỏe và đừng quên ghi lại các chỉ số hàng ngày nhé!
                        </p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 size-24 bg-[#4ade80]/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                </section>
            </aside>

            {/* Booking Modal Redesign */}
            <AnimatePresence>
                {showBooking && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowBooking(false)}
                            className="absolute inset-0 bg-slate-900/60"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-[720px] max-h-[90vh] flex flex-col relative z-10 shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
                        >
                            {/* Modal Header */}
                            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Đặt lịch khám mới</h2>
                                    <p className="text-slate-500 text-sm font-bold mt-1">Hoàn thành các bước dưới đây để đặt lịch hẹn</p>
                                </div>
                                <button
                                    onClick={() => setShowBooking(false)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar space-y-8">
                                {/* Form Progress */}
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="size-6 rounded-full bg-[#4ade80] text-slate-900 flex items-center justify-center text-xs font-bold">1</span>
                                        <span className="text-sm font-bold text-[#4ade80]">Thông tin khám</span>
                                    </div>
                                    <div className="h-px w-8 bg-slate-200 dark:bg-slate-800"></div>
                                    <div className="flex items-center gap-2">
                                        <span className="size-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold">2</span>
                                        <span className="text-sm font-bold text-slate-400">Xác nhận</span>
                                    </div>
                                </div>

                                {/* Appointment Type Section */}
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Hình thức khám</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { id: 'Trực tiếp', label: 'Khám trực tiếp', sub: 'Tại cơ sở y tế', icon: MapPin },
                                            { id: 'Online', label: 'Tư vấn trực tuyến', sub: 'Qua Video Call', icon: Video }
                                        ].map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() => setBookingData({ ...bookingData, appointmentType: type.id })}
                                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${bookingData.appointmentType === type.id
                                                    ? 'border-[#4ade80] bg-[#4ade80]/5'
                                                    : 'border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-xl ${bookingData.appointmentType === type.id ? 'bg-[#4ade80] text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                                    <type.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className={`font-bold text-sm tracking-tight ${bookingData.appointmentType === type.id ? 'text-slate-900 dark:text-white' : 'text-slate-600'}`}>{type.label}</p>
                                                    <p className="text-xs text-slate-400 font-medium">{type.sub}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Branch Selection */}
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Chi nhánh thực hiện</h3>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <MapPin className="w-5 h-5 text-[#4ade80]" />
                                        </div>
                                        <select
                                            value={bookingData.branchId}
                                            onChange={e => setBookingData({ ...bookingData, branchId: e.target.value })}
                                            className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-[#4ade80]/50 text-slate-900 dark:text-white font-bold text-sm appearance-none outline-none transition-all cursor-pointer"
                                        >
                                            <option value="">Chọn cơ sở khám chữa bệnh...</option>
                                            {(branches || []).map((b: any) => (
                                                <option key={b.id} value={b.id}>{b.nameVi || b.code} - {b.address || 'Hệ thống Sống Khỏe'}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                            <ChevronRight className="w-5 h-5 rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                {/* Date & Time Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Date Selection */}
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Ngày khám</h3>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                            <input
                                                type="date"
                                                value={bookingData.appointmentDate}
                                                min={format(new Date(), 'yyyy-MM-dd')}
                                                onChange={e => setBookingData({ ...bookingData, appointmentDate: e.target.value, slotStartTime: '', slotEndTime: '' })}
                                                className="w-full bg-transparent font-bold text-sm text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Time Slots */}
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Khung giờ</h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {(slots || []).length > 0 ? (slots || []).map((s: any, i: number) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setBookingData({ ...bookingData, slotStartTime: s.startTime, slotEndTime: s.endTime || '' })}
                                                    className={`py-3 rounded-xl text-xs font-bold border transition-all ${bookingData.slotStartTime === s.startTime
                                                        ? 'bg-[#4ade80] text-slate-900 border-[#4ade80] shadow-md'
                                                        : s.available === false
                                                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 border-transparent cursor-not-allowed opacity-40'
                                                            : 'bg-white dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700 hover:border-[#4ade80]'
                                                        }`}
                                                    disabled={s.available === false}
                                                >
                                                    {s.startTime}
                                                </button>
                                            )) : (
                                                <div className="col-span-3 py-6 flex flex-col items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-2xl">
                                                    <Clock className="w-6 h-6 text-slate-200" />
                                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Không có giờ trống</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Lý do khám / Triệu chứng</h3>
                                    <textarea
                                        value={bookingData.notes}
                                        onChange={e => setBookingData({ ...bookingData, notes: e.target.value })}
                                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#4ade80]/50 text-slate-900 dark:text-white text-sm font-bold min-h-[100px] resize-none outline-none transition-all"
                                        placeholder="Mô tả tình trạng sức khỏe của bạn hoặc các triệu chứng đang gặp phải..."
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-3 items-center justify-end">
                                <button
                                    onClick={() => setShowBooking(false)}
                                    className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={() => {
                                        if (!bookingData.branchId) { toast.error('Vui lòng chọn chi nhánh'); return }
                                        if (!bookingData.appointmentDate) { toast.error('Vui lòng chọn ngày khám'); return }
                                        if (!bookingData.slotStartTime) { toast.error('Vui lòng chọn khung giờ'); return }
                                        createMutation.mutate()
                                    }}
                                    disabled={createMutation.isPending}
                                    className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#4ade80] text-slate-900 font-bold text-sm shadow-xl shadow-[#4ade80]/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                                    Xác nhận đặt lịch
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
