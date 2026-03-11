import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTenant } from '@/context/TenantContext'
import { AppointmentModal } from '@/components/modals/AppointmentModal'

export default function Scheduling() {
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)

    // Using static layout for demonstration based on the provided design
    const isLoading = false;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Đang tải lịch hẹn...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="font-display bg-background-light dark:bg-background-dark p-8 flex-1 overflow-y-auto">
            <div className="space-y-8">
                {/* ─── Header Section ─── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Lịch
                            hẹn khám</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Chào buổi sáng, BS. Nguyễn. Bạn có 24
                            lịch hẹn trong hôm nay.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsAppointmentModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#4ade80] text-slate-900 font-bold text-sm rounded-xl hover:bg-[#4ade80]/90 transition-all shadow-lg shadow-[#4ade80]/20">
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            <span>Thêm lịch hẹn mới</span>
                        </button>
                    </div>
                </div>

                {/* ─── Stats Section ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div
                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tổng lịch hẹn hôm nay
                            </p>
                            <div
                                className="size-8 rounded-lg bg-[#4ade80]/10 flex items-center justify-center text-[#4ade80]">
                                <span className="material-symbols-outlined text-xl">event_available</span>
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">24</span>
                            <span className="text-xs font-bold text-[#4ade80] flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-xs">trending_up</span>
                                +5%
                            </span>
                        </div>
                    </div>
                    <div
                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Khám trực tiếp</p>
                            <div
                                className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <span className="material-symbols-outlined text-xl">person_search</span>
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">14</span>
                            <span className="text-xs font-bold text-[#4ade80] flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-xs">trending_up</span>
                                +2%
                            </span>
                        </div>
                    </div>
                    <div
                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tư vấn trực tuyến</p>
                            <div
                                className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <span className="material-symbols-outlined text-xl">video_camera_front</span>
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">10</span>
                            <span className="text-xs font-bold text-red-500 flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-xs">trending_down</span>
                                -1%
                            </span>
                        </div>
                    </div>
                    <div
                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Đang chờ xác nhận</p>
                            <div
                                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                <span className="material-symbols-outlined text-xl">hourglass_empty</span>
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">3</span>
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-xs">horizontal_rule</span>
                                0%
                            </span>
                        </div>
                    </div>
                </div>

                {/* ─── Main Content Grid ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Calendar View (lg:col-span-8) */}
                    <div className="lg:col-span-8 space-y-4">
                        <div
                            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                            <div
                                className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-lg font-bold">Tháng 10, 2023</h3>
                                    <div
                                        className="flex border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                        <button
                                            className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-r border-slate-200 dark:border-slate-700">
                                            <span className="material-symbols-outlined text-lg leading-none">chevron_left</span>
                                        </button>
                                        <button
                                            className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                            <span className="material-symbols-outlined text-lg leading-none">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                                    <button
                                        className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-600 rounded-md shadow-sm">Tháng</button>
                                    <button className="px-3 py-1.5 text-xs font-bold text-slate-500">Tuần</button>
                                    <button className="px-3 py-1.5 text-xs font-bold text-slate-500">Ngày</button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div
                                    className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden min-w-[600px] shadow-sm">
                                    {/* Weekdays */}
                                    {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                                        <div key={day} className="bg-slate-50 dark:bg-slate-800 p-2 text-center text-xs font-bold text-slate-400">
                                            {day}
                                        </div>
                                    ))}

                                    {/* Details of Calendar layout matching screenshot exactly */}
                                    {[...Array(3)].map((_, i) => (
                                        <div key={`offset-${i}`} className="bg-white dark:bg-slate-800 min-h-[100px] p-2 opacity-50" />
                                    ))}

                                    {[...Array(31)].map((_, i) => {
                                        const day = i + 1;
                                        const isToday = day === 5;

                                        if (day === 5) {
                                            return (
                                                <div key={day} className="bg-[#4ade80]/5 dark:bg-[#4ade80]/10 min-h-[100px] p-2 relative ring-2 ring-inset ring-[#4ade80]">
                                                    <span className="text-sm font-bold text-[#4ade80] underline underline-offset-4 decoration-2">5</span>
                                                    <div className="mt-2 space-y-1">
                                                        <div className="text-[10px] p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded border-l-2 border-blue-500 truncate">
                                                            8:00 - Nguyễn Vy</div>
                                                        <div className="text-[10px] p-1 bg-[#4ade80]/20 dark:bg-[#4ade80]/30 text-green-700 rounded border-l-2 border-[#4ade80] truncate">
                                                            9:30 - Trần Đạt</div>
                                                        <div className="text-[10px] p-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded border-l-2 border-slate-400 truncate">
                                                            +22 khác</div>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        if (day === 6) {
                                            return (
                                                <div key={day} className="bg-white dark:bg-slate-800 min-h-[100px] p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                                    <span className="text-sm font-medium">6</span>
                                                    <div className="mt-2 flex gap-1 flex-wrap">
                                                        <div className="size-1.5 rounded-full bg-blue-500"></div>
                                                        <div className="size-1.5 rounded-full bg-amber-500"></div>
                                                    </div>
                                                </div>
                                            )
                                        }

                                        if (day === 10) {
                                            return (
                                                <div key={day} className="bg-white dark:bg-slate-800 min-h-[100px] p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                                    <span className="text-sm font-medium">10</span>
                                                    <div className="mt-2 flex gap-1 flex-wrap">
                                                        <div className="size-1.5 rounded-full bg-red-500"></div>
                                                    </div>
                                                </div>
                                            )
                                        }

                                        return (
                                            <div key={day} className="bg-white dark:bg-slate-800 min-h-[100px] p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                                <span className="text-sm font-medium">{day}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Agenda Section (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div
                            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold">Lịch trình hôm nay</h3>
                                    <span className="text-sm text-slate-500">05/10/2023</span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[600px] custom-scrollbar">
                                {/* Appointment 1 */}
                                <div
                                    className="group p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-l-4 border-blue-500 transition-all hover:shadow-md">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full overflow-hidden bg-slate-200">
                                                <img className="size-full object-cover"
                                                    alt="Hình ảnh bệnh nhân nữ trẻ trung"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb0o6sygn-tTBsZBoC65Kab2XSzD5kyvM0cQCp7q3D7d-DPRbS2WPN-J9qW4defKHVTm4Ne5MybPvbpX15y3nuJcGH_ZMAV8Ing63zo37JBptWi-L8G3hT8XrQ_Y473osbARM671qPBYZj2fWD5e3VlCBHz0VkMgjBoMngTblCw01LasrKK3QeulfZg6OlsV6ZaIikF3_Vh00RGRscipZqgzhWRIHE_P_3CLik_L6Z8JdHIrdntfvNFNm9etpeHf4onJOFuVdE42s" />
                                            </div>
                                            <div>
                                                <h4
                                                    className="text-sm font-bold group-hover:text-[#4ade80] transition-colors">
                                                    Nguyễn T. Bảo Vy</h4>
                                                <p className="text-[11px] text-slate-500">Khám sức khỏe tổng quát</p>
                                            </div>
                                        </div>
                                        <span
                                            className="text-xs font-bold text-slate-900 dark:text-white bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">8:00</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="material-symbols-outlined text-sm text-blue-500">location_on</span>
                                            <span className="text-xs font-medium">Tại phòng khám</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="p-1.5 text-slate-400 hover:text-[#4ade80] dark:hover:text-[#4ade80] transition-colors">
                                                <span className="material-symbols-outlined text-lg">edit_calendar</span>
                                            </button>
                                            <button
                                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                                <span className="material-symbols-outlined text-lg">cancel</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment 2 */}
                                <div
                                    className="group p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-l-4 border-primary transition-all hover:shadow-md">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full overflow-hidden bg-slate-200">
                                                <img className="size-full object-cover"
                                                    alt="Hình ảnh bệnh nhân nam trung niên"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGrkxIzbuHaZxef3rzbpLYbiAtdG822jvnMg2FKb_FlHFGO3kjrxrd6ruHNX0QMyzUDOcM9-m2KiMjMnlZ4cc6Y8qZwSSQfjr8jlyE6qFhZlWewFHYSjcFEaAKDbtZMDQBIFjuscvq6ZD-3KgWQS4xgGzxC_UYtU5a6JMxdbAJNaQEHi89I5qWDZZbDBHCDEKZOw0DMTYDiOvm-wwKau6eh0tmbI-YZdP5k3ceDFtlqN2FUICg8b-fN4bGfyj839rsFb-kIUZYZbU" />
                                            </div>
                                            <div>
                                                <h4
                                                    className="text-sm font-bold group-hover:text-primary transition-colors">
                                                    Trần Văn Đạt</h4>
                                                <p className="text-[11px] text-slate-500">Tư vấn triệu chứng ho</p>
                                            </div>
                                        </div>
                                        <span
                                            className="text-xs font-bold text-slate-900 dark:text-white bg-primary/20 px-2 py-0.5 rounded">9:30</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="material-symbols-outlined text-sm text-primary">video_call</span>
                                            <span className="text-xs font-medium">Trực tuyến</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="px-3 py-1 bg-[#4ade80] text-slate-900 text-[10px] font-bold rounded-lg shadow-sm">Bắt
                                                đầu cuộc gọi</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment 3 */}
                                <div
                                    className="group p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-l-4 border-slate-300 dark:border-slate-600 transition-all hover:shadow-md opacity-70">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full overflow-hidden bg-slate-200">
                                                <img className="size-full object-cover"
                                                    alt="Hình ảnh bệnh nhân nam thanh niên"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtH3dN-8KIzsDFEDv2W-iFSfo0ZO8hy2FXS7WoKI-vVxzjEP-j9jUP8zWwjwAlwLq_gCWb_zuDW8bAl5rRVOQWmU4uWhVmjT8QMey3PPmHxvRR8jJk9lM59VD1QMfhrNSJKy6TdBxERjsqW3lSqgE1CdbXNa4dy9ngK_POeINMMJgE69M3KAAaJzqk6XMxP8p3HVpUdBy7BncgoGRGn_N1fWdWRWsdvPLMyKHqT_-FVfXPJsXM2tdtJvGMqDCXD2HqoSXEZ7q6zkI" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold">Lê Minh Tuấn</h4>
                                                <p className="text-[11px] text-slate-500">Kiểm tra kết quả xét nghiệm
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className="text-xs font-bold text-slate-400 px-2 py-0.5 rounded">11:00</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="material-symbols-outlined text-sm text-slate-400">hourglass_top</span>
                                            <span className="text-xs font-medium text-slate-400">Đang chờ xác
                                                nhận</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-[10px] font-bold rounded-lg">Xác
                                                nhận</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Add slot button */}
                                <button
                                    onClick={() => setIsAppointmentModalOpen(true)}
                                    className="w-full p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-primary hover:border-primary transition-all">
                                    <span className="material-symbols-outlined">add_circle</span>
                                    <span className="text-sm font-medium">Đặt lịch cho giờ trống tiếp theo</span>
                                </button>
                            </div>

                            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-b-2xl border-t border-slate-100 dark:border-slate-700">
                                <div className="flex gap-2">
                                    <button className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                        Dời lịch hàng loạt
                                    </button>
                                    <button className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                        Xuất file CSV
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <AppointmentModal
                    isOpen={isAppointmentModalOpen}
                    onClose={() => setIsAppointmentModalOpen(false)}
                />
            </div>
        </div>
    )
}
