import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'

interface AppointmentModalProps {
    isOpen: boolean
    onClose: () => void
    patientName?: string
    patientId?: string
}

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const TIME_SLOTS = [
    { time: '08:00', available: true },
    { time: '08:30', available: true },
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: true },
    { time: '10:30', available: true },
    { time: '14:00', available: true },
    { time: '14:30', available: true },
    { time: '15:00', available: false },
    { time: '15:30', available: true },
]

function generateCalendarDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const days: { day: number; currentMonth: boolean }[] = []

    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({ day: daysInPrevMonth - i, currentMonth: false })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, currentMonth: true })
    }

    return days
}

const MONTH_NAMES = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
]

export function AppointmentModal({ isOpen, onClose, patientName = 'Nguyễn Văn A', patientId = '2024001' }: AppointmentModalProps) {
    const [appointmentType, setAppointmentType] = useState<'direct' | 'online'>('direct')
    const [selectedDay, setSelectedDay] = useState<number | null>(5)
    const [selectedTime, setSelectedTime] = useState<string | null>('09:00')
    const [currentMonth, setCurrentMonth] = useState(10) // November (0-indexed)
    const [currentYear, setCurrentYear] = useState(2024)

    if (!isOpen) return null

    const calendarDays = generateCalendarDays(currentYear, currentMonth)

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11)
            setCurrentYear(currentYear - 1)
        } else {
            setCurrentMonth(currentMonth - 1)
        }
    }

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0)
            setCurrentYear(currentYear + 1)
        } else {
            setCurrentMonth(currentMonth + 1)
        }
    }

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4">
            {/* Backdrop */}
            <div className="fixed inset-0" onClick={onClose} />

            {/* Modal Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col z-10"
            >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Đặt lịch tái khám</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Thiết lập lịch hẹn tiếp theo cho bệnh nhân</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                    {/* Patient Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bệnh nhân</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                            </div>
                            <select
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white appearance-none"
                                defaultValue="1"
                            >
                                <option value="1">{patientName} - ID: {patientId}</option>
                                <option value="2">Trần Thị B - ID: 2024002</option>
                                <option value="3">Lê Văn C - ID: 2024003</option>
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-400">expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hình thức khám</label>
                        <div className="flex gap-4">
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="appointmentType"
                                    className="peer hidden"
                                    checked={appointmentType === 'direct'}
                                    onChange={() => setAppointmentType('direct')}
                                />
                                <div className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary transition-all">
                                    <span className="material-symbols-outlined text-xl">person_pin_circle</span>
                                    <span className="text-sm font-medium">Khám trực tiếp</span>
                                </div>
                            </label>
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="appointmentType"
                                    className="peer hidden"
                                    checked={appointmentType === 'online'}
                                    onChange={() => setAppointmentType('online')}
                                />
                                <div className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary transition-all">
                                    <span className="material-symbols-outlined text-xl">videocam</span>
                                    <span className="text-sm font-medium">Tư vấn trực tuyến</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Date & Time Picker Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Calendar */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chọn ngày</label>
                            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                                {/* Calendar Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        type="button"
                                        onClick={handlePrevMonth}
                                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                                    </button>
                                    <span className="text-sm font-bold">{MONTH_NAMES[currentMonth]} {currentYear}</span>
                                    <button
                                        type="button"
                                        onClick={handleNextMonth}
                                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                                    </button>
                                </div>

                                {/* Day Labels */}
                                <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-2">
                                    {DAYS_OF_WEEK.map((d, i) => (
                                        <div key={i}>{d}</div>
                                    ))}
                                </div>

                                {/* Calendar Days */}
                                <div className="grid grid-cols-7 gap-1">
                                    {calendarDays.map((item, i) => (
                                        item.currentMonth ? (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setSelectedDay(item.day)}
                                                className={`text-xs h-8 flex items-center justify-center rounded-full transition-colors ${selectedDay === item.day
                                                    ? 'bg-primary text-white font-bold'
                                                    : 'hover:bg-primary/20'
                                                    }`}
                                            >
                                                {item.day}
                                            </button>
                                        ) : (
                                            <div
                                                key={i}
                                                className="text-xs h-8 flex items-center justify-center text-slate-300"
                                            >
                                                {item.day}
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Giờ khám trống</label>
                            <div className="grid grid-cols-2 gap-2">
                                {TIME_SLOTS.map((slot) => (
                                    <button
                                        key={slot.time}
                                        type="button"
                                        disabled={!slot.available}
                                        onClick={() => setSelectedTime(slot.time)}
                                        className={`py-2.5 text-xs font-medium rounded-lg transition-all ${!slot.available
                                            ? 'border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 opacity-50 cursor-not-allowed'
                                            : selectedTime === slot.time
                                                ? 'border border-primary bg-primary/10 text-primary font-bold'
                                                : 'border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-primary'
                                            }`}
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ghi chú dặn dò bệnh nhân</label>
                        <textarea
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                            placeholder="Ví dụ: Nhịn ăn sáng trước khi lấy máu, mang theo kết quả cũ..."
                            rows={3}
                        />
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-bold text-slate-900 bg-primary hover:bg-primary/90 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">send</span>
                        Lưu & Gửi thông báo
                    </button>
                </div>
            </motion.div>
        </div>,
        document.body
    )
}
