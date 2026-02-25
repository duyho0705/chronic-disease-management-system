import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTenant } from '@/context/TenantContext'
import { getAppointments, checkInAppointment } from '@/api/scheduling'
import { getQueueDefinitions } from '@/api/queues'
import { toastService } from '@/services/toast'
import {
    PlusCircle,
    List,
    Calendar as CalendarIcon,
    Search,
    Stethoscope,
    RefreshCw,
    FilterX,
    Video,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    XCircle,
    CheckCircle2,
} from 'lucide-react'

export function Scheduling() {
    const { headers, branchId } = useTenant()
    const queryClient = useQueryClient()
    const today = new Date().toISOString().split('T')[0]
    const [date, setDate] = useState(today)
    const [selectedQueueId, setSelectedQueueId] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

    const { data: realAppointments, isLoading } = useQuery({
        queryKey: ['appointments', branchId, date],
        queryFn: () => getAppointments({ branchId: branchId!, date }, headers),
        enabled: !!branchId && !!headers?.tenantId,
    })

    const mockAppointments = [
        {
            id: 'apt-001',
            patientName: 'Trần Văn Hoàng',
            startTime: `${date}T08:30:00`,
            endTime: `${date}T09:00:00`,
            status: 'CONFIRMED'
        },
        {
            id: 'apt-002',
            patientName: 'Lê Thị Thu',
            startTime: `${date}T10:15:00`,
            endTime: `${date}T10:45:00`,
            status: 'CONFIRMED'
        },
        {
            id: 'apt-003',
            patientName: 'Nguyễn Minh Mạnh',
            startTime: `${date}T14:00:00`,
            endTime: `${date}T14:30:00`,
            status: 'CANCELLED'
        },
        {
            id: 'apt-004',
            patientName: 'Phan Hoàng Hải',
            startTime: `${date}T16:30:00`,
            endTime: `${date}T17:00:00`,
            status: 'CHECKED_IN'
        }
    ]

    const appointments = realAppointments?.length ? realAppointments : mockAppointments

    const { data: realQueueDefinitions } = useQuery({
        queryKey: ['queue-definitions', branchId],
        queryFn: () => getQueueDefinitions(branchId!, headers),
        enabled: !!branchId && !!headers?.tenantId,
    })

    const mockQueueDefinitions = [
        { id: 'q-001', nameVi: 'Hàng chờ Nội tổng quát' },
        { id: 'q-002', nameVi: 'Hàng chờ Tim mạch' },
        { id: 'q-003', nameVi: 'Hàng chờ Nội tiết' }
    ]

    const queueDefinitions = realQueueDefinitions?.length ? realQueueDefinitions : mockQueueDefinitions

    const checkIn = useMutation({
        mutationFn: (id: string) => {
            if (!selectedQueueId) throw new Error('Vui lòng chọn hàng chờ trước khi check-in')
            return checkInAppointment(id, selectedQueueId, headers)
        },
        onSuccess: () => {
            toastService.success('✅ Tiếp nhận thành công! Bệnh nhân đã được thêm vào hàng chờ.')
            queryClient.invalidateQueries({ queryKey: ['appointments'] })
            queryClient.invalidateQueries({ queryKey: ['queue-entries'] })
        },
        onError: (e: Error) => toastService.error(e.message),
    })

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'CHECKED_IN':
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800'
            case 'CANCELLED':
                return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-100 dark:border-red-800'
            case 'CONFIRMED':
            default:
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'CHECKED_IN': return 'Đã tiếp nhận'
            case 'CANCELLED': return 'Đã hủy'
            case 'CONFIRMED': return 'Đã xác nhận'
            default: return 'Chờ khám'
        }
    }

    return (
        <div className="flex-1 space-y-8 animate-in fade-in duration-700">
            {/* Page Title & CTA */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                        Quản lý Lịch hẹn
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Theo dõi và điều chỉnh lịch khám chữa bệnh của bạn trong tuần này.
                    </p>
                </div>
                <button
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-400 text-slate-900 rounded-[13px] font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-400/20 active:scale-95"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span>Thêm lịch hẹn mới</span>
                </button>
            </div>

            {/* Tabs & Views */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex gap-8">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${viewMode === 'list' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <List className="w-4 h-4" />
                        Xem danh sách
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${viewMode === 'calendar' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <CalendarIcon className="w-4 h-4" />
                        Xem lịch
                    </button>
                </div>
                <div className="flex gap-2 pb-2">
                    <button className="px-3 py-1.5 rounded-[8px] border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 transition-colors">Ngày</button>
                    <button className="px-3 py-1.5 rounded-[8px] border border-emerald-600/20 text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 shadow-sm">Tuần</button>
                    <button className="px-3 py-1.5 rounded-[8px] border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 transition-colors">Tháng</button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bệnh nhân..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[10px] text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all shadow-sm"
                    />
                </div>

                <div className="relative group">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[10px] shadow-sm cursor-pointer hover:border-emerald-400 transition-colors">
                        <CalendarIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>

                <div className="relative group">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[10px] shadow-sm cursor-pointer hover:border-emerald-400 transition-colors">
                        <Stethoscope className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Loại: Tất cả</span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                </div>

                <div className="relative group">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[10px] shadow-sm cursor-pointer hover:border-emerald-400 transition-colors">
                        <RefreshCw className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Trạng thái: Sắp tới</span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                </div>

                {/* Queue Selection (Important for functionality) */}
                <div className="relative group">
                    <select
                        value={selectedQueueId}
                        onChange={(e) => setSelectedQueueId(e.target.value)}
                        className="pl-4 pr-10 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-[10px] text-xs font-bold text-emerald-700 dark:text-emerald-300 appearance-none outline-none focus:ring-2 focus:ring-emerald-600/20"
                    >
                        <option value="">Chọn hàng chờ tiếp nhận</option>
                        {queueDefinitions?.map(q => (
                            <option key={q.id} value={q.id}>{q.nameVi}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
                </div>

                <button
                    onClick={() => { setDate(today); setSelectedQueueId('') }}
                    className="ml-auto text-emerald-600 text-xs font-bold flex items-center gap-1 hover:underline transition-all"
                >
                    <FilterX className="w-4 h-4" />
                    Xóa bộ lọc
                </button>
            </div>

            {/* List View Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[13px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Bệnh nhân</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Thời gian</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Loại hình</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Trạng thái</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8">
                                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-2/3 mb-2"></div>
                                            <div className="h-3 bg-slate-50 dark:bg-slate-800/50 rounded-full w-1/3"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : appointments && appointments.length > 0 ? (
                                appointments.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs">
                                                    {apt.patientName?.split(' ').pop()?.substring(0, 2).toUpperCase() || 'BN'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{apt.patientName}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">ID: #BN{apt.id.slice(-4).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                    {new Date(apt.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold">{new Date(apt.startTime).toLocaleDateString('vi-VN')}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                                                <Video className="w-3 h-3" />
                                                Tele-health
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(apt.status)}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${apt.status === 'CHECKED_IN' ? 'bg-emerald-500' : apt.status === 'CANCELLED' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                                {getStatusLabel(apt.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                {apt.status === 'CONFIRMED' && (
                                                    <button
                                                        onClick={() => checkIn.mutate(apt.id)}
                                                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-[10px] transition-all"
                                                        title="Tiếp nhận ngay"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-[10px] transition-all" title="Đổi lịch">
                                                    <RotateCcw className="w-5 h-5" />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[10px] transition-all" title="Hủy lịch">
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-[20px] flex items-center justify-center mb-4">
                                                <CalendarIcon className="w-8 h-8 text-slate-200 dark:text-slate-700" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Không có lịch hẹn nào</p>
                                            <p className="text-xs text-slate-400 mt-1">Vui lòng chọn ngày khác hoặc thêm lịch hẹn mới.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Hiển thị <span className="text-slate-900 dark:text-white">1-{appointments?.length || 0}</span> trong <span className="text-slate-900 dark:text-white">{appointments?.length || 0}</span> lịch hẹn
                    </p>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-[10px] border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-900 disabled:opacity-30 transition-all" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-[10px] border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-900 transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ChevronDown(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}
