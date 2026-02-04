import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRevenueReport } from '@/api/admin'
import { useTenant } from '@/context/TenantContext'
import {
    BarChart3,
    TrendingUp,
    ArrowUpRight,
    DollarSign,
    Calendar,
    ArrowRight,
    SearchX
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts'

export function RevenueAnalytics() {
    const { branchId, headers } = useTenant()
    const [dateRange, setDateRange] = useState({
        from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
    })

    const { data: report, isLoading } = useQuery({
        queryKey: ['revenue-report', branchId, dateRange],
        queryFn: () => getRevenueReport(branchId || '', dateRange.from, dateRange.to),
        enabled: !!branchId && !!headers?.tenantId
    })

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
    }

    if (!branchId) return (
        <div className="flex flex-col items-center justify-center p-20 text-center">
            <SearchX className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="text-xl font-black text-slate-900">Vui lòng chọn chi nhánh</h3>
            <p className="text-slate-500 font-medium">Báo cáo doanh thu chỉ khả dụng cho từng chi nhánh cụ thể.</p>
        </div>
    )

    if (isLoading) return <div className="p-20 text-center font-bold text-slate-400">Đang phân tích dữ liệu...</div>

    const dailyData = report?.dailyRevenue?.map((d: any) => ({
        date: new Date(d.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        amount: d.amount
    })) || []

    const topServices = report?.topServices || []

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Filter Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">Bộ lọc Thời gian</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Từ {dateRange.from} đến {dateRange.to}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <input
                        type="date"
                        value={dateRange.from}
                        onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
                        className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                    />
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                    <input
                        type="date"
                        value={dateRange.to}
                        onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
                        className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                    />
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <TrendingUp className="w-32 h-32" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Tổng Doanh thu (Kỳ này)</p>
                    <h3 className="text-4xl font-black tracking-tighter mb-4">{formatCurrency(report?.totalRevenue || 0)}</h3>
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 w-fit px-3 py-1 rounded-full text-xs font-black">
                        <ArrowUpRight className="w-4 h-4" />
                        +14.5%
                        <span className="text-slate-400 font-medium ml-1">so với kỳ trước</span>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trung bình / Ngày</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                        {formatCurrency((report?.totalRevenue || 0) / (dailyData.length || 1))}
                    </h3>
                </div>

                <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dịch vụ Top 1</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 truncate tracking-tight uppercase">
                        {topServices[0]?.serviceName || 'N/A'}
                    </h3>
                    <p className="text-sm font-bold text-slate-400 mt-1">{topServices[0]?.count || 0} lượt sử dụng</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Revenue Chart */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                    <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                        Biểu đồ Doanh thu Ngày
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">(30 ngày qua)</span>
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2b8cee" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2b8cee" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                                    tickFormatter={(val: number) => `${(val / 1000000).toFixed(1)}M`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)', padding: '15px' }}
                                    formatter={(value: any) => [formatCurrency(value), 'Doanh thu']}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#2b8cee" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Services Chart */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                    <h3 className="text-xl font-black text-slate-900 mb-8">Dịch vụ Doanh thu cao nhất</h3>
                    <div className="space-y-6">
                        {topServices.slice(0, 5).map((s: any, idx: number) => {
                            const maxAmount = topServices[0]?.amount || 1
                            const percentage = (s.amount / maxAmount) * 100
                            return (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Top {idx + 1}</p>
                                            <p className="text-sm font-black text-slate-900 uppercase truncate max-w-[200px]">{s.serviceName}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-900">{formatCurrency(s.amount)}</p>
                                            <p className="text-[10px] font-bold text-slate-400">{s.count} lượt</p>
                                        </div>
                                    </div>
                                    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={`h-full rounded-full ${idx === 0 ? 'bg-blue-500' : 'bg-slate-300'}`}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
