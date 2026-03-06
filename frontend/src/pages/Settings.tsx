import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
    User,
    Mail,
    Phone,
    Bell,
    Shield,
    Palette,
    Globe,
    Save,
    X,
    Check
} from 'lucide-react'

type Tab = 'profile' | 'notifications' | 'security' | 'interface'

export default function Settings() {
    const [activeTab, setActiveTab] = useState<Tab>('profile')

    const tabs = [
        { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
        { id: 'notifications', label: 'Thông báo', icon: Bell },
        { id: 'security', label: 'Bảo mật', icon: Shield },
        { id: 'interface', label: 'Giao diện', icon: Palette },
    ]

    return (
        <div className="flex-1 bg-[#f8fafc]/50 dark:bg-transparent min-h-screen">
            <main className="max-w-5xl mx-auto px-8 py-10 space-y-8">
                {/* Header */}
                <header>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Cài đặt hệ thống</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        Quản lý thông tin cá nhân và cấu hình ứng dụng của bạn
                    </p>
                </header>

                {/* Tab Navigation */}
                <div className="border-b border-slate-200 dark:border-slate-800">
                    <nav className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab.id
                                    ? 'text-primary'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <tab.icon className="size-4" />
                                    <span>{tab.label}</span>
                                </div>
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                    />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Section */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'profile' && <ProfileSettings />}
                            {activeTab === 'notifications' && <NotificationSettings />}
                            {activeTab === 'security' && <SecuritySettings />}
                            {activeTab === 'interface' && <InterfaceSettings />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Action Footer */}
                <div className="pt-10 flex justify-end gap-4 border-t border-slate-100 dark:border-slate-800">
                    <button className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2">
                        <X className="size-4" />
                        Hủy bỏ
                    </button>
                    <button className="px-8 py-3 rounded-xl bg-primary text-slate-900 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                        <Save className="size-4" />
                        Lưu thay đổi
                    </button>
                </div>
            </main>
        </div>
    )
}

function ProfileSettings() {
    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Hồ sơ cá nhân</h2>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                <div className="flex items-center gap-6 pb-8 border-b border-slate-50 dark:border-slate-800/50">
                    <div className="size-24 rounded-2xl overflow-hidden ring-4 ring-primary/10 shadow-xl">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuRBpLgHBDUQc-pBZeoNg7p5zyQhhWF0e0vOl1QrSZGoM8jsEmo5V8T5IKpxCoETrcB9m0yonrlwc5cTgeLd4GJ-EtIlbH2mbgZz3XY900jbDCLoPrnmU23ZVNw-4xXGTgftV-HaIe3mF_keVr1O92VDXOUR6xRD6cKx2JGXmoq61v566EK4ZPxvKxj-d2A1iybYsz5QwMjNknVLGSZVPG7x2CSpC81mIJtvMsvWKk8zp9Uzq22yOXgW0Gp9cxjT9AYlACWxGJcNY"
                            className="size-full object-cover"
                            alt="Avatar"
                        />
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-black text-xl text-slate-900 dark:text-white">BS. Lê Mạnh Hùng</h4>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Bác sĩ chuyên khoa I</p>
                        <button className="text-primary text-xs font-black uppercase tracking-wider hover:underline">
                            Thay đổi ảnh đại diện
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Chủ đề chuyên môn</label>
                        <input
                            type="text"
                            defaultValue="Nội tổng quát, Tim mạch"
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Tên hiển thị</label>
                        <input
                            type="text"
                            defaultValue="BS. Lê Mạnh Hùng"
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Số điện thoại</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <input
                                type="tel"
                                defaultValue="0901 234 567"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Email công việc</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <input
                                type="email"
                                defaultValue="bs.vana@songkhoe.vn"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function NotificationSettings() {
    const [settings, setSettings] = useState({
        email: true,
        sms: false,
        push: true,
    })

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Thông báo</h2>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm divide-y divide-slate-50 dark:divide-slate-800/50">
                <NotificationItem
                    title="Thông báo qua Email"
                    description="Nhận báo cáo tổng hợp và lịch hẹn qua email"
                    active={settings.email}
                    onToggle={() => toggle('email')}
                />
                <NotificationItem
                    title="Thông báo SMS"
                    description="Thông báo khẩn cấp cho các ca trực tiếp"
                    active={settings.sms}
                    onToggle={() => toggle('sms')}
                />
                <NotificationItem
                    title="Thông báo đẩy (Push)"
                    description="Thông báo trực tiếp trên trình duyệt hoặc điện thoại"
                    active={settings.push}
                    onToggle={() => toggle('push')}
                />
            </div>
        </section>
    )
}

function NotificationItem({ title, description, active, onToggle }: any) {
    return (
        <div className="p-8 flex items-center justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
            <div className="space-y-1">
                <p className="font-black text-slate-900 dark:text-white">{title}</p>
                <p className="text-sm text-slate-500 font-medium">{description}</p>
            </div>
            <button
                onClick={onToggle}
                className={`w-14 h-8 rounded-full transition-all relative ${active ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
            >
                <motion.div
                    animate={{ x: active ? 24 : 4 }}
                    className="absolute top-1 size-6 bg-white rounded-full shadow-md shadow-black/5"
                />
            </button>
        </div>
    )
}

function SecuritySettings() {
    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bảo mật</h2>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Đổi mật khẩu</h3>
                    <div className="space-y-4">
                        <input
                            type="password"
                            placeholder="Mật khẩu hiện tại"
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu mới"
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                        />
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu mới"
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
                    <div>
                        <p className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                            Xác thực 2 yếu tố (2FA)
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[8px] font-black uppercase rounded-full">Khuyên dùng</span>
                        </p>
                        <p className="text-sm text-slate-500 font-medium mt-1">Bảo vệ tài khoản bằng mã xác nhận qua điện thoại</p>
                    </div>
                    <button className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95">
                        Thiết lập ngay
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Giao diện hử</h2>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Chế độ hiển thị</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => setTheme('light')}
                            className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${theme === 'light'
                                ? 'border-primary bg-primary/5'
                                : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'
                                }`}
                        >
                            <div className={`p-3 rounded-xl transition-colors ${theme === 'light' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                <Palette className="size-5" />
                            </div>
                            <div className="text-left">
                                <p className={`font-black text-sm ${theme === 'light' ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>Chế độ Sáng</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Mặc định hệ thống</p>
                            </div>
                            {theme === 'light' && <Check className="size-4 text-primary ml-auto" />}
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${theme === 'dark'
                                ? 'border-primary bg-primary/5'
                                : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'
                                }`}
                        >
                            <div className={`p-3 rounded-xl transition-colors ${theme === 'dark' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                <Globe className="size-5" />
                            </div>
                            <div className="text-left">
                                <p className={`font-black text-sm ${theme === 'dark' ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>Chế độ Tối</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Tiết kiệm năng lượng</p>
                            </div>
                            {theme === 'dark' && <Check className="size-4 text-primary ml-auto" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Ngôn ngữ chính</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
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
