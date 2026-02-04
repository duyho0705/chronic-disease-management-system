import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Users, UserPlus, ShieldCheck, ChevronRight, MoreVertical, Heart, Baby, UserCircle, X } from 'lucide-react'
import { useState } from 'react'

const RELATIVES = [
    { id: 1, name: 'Nguyễn Minh Anh', relation: 'Con trai', age: 6, avatar: 'MA', gender: 'Nam' },
    { id: 2, name: 'Trần Thị Hoa', relation: 'Mẹ', age: 62, avatar: 'TH', gender: 'Nữ' },
]

export default function PatientFamily() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    return (
        <div className="max-w-[1200px] mx-auto space-y-12 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200">
                            <Users className="w-8 h-8" />
                        </div>
                        Quản lý Người thân
                    </h1>
                    <p className="text-slate-500 font-medium text-lg ml-16">Chăm sóc sức khỏe cho cả gia đình bạn trong cùng một tài khoản.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
                >
                    <UserPlus className="w-5 h-5" />
                    Thêm người thân
                </button>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {RELATIVES.map((person, idx) => (
                    <motion.div
                        key={person.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Heart className="w-20 h-20 text-blue-600" />
                        </div>

                        <div className="flex items-center justify-between mb-8">
                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-xl font-black transition-all ${person.gender === 'Nam' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                                {person.avatar}
                            </div>
                            <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-1 mb-8">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{person.name}</h3>
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${person.gender === 'Nam' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>
                                    {person.gender}
                                </span>
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                {person.relation === 'Con trai' ? <Baby className="w-3 h-3" /> : <UserCircle className="w-3 h-3" />}
                                {person.relation} · {person.age} Tuổi
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                                Xem hồ sơ sức khỏe
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
                                Đặt lịch khám hộ
                            </button>
                        </div>
                    </motion.div>
                ))}

                {/* Empty State / Add Card */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center gap-4 group hover:bg-white hover:border-blue-300 transition-all"
                >
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-300 group-hover:text-blue-500 shadow-sm transition-all">
                        <Plus className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Thêm thành viên</p>
                        <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-tighter">Bố mẹ, vợ con hoặc người thân</p>
                    </div>
                </motion.button>
            </div>

            <section className="bg-white rounded-[3rem] p-10 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                    <ShieldCheck className="w-48 h-48" />
                </div>
                <div className="max-w-2xl relative z-10 space-y-6">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Tại sao nên thêm người thân?</h3>
                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <p className="text-sm font-black text-slate-900 tracking-tight">Đặt lịch nhanh chóng</p>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed italic">Không cần nhập lại thông tin mỗi lần đặt lịch khám cho trẻ em hoặc người lớn tuổi.</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-black text-slate-900 tracking-tight">Theo dõi tập trung</p>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed italic">Quản lý toàn bộ hồ sơ bệnh án, đơn thuốc và lịch sử tiêm chủng của gia đình tại một nơi.</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-black text-slate-900 tracking-tight">Nhận thông báo chung</p>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed italic">Nhận lời nhắc tiêm phòng hoặc tái khám cho người thân ngay trên điện thoại của bạn.</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-black text-slate-900 tracking-tight">Bảo mật thông tin</p>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed italic">Thông tin y khoa được mã hóa và bảo vệ theo tiêu chuẩn quốc gia.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Add Member Modal Placeholder */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[3rem] p-10 w-full max-w-md relative z-10 shadow-2xl text-center"
                        >
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-xl transition-all"
                            >
                                <X className="w-6 h-6 text-slate-300" />
                            </button>

                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                <UserPlus className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Thêm người thân</h3>
                            <p className="text-slate-500 font-medium text-sm mb-8">Tính năng này đang được cập nhật. Bạn sẽ có thể thêm thành viên gia đình sớm!</p>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-200"
                            >
                                Đã hiểu
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
