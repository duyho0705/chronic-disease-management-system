import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

interface HistoryModalProps {
    isOpen: boolean
    onClose: () => void
    patientName?: string
}

export function HistoryModal({ isOpen, onClose, patientName = 'Nguyễn Văn A' }: HistoryModalProps) {
    if (!isOpen) return null

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 sm:p-6 overflow-hidden">
                <div className="fixed inset-0" onClick={onClose} />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden z-10"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-primary/10 flex items-center justify-between min-h-[73px]">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            Lịch sử khám bệnh - {patientName}
                        </h2>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors hover:text-red-500">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6 flex-1 overflow-y-auto w-full">
                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Tìm kiếm
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-2 bg-primary/5 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm"
                                        placeholder="Tìm kiếm chẩn đoán hoặc bác sĩ..."
                                        type="text"
                                    />
                                </div>
                            </div>
                            <div className="flex-none w-full md:w-auto">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Khoảng thời gian
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        className="bg-primary/5 dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                                        type="date"
                                    />
                                    <span className="text-slate-400">đến</span>
                                    <input
                                        className="bg-primary/5 dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                                        type="date"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="border border-primary/10 rounded-xl overflow-hidden w-full">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-primary/5 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                                        <th className="px-6 py-4">Ngày khám</th>
                                        <th className="px-6 py-4">Bác sĩ</th>
                                        <th className="px-6 py-4">Chẩn đoán</th>
                                        <th className="px-6 py-4">Hình thức</th>
                                        <th className="px-6 py-4 text-center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-primary/5 dark:divide-slate-800 w-full">
                                    {/* Row 1 */}
                                    <tr className="hover:bg-primary/5 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm">15/10/2023</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="size-8 rounded-full bg-primary/20 bg-cover bg-center"
                                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBjcXN-qRsLViGyn-0ors3YT1KZJhFM-K3iJUpP0-Mg3fZ0tu_O2thTG4ritCwEqpB72saarYhAueX6JVX0xqxG3Wbqy9Ztniab-6vnyEy_Bo5vE4LArGez9kdIFEf9rG7QmuiecxEnSfOgVdsAqLfzeNZco42wYUmXKRrtE6G82OaY-BttDFLrqcbPQJQ22mdMN8yscn3dr6_7QkGG6nuOL8m2lemRoimo6sJpTEY5Kx9qRNo2pF2Q3fuksWDs4zLNlQAcx7jnZ6o')" }}
                                                ></div>
                                                <span className="text-sm font-medium">BS. Trần Đức</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">Viêm họng cấp tính</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-[10px] font-bold">Online</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Xem chi tiết">
                                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                                </button>
                                                <button className="p-2 text-slate-400 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors" title="Tải xuống PDF">
                                                    <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Row 2 */}
                                    <tr className="hover:bg-primary/5 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm">02/09/2023</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="size-8 rounded-full bg-primary/20 bg-cover bg-center"
                                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGyzAG86KXz8QRPEZRrcMv0ZEjfpJfNaDZsfmz3WC8STjXwlOtrV8TB1ajSBf5JpkriYkkN_u1MnI6cqWXQajObxRBflSGsKAuwBCFP9sPr1v9Q8jO1zMP4gvprh3bDSpyCQBlYRjZUgHU08NBI283yjn0f-6NUduLRR4K4Xcv6N4UyJIRQnexRw1npeM05f3nI8wjYqVY1LaEfYih5Kx7SFd4fR4Tdk1z3AeWcxduPGaVjpONyfK_57qz3E3Ii_HKYOGcP3qXPhM')" }}
                                                ></div>
                                                <span className="text-sm font-medium">BS. Hoàng My</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">Kiểm tra tổng quát</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-[10px] font-bold">Trực tiếp</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                                </button>
                                                <button className="p-2 text-slate-400 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Row 3 */}
                                    <tr className="hover:bg-primary/5 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm">20/05/2023</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="size-8 rounded-full bg-primary/20 bg-cover bg-center"
                                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDo6bEXnkYfGTI9qEHIcUkGIa7D9c_FShlyDq7I9eQ5NrW0IUi0Mcx-LXqwL8_SZ1v8hBvP4A8zPwAKVzxf4NQ3MOVwlkL4n0bQBS5_xSWshHsnYDynuaXioev1TZSyDeaQEeHh1f82JsYmiAuCatUKkr9-4Sa5aBz0chZQhaz6oi8xPVG18u-Tcwvc31XvlpArR0kqw9h5uSri81gJR2_pfoZ7Hhf3sBYJr7lkAn1axx4c-76YVjNH9dBE3S9TgLBds4nUMxN0FD8')" }}
                                                ></div>
                                                <span className="text-sm font-medium">BS. Trần Đức</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">Viêm xoang nhẹ</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-[10px] font-bold">Trực tiếp</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                                </button>
                                                <button className="p-2 text-slate-400 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-end gap-3 bg-primary/5 dark:bg-slate-800/50 w-full">
                        <button onClick={onClose} className="w-full sm:w-auto px-6 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            Đóng
                        </button>
                        <button className="w-full sm:w-auto px-6 py-2 rounded-xl bg-primary text-slate-900 font-bold hover:brightness-105 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">add</span>
                            Tạo lượt khám mới
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    )
}
