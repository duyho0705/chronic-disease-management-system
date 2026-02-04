import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, User, Bot, Search, Video, Phone, MoreVertical, Paperclip, Smile, ShieldCheck, Clock } from 'lucide-react'

const DOCTORS = [
    { id: 1, name: 'BS. Nguyễn Thành Nam', specialty: 'Nội tổng quát', status: 'online', avatar: 'N' },
    { id: 2, name: 'BS. Lê Thị Mai', specialty: 'Nhi khoa', status: 'online', avatar: 'M' },
    { id: 3, name: 'BS. Trần Hoàng Quân', specialty: 'Tim mạch', status: 'offline', avatar: 'Q' },
]

export default function PatientChatDoctor() {
    const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0])
    const [message, setMessage] = useState('')
    const [chatHistory, setChatHistory] = useState([
        { role: 'doctor', text: 'Chào bạn, tôi là BS. Nam. Tôi có thể giúp gì cho tình trạng sức khỏe của bạn hiện tại?', time: '10:30 AM' },
        { role: 'patient', text: 'Chào bác sĩ, tôi hay bị đau đầu vào buổi sáng sau khi thức dậy.', time: '10:32 AM' },
        { role: 'doctor', text: 'Tình trạng này kéo dài lâu chưa bạn? Bạn có cảm thấy chóng mặt hay buồn nôn đi kèm không?', time: '10:35 AM' },
    ])

    const handleSend = () => {
        if (!message.trim()) return
        setChatHistory(prev => [...prev, { role: 'patient', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
        setMessage('')

        // Mock reply
        setTimeout(() => {
            setChatHistory(prev => [...prev, { role: 'doctor', text: 'Tôi đã ghi nhận thông tin. Bạn hãy thử theo dõi huyết áp trong 3 ngày tới và gửi kết quả cho tôi nhé.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
        }, 1500)
    }

    return (
        <div className="max-w-[1400px] mx-auto h-[calc(100vh-180px)] flex gap-8 pb-10">
            {/* Sidebar: Doctor List */}
            <aside className="w-[350px] bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col overflow-hidden">
                <div className="p-8 border-b border-slate-50 space-y-6">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bác sĩ tư vấn</h2>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm bác sĩ, chuyên khoa..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/10 border border-transparent focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {DOCTORS.map((doc) => (
                        <button
                            key={doc.id}
                            onClick={() => setSelectedDoctor(doc)}
                            className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all ${selectedDoctor.id === doc.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'hover:bg-slate-50'}`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black relative ${selectedDoctor.id === doc.id ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
                                {doc.avatar}
                                {doc.status === 'online' && (
                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                                )}
                            </div>
                            <div className="text-left">
                                <p className={`text-sm font-black ${selectedDoctor.id === doc.id ? 'text-white' : 'text-slate-900'}`}>{doc.name}</p>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedDoctor.id === doc.id ? 'text-blue-100/60' : 'text-slate-400'}`}>{doc.specialty}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="p-6 bg-slate-900 text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-xl">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security</p>
                            <p className="text-xs font-bold">Mã hóa đầu cuối</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Chat Area */}
            <main className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col overflow-hidden relative">
                {/* Chat Header */}
                <header className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl">
                            {selectedDoctor.avatar}
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900">{selectedDoctor.name}</h3>
                            <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${selectedDoctor.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {selectedDoctor.status === 'online' ? 'Đang trực tuyến' : 'Ngoại tuyến'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-blue-600">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-blue-600">
                            <Video className="w-5 h-5" />
                        </button>
                        <button className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-400">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Messages Panel */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
                    {chatHistory.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${m.role === 'patient' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[70%] space-y-1 ${m.role === 'patient' ? 'items-end' : 'items-start'}`}>
                                <div className={`p-5 rounded-[2rem] text-sm font-bold shadow-sm ${m.role === 'patient'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                                    }`}>
                                    {m.text}
                                </div>
                                <div className="flex items-center gap-2 px-2">
                                    <Clock className="w-2.5 h-2.5 text-slate-300" />
                                    <span className="text-[9px] font-bold text-slate-400 italic">{m.time}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Message Input Interface */}
                <footer className="p-6 bg-white border-t border-slate-50">
                    <div className="flex items-center gap-4 bg-slate-50 rounded-3xl p-2 pl-6 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:bg-white focus-within:border-blue-500 border border-transparent transition-all">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Nhập nội dung tư vấn..."
                            className="flex-1 bg-transparent py-4 text-xs font-bold outline-none text-slate-700"
                        />
                        <button className="text-slate-400 hover:text-blue-600 transition-colors">
                            <Smile className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSend}
                            className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </footer>
            </main>
        </div>
    )
}
