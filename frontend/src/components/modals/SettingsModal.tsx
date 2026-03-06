import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
    User,
    Bell,
    Shield,
    Palette,
    X,
    Save,
    Camera,
    Check
} from 'lucide-react'

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
}

type Tab = 'profile' | 'notifications' | 'security' | 'interface'

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>('profile')

    const tabs = [
        { id: 'profile', label: 'Hồ sơ', icon: User },
        { id: 'notifications', label: 'Thông báo', icon: Bell },
        { id: 'security', label: 'Bảo mật', icon: Shield },
        { id: 'interface', label: 'Giao diện', icon: Palette },
    ]

    if (!isOpen) return null

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-slate-50 dark:bg-slate-950 rounded-xl w-full max-w-4xl h-[80vh] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] flex overflow-hidden border border-white/20 dark:border-slate-800 relative z-10"
                >
                    {/* Sidebar navigation inside modal */}
                    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-6">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Thiết lập</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cấu hình hệ thống</p>
                        </div>

                        <nav className="space-y-1.5 flex-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as Tab)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${activeTab === tab.id
                                        ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20'
                                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:translate-x-1'
                                        }`}
                                >
                                    <tab.icon className={`size-4 ${activeTab === tab.id ? 'stroke-[2.5px]' : ''}`} />
                                    <span className={`text-sm font-bold tracking-tight ${activeTab === tab.id ? '' : 'font-semibold'}`}>
                                        {tab.label}
                                    </span>
                                </button>
                            ))}
                        </nav>

                        <button
                            onClick={onClose}
                            className="mt-auto flex items-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all font-bold text-xs group"
                        >
                            <X className="size-4 group-hover:rotate-90 transition-transform duration-300" />
                            Đóng thiết lập
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950">
                        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="max-w-2xl mx-auto"
                                >
                                    {activeTab === 'profile' && <ProfileSettings />}
                                    {activeTab === 'notifications' && <NotificationSettings />}
                                    {activeTab === 'security' && <SecuritySettings />}
                                    {activeTab === 'interface' && <InterfaceSettings />}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Action Footer */}
                        <div className="p-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold hover:bg-white dark:hover:bg-slate-800 transition-all text-xs"
                            >
                                Hủy bỏ
                            </button>
                            <button className="px-6 py-2 rounded-lg bg-primary text-slate-900 font-bold shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 text-xs">
                                <Save className="size-3.5" />
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    )
}

function ProfileSettings() {
    return (
        <section className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Thông tin cá nhân</h2>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/5 shadow-sm space-y-8">
                <div className="flex items-center gap-6">
                    <div className="relative group cursor-pointer">
                        <div className="size-20 rounded-2xl overflow-hidden ring-2 ring-primary/10 shadow-xl transition-transform group-hover:scale-[1.02]">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuRBpLgHBDUQc-pBZeoNg7p5zyQhhWF0e0vOl1QrSZGoM8jsEmo5V8T5IKpxCoETrcB9m0yonrlwc5cTgeLd4GJ-EtIlbH2mbgZz3XY900jbDCLoPrnmU23ZVNw-4xXGTgftV-HaIe3mF_keVr1O92VDXOUR6xRD6cKx2JGXmoq61v566EK4ZPxvKxj-d2A1iybYsz5QwMjNknVLGSZVPG7x2CSpC81mIJtvMsvWKk8zp9Uzq22yOXgW0Gp9cxjT9AYlACWxGJcNY"
                                className="size-full object-cover"
                                alt="Avatar"
                            />
                        </div>
                        <div className="absolute -bottom-1.5 -right-1.5 bg-primary text-slate-900 p-1.5 rounded-lg shadow-xl border-2 border-white dark:border-slate-900 group-hover:rotate-12 transition-all">
                            <Camera className="size-3.5" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">BS. Lê Mạnh Hùng</h3>
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                            Bác sĩ chuyên khoa I
                            <span className="size-1 bg-primary rounded-full" />
                            ID: DOC-2024
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Tên bác sĩ</label>
                        <input
                            type="text"
                            defaultValue="BS. Lê Mạnh Hùng"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-primary/5 rounded-lg p-2.5 text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Chuyên khoa</label>
                        <select
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-primary/5 rounded-lg p-2.5 text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option>Nội tổng quát</option>
                            <option>Nhi khoa</option>
                            <option>Sản phụ khoa</option>
                            <option>Tim mạch</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Số điện thoại</label>
                        <input
                            type="tel"
                            defaultValue="0901 234 567"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-primary/5 rounded-lg p-2.5 text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Email công việc</label>
                        <input
                            type="email"
                            defaultValue="bs.vana@songkhoe.vn"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-primary/5 rounded-lg p-2.5 text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

function NotificationSettings() {
    return (
        <section className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Thông báo</h2>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/5 shadow-sm divide-y divide-primary/5">
                <NotificationToggle
                    title="Thông báo qua Email"
                    desc="Nhận báo cáo tổng hợp và lịch hẹn qua email"
                    active={true}
                />
                <NotificationToggle
                    title="Thông báo SMS"
                    desc="Thông báo khẩn cấp cho các ca trực tiếp"
                    active={false}
                />
                <NotificationToggle
                    title="Thông báo đẩy (Push)"
                    desc="Thông báo trực tiếp trên trình duyệt hoặc điện thoại"
                    active={true}
                />
            </div>
        </section>
    )
}

function NotificationToggle({ title, desc, active }: any) {
    const [isOn, setIsOn] = useState(active)
    return (
        <div className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="space-y-0.5">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
                <p className="text-[11px] text-slate-500 font-medium">{desc}</p>
            </div>
            <button
                onClick={() => setIsOn(!isOn)}
                className={`w-10 h-5 rounded-full transition-all relative ${isOn ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
                <motion.div
                    animate={{ x: isOn ? 22 : 2 }}
                    className="absolute top-0.5 size-4 bg-white rounded-full shadow-sm"
                />
            </button>
        </div>
    )
}

function SecuritySettings() {
    return (
        <section className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bảo mật</h2>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/5 shadow-sm space-y-8">
                <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Đổi mật khẩu</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <input
                            type="password"
                            placeholder="Mật khẩu hiện tại"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-primary/5 rounded-lg text-sm p-2.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu mới"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-primary/5 rounded-lg text-sm p-2.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu mới"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-primary/5 rounded-lg text-sm p-2.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="pt-5 border-t border-primary/5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Xác thực 2 yếu tố (2FA)</p>
                        <p className="text-[11px] text-slate-500 font-medium">Bảo vệ tài khoản bằng mã qua điện thoại</p>
                    </div>
                    <button className="px-4 py-1.5 bg-primary/20 text-slate-900 dark:text-primary font-bold rounded-lg text-xs hover:bg-primary/30 transition-colors">
                        Thiết lập
                    </button>
                </div>
            </div>
        </section>
    )
}

function InterfaceSettings() {
    const [theme, setTheme] = useState('light')
    return (
        <section className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Giao diện</h2>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/5 shadow-sm space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Chế độ hiển thị</label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setTheme('light')}
                                className={`flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${theme === 'light' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-2xl">light_mode</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Sáng</span>
                                {theme === 'light' && <Check className="size-3" />}
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${theme === 'dark' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-2xl">dark_mode</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Tối</span>
                                {theme === 'dark' && <Check className="size-3" />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Ngôn ngữ hệ thống</label>
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border border-primary/5 rounded-lg p-2.5 text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer">
                            <option>Tiếng Việt (Vietnam)</option>
                            <option>English (United States)</option>
                            <option>Français (France)</option>
                        </select>
                    </div>
                </div>
            </div>
        </section>
    )
}
