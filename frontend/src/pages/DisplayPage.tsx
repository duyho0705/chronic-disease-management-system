import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getPublicDisplayData } from '@/api/public'
import { WebSocketService } from '@/services/websocket'
import { Volume2, Clock, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function DisplayPage() {
    const { branchId } = useParams()
    const queryClient = useQueryClient()
    const [time, setTime] = useState(new Date())
    const lastCalledRef = useRef<string | null>(null)

    const { data, isLoading } = useQuery({
        queryKey: ['public-display', branchId],
        queryFn: () => getPublicDisplayData(branchId!),
        enabled: !!branchId,
        refetchInterval: 30000, // Backup polling every 30s
    })

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        if (!branchId) return
        const ws = new WebSocketService((msg) => {
            if (msg.type === 'QUEUE_UPDATE' || msg.type === 'PATIENT_CALLED') {
                queryClient.invalidateQueries({ queryKey: ['public-display', branchId] })
                // Trigger sound if it's a new call
                if (msg.type === 'PATIENT_CALLED') {
                    playDingDong()
                }
            }
        })
        ws.connect()
        return () => ws.disconnect()
    }, [branchId, queryClient])

    // Play sound when the "Calling" list changes (new person at top)
    useEffect(() => {
        if (data?.calling?.[0]?.patientName && data.calling[0].patientName !== lastCalledRef.current) {
            lastCalledRef.current = data.calling[0].patientName
            playDingDong()
        }
    }, [data])

    const playDingDong = () => {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const osc = audioCtx.createOscillator()
        const gain = audioCtx.createGain()
        osc.connect(gain)
        gain.connect(audioCtx.destination)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime) // C5
        osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5) // A4
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1)
        osc.start()
        osc.stop(audioCtx.currentTime + 1)
    }

    if (isLoading) return <div className="bg-slate-900 h-screen flex items-center justify-center text-white">Đang tải màn hình...</div>

    return (
        <div className="h-screen w-screen bg-[#0f172a] text-white flex flex-col overflow-hidden font-sans">
            {/* Header */}
            <header className="h-24 bg-slate-800/50 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-12 shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="text-3xl font-black italic">PF</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-blue-400">Patient Flow</h1>
                        <p className="text-slate-400 font-bold flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> {data?.branchName}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="text-right">
                        <div className="text-4xl font-mono font-black text-white">
                            {time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                        <div className="text-slate-400 font-bold uppercase tracking-widest text-sm">
                            {time.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </div>
                    </div>
                    <Volume2 className="h-8 w-8 text-slate-500 animate-pulse" />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex p-8 gap-8">
                {/* Left: Calling Now (Dynamic) */}
                <section className="flex-1 space-y-6">
                    <h2 className="text-2xl font-black uppercase tracking-widest text-emerald-400 flex items-center gap-3">
                        <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                        ĐANG MỜI KHÁM (NOW CALLING)
                    </h2>

                    <div className="grid grid-cols-1 gap-6">
                        <AnimatePresence mode="popLayout">
                            {data?.calling?.length ? (
                                data.calling.map((entry, idx) => (
                                    <motion.div
                                        key={`${entry.patientName}-${idx}`}
                                        initial={{ x: -100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 100, opacity: 0 }}
                                        transition={{ type: 'spring', damping: 20 }}
                                        className={`flex items-center justify-between p-10 rounded-3xl border-2 ${idx === 0 ? 'bg-blue-600/20 border-blue-500 shadow-2xl shadow-blue-500/20' : 'bg-slate-800/30 border-slate-700'}`}
                                    >
                                        <div className="space-y-2">
                                            <span className="text-slate-400 font-bold uppercase text-xl tracking-widest">BỆNH NHÂN</span>
                                            <div className="text-7xl font-black text-white">{entry.patientName}</div>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <span className="text-slate-400 font-bold uppercase text-xl tracking-widest">TỚI PHÒNG</span>
                                            <div className={`text-7xl font-black ${idx === 0 ? 'text-blue-400' : 'text-emerald-400'}`}>{entry.queueName}</div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="h-64 flex items-center justify-center text-slate-600 text-3xl font-bold border-2 border-dashed border-slate-800 rounded-3xl italic">
                                    Đang chờ bác sĩ gọi...
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                {/* Right: Waiting List (Scrolling) */}
                <section className="w-1/3 bg-slate-900/50 rounded-3xl border border-slate-800 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Clock className="h-5 w-5" /> CHUẨN BỊ (UPCOMING)
                        </h2>
                        <span className="bg-slate-800 px-3 py-1 rounded text-sm font-bold text-slate-300">TOP 10</span>
                    </div>

                    <div className="flex-1 overflow-hidden p-6 space-y-4">
                        {data?.waiting?.map((entry, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={idx}
                                className="flex items-center justify-between p-5 bg-slate-800/30 rounded-2xl border border-slate-700/50"
                            >
                                <div>
                                    <div className="text-2xl font-bold text-slate-100">{entry.patientName}</div>
                                    <div className="text-sm font-bold text-slate-500 uppercase">{entry.queueName}</div>
                                </div>
                                {entry.acuityLevel && (
                                    <div className={`w-3 h-3 rounded-full ${entry.acuityLevel === 'RED' ? 'bg-red-500 box-shadow-red' :
                                            entry.acuityLevel === 'ORANGE' ? 'bg-orange-500' :
                                                entry.acuityLevel === 'YELLOW' ? 'bg-yellow-500' :
                                                    'bg-blue-500'
                                        }`} />
                                )}
                            </motion.div>
                        ))}
                        {(!data?.waiting || data.waiting.length === 0) && (
                            <p className="text-slate-600 text-center py-10 italic">Hết danh sách chờ</p>
                        )}
                    </div>

                    {/* Footer / Scrolling Marquee */}
                    <div className="bg-blue-600 p-4 overflow-hidden whitespace-nowrap">
                        <motion.div
                            animate={{ x: [1000, -2000] }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="text-xl font-bold italic"
                        >
                            QUÝ KHÁCH VUI LÒNG THEO DÕI MÀN HÌNH VÀ CHUẨN BỊ SẴN GIẤY TỜ TRƯỚC KHI VÀO PHÒNG KHÁM. CHÚC QUÝ KHÁCH MỘT NGÀY TỐT LÀNH!
                        </motion.div>
                    </div>
                </section>
            </main>
            <style>{`
        .box-shadow-red { box-shadow: 0 0 15px rgba(239, 68, 68, 0.6); }
      `}</style>
        </div>
    )
}
