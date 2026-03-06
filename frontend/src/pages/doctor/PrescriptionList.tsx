import { useState } from 'react'
import { Link } from 'react-router-dom'

export function PrescriptionList() {
    const [searchTerm, setSearchTerm] = useState('')

    const prescriptions = [
        {
            id: '#RX-2024-001',
            patientName: 'Trần Anh Tú',
            initials: 'TT',
            date: '12/10/2024',
            diagnosis: 'Viêm họng cấp, sốt nhẹ',
            status: 'active',
            statusLabel: 'Đang dùng'
        },
        {
            id: '#RX-2024-002',
            patientName: 'Nguyễn Thị Hoa',
            initials: 'NH',
            date: '11/10/2024',
            diagnosis: 'Viêm xoang mãn tính',
            status: 'stopped',
            statusLabel: 'Đã ngưng'
        },
        {
            id: '#RX-2024-003',
            patientName: 'Lê Văn Vũ',
            initials: 'LV',
            date: '10/10/2024',
            diagnosis: 'Rối loạn tiêu hóa',
            status: 'active',
            statusLabel: 'Đang dùng'
        },
        {
            id: '#RX-2024-004',
            patientName: 'Phạm Văn Bình',
            initials: 'PV',
            date: '09/10/2024',
            diagnosis: 'Đau nhức cơ xương khớp',
            status: 'active',
            statusLabel: 'Đang dùng'
        }
    ]

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-primary/20 text-primary'
            case 'stopped':
                return 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
            default:
                return 'bg-slate-100 dark:bg-slate-800 text-slate-500'
        }
    }

    return (
        <div className="flex-1 p-8 space-y-6 animate-in fade-in duration-700 font-display transition-all">
            {/* Page Title & CTA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Quản lý đơn thuốc điện tử</h2>
                    <p className="text-slate-500 text-sm mt-1">Theo dõi và quản lý lịch sử kê đơn của bệnh nhân</p>
                </div>
                <Link
                    to="/consultation"
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <span className="material-symbols-outlined">add_notes</span>
                    <span>Kê đơn thuốc điện tử</span>
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Prescription List Section */}
                <div className="flex-1 space-y-4 min-w-0">
                    {/* Toolbar (Filters) */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4 shadow-sm">
                        <div className="flex-1 min-w-[240px]">
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 px-1 uppercase tracking-wider">Tìm kiếm đơn thuốc</label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] group-focus-within:text-primary transition-colors">search</span>
                                <input
                                    type="text"
                                    placeholder="Mã đơn, tên bệnh nhân..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold"
                                />
                            </div>
                        </div>
                        <div className="w-40">
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 px-1 uppercase tracking-wider">Trạng thái</label>
                            <div className="relative">
                                <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer font-semibold">
                                    <option>Tất cả</option>
                                    <option>Đang dùng</option>
                                    <option>Đã ngưng</option>
                                    <option>Hoàn thành</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
                            </div>
                        </div>
                        <div className="w-48">
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 px-1 uppercase tracking-wider">Thời gian</label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] group-focus-within:text-primary transition-colors">calendar_month</span>
                                <select className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer font-semibold">
                                    <option>7 ngày qua</option>
                                    <option>30 ngày qua</option>
                                    <option>Tháng này</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã đơn</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Bệnh nhân</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Chẩn đoán</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày kê</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Trạng thái</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {prescriptions.map((px) => (
                                        <tr key={px.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                            <td className="px-6 py-4 text-sm font-bold text-primary">{px.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-600 dark:text-slate-400">
                                                        {px.initials}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{px.patientName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{px.diagnosis}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{px.date}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusStyle(px.status)}`}>
                                                    {px.statusLabel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg text-slate-400 transition-all active:scale-90" title="Xem chi tiết">
                                                        <span className="material-symbols-outlined text-xl">visibility</span>
                                                    </button>
                                                    <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg text-slate-400 transition-all active:scale-90" title="In PDF">
                                                        <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                                                    </button>
                                                    <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg text-slate-400 transition-all active:scale-90" title="Tái bản đơn">
                                                        <span className="material-symbols-outlined text-xl">history_edu</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/10">
                            <p className="text-xs text-slate-500 font-medium italic">Hiển thị 4 trên 156 đơn thuốc</p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-white dark:hover:bg-slate-800 transition-all text-slate-500">Trước</button>
                                <button className="px-3 py-1.5 bg-primary text-slate-900 rounded-lg text-xs font-bold shadow-md shadow-primary/20 hover:scale-105 transition-all">1</button>
                                <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-white dark:hover:bg-slate-800 transition-all text-slate-500">2</button>
                                <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-white dark:hover:bg-slate-800 transition-all text-slate-500">Sau</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-full lg:w-80 space-y-6">
                    {/* Templates Card */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-black mb-4 flex items-center gap-2 text-slate-900 dark:text-white uppercase tracking-tight">
                            <span className="p-1.5 bg-primary/20 rounded-lg text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-[18px]">auto_stories</span>
                            </span>
                            Đơn thuốc mẫu phổ biến
                        </h3>
                        <div className="space-y-3">
                            {[
                                { title: 'Đơn thuốc cảm cúm cơ bản', desc: '3 thuốc - Phổ biến nhất' },
                                { title: 'Phác đồ Viêm dạ dày HP+', desc: '5 thuốc - Theo chuẩn Bộ Y tế' },
                                { title: 'Hỗ trợ hạ men gan', desc: '2 thuốc - Thực phẩm chức năng' }
                            ].map((template, idx) => (
                                <button
                                    key={idx}
                                    className="w-full text-left p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/50 hover:bg-primary/5 transition-all group active:scale-[0.98]"
                                >
                                    <p className="text-xs font-black text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">{template.title}</p>
                                    <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-widest">{template.desc}</p>
                                </button>
                            ))}
                            <button className="block w-full text-center text-xs font-black text-primary mt-4 hover:underline uppercase tracking-widest">
                                Xem thêm mẫu khác
                            </button>
                        </div>
                    </div>

                    {/* Recent History Card */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-black mb-4 flex items-center gap-2 text-slate-900 dark:text-white uppercase tracking-tight">
                            <span className="p-1.5 bg-primary/20 rounded-lg text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-[18px]">history</span>
                            </span>
                            Kê đơn gần đây
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Trần Anh Tú', time: '2 giờ trước' },
                                { name: 'Nguyễn Thị Hoa', time: '4 giờ trước' },
                                { name: 'Lê Văn Vũ', time: 'Hôm qua' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                                    <div className="size-2 mt-2 rounded-full bg-primary shrink-0 group-hover:scale-125 transition-transform shadow-sm shadow-primary/40"></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                                        <p className="text-[10px] text-slate-400 italic mt-0.5 font-medium">{item.time}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-300 self-center group-hover:translate-x-1 transition-transform text-sm">chevron_right</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


