import {
    Users,
    Activity,
    ShieldCheck,
    UserPlus,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    Circle,
    MoreVertical,
    Search,
    Zap,
    Cpu,
    Filter
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export function ManagerDashboard() {
    const [searchTerm, setSearchTerm] = useState('')

    const stats = [
        {
            label: 'Tổng người dùng',
            value: '1,250',
            trend: '+12%',
            icon: Users,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100 dark:bg-emerald-900/30'
        },
        {
            label: 'Phiên hoạt động',
            value: '84',
            trend: '+5%',
            icon: Zap,
            color: 'text-purple-600',
            bg: 'bg-purple-100 dark:bg-purple-900/30'
        },
        {
            label: 'Trạng thái hệ thống',
            value: '99.9%',
            trend: 'Ổn định',
            icon: ShieldCheck,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100 dark:bg-emerald-900/30'
        }
    ]

    const users = [
        {
            name: 'Nguyễn Văn A',
            email: 'vana@hospital.vn',
            role: 'Quản trị viên',
            roleColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            status: 'Hoạt động',
            statusColor: 'bg-emerald-500',
            joined: '12/10/2023',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArzUHkVaUYsqNLybKMo5y2WYFzgq08-ZZkLF7B1Lgt8xJOXwRoegO7O_niMszu_rk7ETgs4ZhPoyi-px-gJmH0KUC9QAoX06EGkvVcHUg5xy4_hcl0c6vPRDf2ugLadcl6zt_434zmKjGDtuXms4axA_t9AU4AF957QBPUgDOmBsi6BT85Q8pePtKNeOr_-6bSexBz0t1XTnTaZRJj8yYgAX9hy47z7-0eY-slr4wqhmzG2YGUbxH21FK-JC6LiOdGd8gBxPOqmnM'
        },
        {
            name: 'Trần Thị B',
            email: 'thib@hospital.vn',
            role: 'Bác sĩ',
            roleColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
            status: 'Hoạt động',
            statusColor: 'bg-emerald-500',
            joined: '15/10/2023',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUZrr7LPadhzqYgW4RKCNHb2JUVQsdDOr8mTAlmEKYNbn2aqULrBQjv5zohzS4VhMBhCKGqE1wBdPi6ntLPwYcxjXoedPq80U1IZ6b6Ia_eBtcA5qL4WoYD2CUf44JsB1mjjfcIQK2pRMznEF9js4F4wmMQXwGa5qJF7w3YB0k6bOcgt8omH0zNqAKpFXpLrYZbUChaRA4TAHlXh0xNAQhaLeEVL_aXvPCSavc902-D05ai69R8vKfXgmKJa4wJ7h4qRvRvhmofHs'
        },
        {
            name: 'Lê Văn C',
            email: 'vanc@patient.vn',
            role: 'Bệnh nhân',
            roleColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400',
            status: 'Ngoại tuyến',
            statusColor: 'bg-slate-300 dark:bg-slate-600',
            joined: '20/10/2023',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUsRIZwauItU6naKL-TlulJndXroqZ22B3ph8FnWGcqEFGRZukVcICUyn-mPQM4kWKFmXg2bRdF1p_JDCuZZ_VmnB2UMsOz90U7tIGs-OHZDETJZgZpnfBHSJ5E1nrQ0EJmOGlbs6xLLh1-7fujAkOMsQLkNXi6zPnJEAUm8pem1XTHnGH6m7LmphXie26eSFBYscT2wejlysSXghWdnnbEdOlBZWDQFscwXGoigVnaAzumnJpIp6JG1NzQOBs3VzlMjQ-J9qieZ4'
        }
    ]

    const permissions = [
        { module: 'Hồ sơ bệnh án', admin: true, doctor: true, patient: false, staff: false },
        { module: 'Quản lý người dùng', admin: true, doctor: false, patient: false, staff: false },
        { module: 'Cấu hình hệ thống', admin: true, doctor: false, patient: false, staff: false },
        { module: 'Đặt lịch khám', admin: true, doctor: true, patient: true, staff: true }
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10 max-w-7xl mx-auto w-full">
            {/* Page Header (Optional in Dashboard but present in hihi.html header) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-600/20">
                        <Cpu className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tightest uppercase text-lg">
                            Quản lý hệ thống
                        </h1>
                        <p className="text-slate-500 font-bold text-sm">
                            Tổng quan trạng thái vận hành và phân quyền truy cập.
                        </p>
                    </div>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        className="w-full h-11 pl-10 pr-4 rounded-xl border-none bg-white dark:bg-slate-900 shadow-sm focus:ring-2 focus:ring-emerald-600/20 text-sm font-medium"
                        placeholder="Tìm kiếm hệ thống..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full ${stat.trend.includes('+') ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-500'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm font-black uppercase tracking-wider mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tightest">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* User List Table */}
            <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Danh sách người dùng</h2>
                        <p className="text-sm text-slate-400 font-bold mt-1">Quản lý tài khoản và vai trò truy cập</p>
                    </div>
                    <button className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
                        <UserPlus className="w-4 h-4" />
                        Thêm người dùng
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="px-8 py-4">Họ và tên</th>
                                <th className="px-8 py-4 text-center">Vai trò</th>
                                <th className="px-8 py-4 text-center">Trạng thái</th>
                                <th className="px-8 py-4 text-center">Ngày tham gia</th>
                                <th className="px-8 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {users.map((user, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                                                <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 dark:text-white tracking-tight">{user.name}</p>
                                                <p className="text-xs text-slate-400 font-bold">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${user.roleColor}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${user.statusColor} shadow-[0_0_8px_rgba(16,185,129,0.4)]`}></div>
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{user.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{user.joined}</td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="text-emerald-600 hover:text-emerald-700 font-black text-xs uppercase tracking-widest hover:underline transition-all">
                                            Chỉnh sửa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hiển thị 3 trên 1,250 kết quả</span>
                    <div className="flex gap-2">
                        <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 transition-all text-slate-400">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all text-slate-400">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Permission Matrix Area */}
            <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Ma trận quyền hạn</h2>
                    <p className="text-sm text-slate-400 font-bold mt-1">Phân định chi tiết quyền truy cập theo vai trò</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="px-8 py-4">Mô-đun chức năng</th>
                                <th className="px-8 py-4 text-center">Admin</th>
                                <th className="px-8 py-4 text-center">Bác sĩ</th>
                                <th className="px-8 py-4 text-center">Bệnh nhân</th>
                                <th className="px-8 py-4 text-center">Nhân viên</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {permissions.map((p, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-8 py-5 text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{p.module}</td>
                                    <td className="px-8 py-5 text-center">
                                        {p.admin ? <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /> : <Circle className="w-5 h-5 text-slate-100 dark:text-slate-800 mx-auto" />}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        {p.doctor ? <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /> : <Circle className="w-5 h-5 text-slate-100 dark:text-slate-800 mx-auto" />}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        {p.patient ? <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /> : <Circle className="w-5 h-5 text-slate-100 dark:text-slate-800 mx-auto" />}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        {p.staff ? <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /> : <Circle className="w-5 h-5 text-slate-100 dark:text-slate-800 mx-auto" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Information */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-50 dark:border-slate-800 opacity-60">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-600/10 text-emerald-600 p-2 rounded-lg">
                        <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ClinicManager System v2.0</span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">© 2023. Hệ thống quản lý bệnh mãn tính thông minh. Bảo mật 256-bit AES.</p>
            </div>
        </div>
    )
}
