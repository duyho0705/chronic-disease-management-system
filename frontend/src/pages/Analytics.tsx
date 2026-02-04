import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTenant } from '@/context/TenantContext'
import { getTodaySummary, getWeekSummary } from '@/api/analytics'
import { getRevenueReport } from '@/api/billing'
import {
    CheckCircle2,
    BrainCircuit,
    TrendingUp,
    BarChart3,
    Users2,
    LineChart as LineChartIcon,
    PieChart as PieChartIcon,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Timer,
    Sparkles
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts'

export function Analytics() {
    const { headers, branchId } = useTenant()
    const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d')

    const today = new Date().toISOString().split('T')[0]
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Summary Data
    const { data: todaySummary, isLoading: loadingToday } = useQuery<import('@/api/analytics').AnalyticsSummary>({
        queryKey: ['analytics', 'today', branchId],
        queryFn: () => getTodaySummary(branchId ?? undefined, headers),
        enabled: !!headers?.tenantId,
        refetchInterval: 60000,
    })

    // Revenue & Weekly Data
    const { data: revenueData, isLoading: loadingRevenue } = useQuery<import('@/types/api').RevenueReportDto>({
        queryKey: ['analytics', 'revenue', branchId, lastWeek, today],
        queryFn: () => getRevenueReport({ branchId: branchId!, from: lastWeek, to: today }, headers),
        enabled: !!branchId && !!headers?.tenantId,
    })

    const { data: weekSummary, isLoading: loadingWeek } = useQuery<import('@/api/analytics').AnalyticsSummary>({
        queryKey: ['analytics', 'week', branchId],
        queryFn: () => getWeekSummary(branchId ?? undefined, headers),
        enabled: !!headers?.tenantId,
    })

    if (loadingToday || loadingRevenue || loadingWeek) {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
                <div className="h-12 bg-slate-100 rounded-3xl w-1/4" />
                <div className="grid grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-100 rounded-[2.5rem]" />)}
                </div>
                <div className="h-[400px] bg-slate-100 rounded-[3rem]" />
            </div>
        )
    }

    const COLORS = ['#2b8cee', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-4 sm:p-8 max-w-7xl mx-auto space-y-10 pb-20"
        >
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-slate-100">
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                            <BarChart3 className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tightest">Hệ thống Phân tích</h1>
                            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Real-time Clinical Intelligence</p>
                        </div>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] gap-1">
                    {['7d', '30d'].map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range as any)}
                            className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${timeRange === range ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {range === '7d' ? '7 Ngày qua' : '30 Ngày qua'}
                        </button>
                    ))}
                </div>
            </header>

            {/* Top Metrics Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Doanh thu (Tuần)"
                    value={`${(revenueData?.totalRevenue || 0).toLocaleString('vi-VN')} đ`}
                    trend="+12.5%"
                    trendType="up"
                    icon={<DollarSign className="w-6 h-6" />}
                    color="#2b8cee"
                />
                <MetricCard
                    title="Lượt Phân loại"
                    value={todaySummary?.triageCount || 0}
                    trend={`${weekSummary?.avgPerDay || 0} / ngày`}
                    trendType="neutral"
                    icon={<Users2 className="w-6 h-6" />}
                    color="#8b5cf6"
                />
                <MetricCard
                    title="Đã Hoàn tất"
                    value={todaySummary?.completedCount || 0}
                    trend="88% Tỉ lệ xong"
                    trendType="up"
                    icon={<CheckCircle2 className="w-6 h-6" />}
                    color="#10b981"
                />
                <MetricCard
                    title="AI Match Rate"
                    value={`${todaySummary?.aiMatchRate || 0}%`}
                    trend={`${todaySummary?.totalAiCalls || 0} Calls`}
                    trendType="up"
                    icon={<BrainCircuit className="w-6 h-6" />}
                    color="#f59e0b"
                />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Revenue Evolution - Large Chart */}
                <motion.div variants={item} className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/40">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-2xl">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Biến động Doanh thu</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue performance over time</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData?.dailyRevenue}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2b8cee" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2b8cee" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                                    tickFormatter={(val) => new Date(val).toLocaleDateString('vi', { day: 'numeric', month: 'short' })}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                                    tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 900 }}
                                    formatter={(val: any) => [val?.toLocaleString('vi-VN') + ' đ', 'Doanh thu']}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#2b8cee" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Top Services - Distribution */}
                <motion.div variants={item} className="lg:col-span-1 bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/40 flex flex-col">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-emerald-50 rounded-2xl">
                            <PieChartIcon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Cơ cấu Dịch vụ</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue by Service type</p>
                        </div>
                    </div>

                    <div className="flex-1 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={revenueData?.topServices || []}
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="amount"
                                    nameKey="serviceName"
                                >
                                    {(revenueData?.topServices || []).map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* AI Auditor Deep Dive */}
            <motion.div
                variants={item}
                className="relative overflow-hidden group rounded-[4rem] border border-slate-900 bg-slate-900 p-12 text-white shadow-2xl shadow-slate-900/40"
            >
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000 pointer-events-none">
                    <BrainCircuit className="w-64 h-64" />
                </div>

                <div className="relative flex flex-col md:flex-row md:items-center gap-16">
                    <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                <Sparkles className="w-3 h-3" />
                                AI Auditor Insights
                            </div>
                            <h3 className="text-5xl font-black tracking-tightest leading-none">Hiệu suất Trí tuệ Nhân tạo</h3>
                            <p className="text-slate-400 font-medium text-lg max-w-xl">
                                Hệ thống AI đã hỗ trợ xử lý <span className="text-blue-400 font-black">{todaySummary?.totalAiCalls}</span> lượt bệnh nhân hôm nay, đạt tỉ lệ tương đồng <span className="text-emerald-400 font-black">{todaySummary?.aiMatchRate}%</span> với chỉ định của chuyên gia.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <SmallStat label="Tổng lượt AI" value={todaySummary?.totalAiCalls || 0} />
                            <SmallStat label="Match Rate" value={`${todaySummary?.aiMatchRate}%`} />
                            <SmallStat label="Time Saved" value="~42 hrs" />
                            <SmallStat label="Efficiency" value="+28%" />
                        </div>
                    </div>

                    <div className="w-full md:w-64 aspect-square bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 flex flex-col items-center justify-center p-8 text-center border-dashed">
                        <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                                <circle
                                    cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                                    strokeDasharray={364.4}
                                    strokeDashoffset={364.4 - (364.4 * (todaySummary?.aiMatchRate || 0)) / 100}
                                    className="text-blue-500"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-3xl font-black">{todaySummary?.aiMatchRate}%</div>
                        </div>
                        <p className="mt-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Confidence Score</p>
                    </div>
                </div>
            </motion.div>

            {/* Wait Time Analysis Mockup */}
            <motion.section variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                            <Timer className="w-6 h-6" />
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">Thời gian Chờ trung bình</h4>
                    </div>
                    {/* Simplified bar chart for wait times */}
                    <div className="space-y-6">
                        <WaitTimeRow label="Tiếp đón (Triage)" time="04:20" percent={40} color="#2b8cee" />
                        <WaitTimeRow label="Khám nội" time="12:15" percent={85} color="#ef4444" />
                        <WaitTimeRow label="Xét nghiệm" time="08:45" percent={60} color="#f59e0b" />
                        <WaitTimeRow label="Thu ngân" time="02:30" percent={25} color="#10b981" />
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                        <LineChartIcon className="w-10 h-10 text-slate-300" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">Phân tích chuyên sâu</h4>
                    <p className="text-slate-400 font-medium max-w-[280px] mt-2 mb-8 text-sm">Xuất báo cáo chi tiết theo định dạng Excel hoặc PDF để quản lý hiệu suất.</p>
                    <button className="bg-slate-900 text-white px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200">
                        Tải Báo cáo (CSV)
                    </button>
                </div>
            </motion.section>
        </motion.div>
    )
}

function MetricCard({ title, value, trend, trendType, icon, color }: any) {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-blue-50 transition-colors" />
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl mb-6 relative z-10`} style={{ backgroundColor: color }}>
                {icon}
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tightest mb-4 leading-none">{value}</p>
                <div className="flex items-center gap-2">
                    {trendType === 'up' && <ArrowUpRight className="w-4 h-4 text-emerald-500" />}
                    {trendType === 'down' && <ArrowDownRight className="w-4 h-4 text-red-500" />}
                    <span className={`text-[11px] font-black ${trendType === 'up' ? 'text-emerald-500' : trendType === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
                        {trend}
                    </span>
                </div>
            </div>
        </motion.div>
    )
}

function SmallStat({ label, value }: { label: string, value: string | number }) {
    return (
        <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">{label}</p>
            <p className="text-2xl font-black">{value}</p>
        </div>
    )
}

function WaitTimeRow({ label, time, percent, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-sm font-black text-slate-700 uppercase tracking-tighter">{label}</span>
                <span className="text-xl font-black text-slate-900 leading-none">{time}</span>
            </div>
            <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    className="h-full rounded-full shadow-inner"
                    style={{ backgroundColor: color }}
                />
            </div>
        </div>
    )
}
