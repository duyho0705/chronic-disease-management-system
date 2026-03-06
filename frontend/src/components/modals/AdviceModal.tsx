import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'

interface AdviceModalProps {
    isOpen: boolean
    onClose: () => void
    patientName?: string
    patientId?: string
    patientAvatar?: string
}

const QUICK_TEMPLATES = [
    { icon: 'box', label: 'Hạn chế muối' },
    { icon: 'directions_walk', label: 'Đi bộ 30p mỗi ngày' },
    { icon: 'monitor_heart', label: 'Theo dõi huyết áp định kỳ' },
    { icon: 'water_drop', label: 'Uống đủ 2L nước' },
]

export function AdviceModal({
    isOpen,
    onClose,
    patientName = 'Nguyễn Văn A',
    patientId = 'BN-12345678',
    patientAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtVB7n9xlpmFXtOeY2kcwdFN0gPDzR-gYmz5kWin2lhImtB0Tfio_jluSsj10ww7lGuOoqKh9q8Elj09QkqMq7BJ40oUt3AYbY2txqsbRG874WAzDg2fD4pjzRP_mQ4ZzbB3uctFEmMcwwBn20OFvez08W4G1jrcOYstzwvRgy-aApJpbfNxeL-OzDeSqhJITy47-4-kB-ut44l940ExYvVGw4B6_fCW-p7lN9apEsYLs33totb5yNMu8o30on4aA0tgsTsaRcj7E',
}: AdviceModalProps) {
    const [content, setContent] = useState('')
    const [sendAsMessage, setSendAsMessage] = useState(true)
    const [sendPush, setSendPush] = useState(true)

    if (!isOpen) return null

    const handleTemplateClick = (text: string) => {
        setContent(prev => prev ? `${prev}\n• ${text}` : `• ${text}`)
    }

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
            {/* Backdrop */}
            <div className="fixed inset-0" onClick={onClose} />

            {/* Modal Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative bg-background-light dark:bg-background-dark w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-primary/10 flex justify-between items-center bg-white dark:bg-background-dark">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg text-primary">
                            <span className="material-symbols-outlined text-2xl">medical_services</span>
                        </div>
                        <div>
                            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold font-display">Gửi lời khuyên chuyên môn</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">Bác sĩ gửi khuyến nghị sức khỏe trực tiếp cho bệnh nhân</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 space-y-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4ade8040 transparent' }}>
                    {/* Patient Info Section */}
                    <div className="bg-primary/5 rounded-lg p-4 flex items-center justify-between border border-primary/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                <img
                                    alt="Patient Avatar"
                                    className="w-full h-full object-cover"
                                    src={patientAvatar}
                                />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Bệnh nhân nhận</p>
                                <p className="text-slate-900 dark:text-slate-100 font-bold">{patientName}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Mã bệnh nhân</p>
                            <p className="text-primary font-mono font-bold">{patientId}</p>
                        </div>
                    </div>

                    {/* Selection Category */}
                    <div className="space-y-2">
                        <label className="text-slate-700 dark:text-slate-200 text-sm font-semibold flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-lg">category</span>
                            Danh mục lời khuyên
                        </label>
                        <select className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary">
                            <option value="">Chọn danh mục phù hợp...</option>
                            <option value="diet">Chế độ ăn uống</option>
                            <option value="exercise">Tập luyện thể chất</option>
                            <option value="habit">Thói quen sinh hoạt</option>
                            <option value="medication">Nhắc nhở dùng thuốc</option>
                        </select>
                    </div>

                    {/* Content Area */}
                    <div className="space-y-2">
                        <label className="text-slate-700 dark:text-slate-200 text-sm font-semibold flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-lg">edit_note</span>
                            Nội dung chi tiết
                        </label>
                        <textarea
                            className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary placeholder:text-slate-400"
                            placeholder="Nhập nội dung khuyến nghị cụ thể cho bệnh nhân..."
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    {/* Quick Templates */}
                    <div className="space-y-3">
                        <p className="text-slate-700 dark:text-slate-200 text-sm font-semibold flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
                            Thư viện lời khuyên mẫu
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_TEMPLATES.map((tpl) => (
                                <button
                                    key={tpl.label}
                                    type="button"
                                    onClick={() => handleTemplateClick(tpl.label)}
                                    className="px-3 py-1.5 rounded-full border border-primary/30 text-xs font-medium bg-primary/5 text-slate-700 dark:text-slate-300 hover:bg-primary hover:text-white transition-all flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">{tpl.icon}</span>
                                    {tpl.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-3 pt-2">
                        <p className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Tùy chọn gửi kèm theo</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer hover:border-primary/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={sendAsMessage}
                                    onChange={(e) => setSendAsMessage(e.target.checked)}
                                    className="rounded text-primary focus:ring-primary h-5 w-5"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Tin nhắn hệ thống</span>
                                    <span className="text-[10px] text-slate-500">Lưu vào hồ sơ bệnh án điện tử</span>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer hover:border-primary/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={sendPush}
                                    onChange={(e) => setSendPush(e.target.checked)}
                                    className="rounded text-primary focus:ring-primary h-5 w-5"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Thông báo Push</span>
                                    <span className="text-[10px] text-slate-500">Gửi trực tiếp đến ứng dụng di động</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">send</span>
                        Gửi ngay
                    </button>
                </div>
            </motion.div>
        </div>,
        document.body
    )
}
