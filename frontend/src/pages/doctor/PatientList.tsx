import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PrescriptionModal } from '@/components/modals/PrescriptionModal'
import { AppointmentModal } from '@/components/modals/AppointmentModal'
import { ChevronDown, Plus } from 'lucide-react'

export function PatientList() {
    const navigate = useNavigate()
    const [selectedRisk, setSelectedRisk] = useState<string | null>(null)
    const [selectedDisease, setSelectedDisease] = useState('Tất cả loại bệnh')
    const [isDiseaseDropdownOpen, setIsDiseaseDropdownOpen] = useState(false)
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false)
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
    const [selectedPatientName, setSelectedPatientName] = useState('')

    const patients = [
        {
            id: 'BN0045',
            name: 'Nguyễn Văn A',
            age: 65,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiRKVD92JQaxCJX0Bz0NDDnDptEgsNny8cGM9GADc3TvIO12semUU0AjjnMDg_6MoU4fJaFHXep5xmfpi6n6BEAYGyEj7y3Zmjt53b4L7hC2ZeopQkuNu9eg7fn4_krSENGrF4kO-KRP6OHjQ02agIlHd0zvrvOy3cxaPZaPcHoZm3NpJOm52KRowsMwH3BGsD5I4ARD-5Tw2kDpTve8YLOtf9ZCxywMU4ydPPeOTM4Fw0D4RRMiVD0xLczoS-58s_-2LZv9BdJ5U',
            disease: 'Cao huyết áp',
            diseaseColor: 'bg-primary/10 text-primary border-primary/20',
            metrics: [
                { label: 'BP', value: '145/95', color: 'text-red-500', trend: 'trending_up' },
                { label: 'Glu', value: '5.8', color: 'text-slate-700 dark:text-slate-300' }
            ],
            status: 'Nguy cơ cao',
            statusColor: 'bg-red-100 text-red-700',
            dotColor: 'bg-red-600',
            pulse: true,
            time: '10:45 AM',
            date: 'Hôm nay'
        },
        {
            id: 'BN0122',
            name: 'Trần Thị B',
            age: 52,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-hCx2CKls0jIrMSYSVxmhzOeldUUIe9Z4UJJI7m3VyTlWLPqXl30OlBlAJ3_mk5VZm7DqW-oclNBCHssm7FJIVl6QNHjD75Sc_hqVsJ9wPDMTwBR2yoKT6q9dtSJbv6HEkCLK23MfTmLMZ4zprbC4RYJ7xS6gu1zK6wd0Y9N2zbVNGQFmdeuD6W83V5JMOBELbCSGLerqBtJle93QsTW_F-jams6d_ov83V2pMiY35BpXWtrQByHrBiCeE30lKJJYwzcuYs_Nv84',
            disease: 'Tiểu đường',
            diseaseColor: 'bg-blue-100 text-blue-600 border-blue-200',
            metrics: [
                { label: 'BP', value: '120/80', color: 'text-slate-700 dark:text-slate-300' },
                { label: 'Glu', value: '7.2', color: 'text-orange-500', trend: 'trending_up' }
            ],
            status: 'Cần theo dõi',
            statusColor: 'bg-orange-100 text-orange-700',
            dotColor: 'bg-orange-600',
            pulse: false,
            time: '16:20 PM',
            date: 'Hôm qua'
        },
        {
            id: 'BN0089',
            name: 'Lê Văn C',
            age: 40,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3K0Y7U5zMrVojk5xr3Z46lfVKTLHSv-qyWSMHatFHEOdt-K1n85JjAUxaBqRGRZB8bZq9_zk1OUVI2pv1yYNru0ZOJyPfjUPX1VIOLBNx3gEuWmm_8zrNWO9dzvVjgXAH2cjn88O1Rrh9QbUXaNv2PkKOKnjaLgoKWwhaG29mHgUsRygUMcczCu8QM_ix_tmrJtnEPL0uj3GhyZliMOQSqxcn-rJJFmQq2q7lHjbF7MOgdbaZT-xmXDzkU93aQRVjQ7SdrAHRGQo',
            disease: 'Tim mạch',
            diseaseColor: 'bg-purple-100 text-purple-600 border-purple-200',
            metrics: [
                { label: 'BP', value: '115/75', color: 'text-slate-700 dark:text-slate-300' },
                { label: 'SpO2', value: '98%', color: 'text-green-600' }
            ],
            status: 'Ổn định',
            statusColor: 'bg-green-100 text-green-700',
            dotColor: 'bg-green-600',
            pulse: false,
            time: '09:15 AM',
            date: '08/10/2023'
        },
        {
            id: 'BN0211',
            name: 'Phạm Thị D',
            age: 70,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCb3tWD-wPpTL7lbWMtmQLeQetTtLy06CCA5_8B6KD1W8-TZROoJ_Src_TC0ZQ9vlXZutkPWWud8VuHZSOvxaeagQefPQ86rMD_B4hFxsisCjAkWIC-FFSEilmpTbGO3MWpIKArkGwa6FfMVD1RMr7KtuHuzo_2NNBEKMKt1eTMtoq5IPB547A8l-4MAMvOGC5LvJ4duBSPKv81WghqZbdM4TzMJdt7hlVQOC3Qtte0Ow3WzGdY_nlRGUJFydOLjwjAgaR7-rRiNJg',
            disease: 'Đa bệnh lý',
            diseaseColor: 'bg-primary/10 text-primary border-primary/20',
            metrics: [
                { label: 'BP', value: '160/100', color: 'text-red-500', trend: 'warning' },
                { label: 'Glu', value: '12.5', color: 'text-red-500' }
            ],
            status: 'Nguy cơ cao',
            statusColor: 'bg-red-100 text-red-700',
            dotColor: 'bg-red-600',
            pulse: true,
            time: '01 phút trước',
            date: 'Vừa xong'
        }
    ]

    return (
        <div className="font-display bg-background-light dark:bg-background-dark p-8">
            {/* Filters Section */}
            <div className="flex flex-wrap items-center gap-6 mb-10">
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 dark:border-slate-800 mr-2">Mức độ nguy cơ:</span>
                    <div className="flex gap-2 pr-2">
                        <button
                            onClick={() => setSelectedRisk(selectedRisk === 'Nguy cơ cao' ? null : 'Nguy cơ cao')}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-tighter ${selectedRisk === 'Nguy cơ cao' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                        >
                            Nguy cơ cao
                        </button>
                        <button
                            onClick={() => setSelectedRisk(selectedRisk === 'Cần theo dõi' ? null : 'Cần theo dõi')}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-tighter ${selectedRisk === 'Cần theo dõi' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-amber-50 text-amber-500 hover:bg-amber-100'}`}
                        >
                            Cần theo dõi
                        </button>
                        <button
                            onClick={() => setSelectedRisk(selectedRisk === 'Bình thường' ? null : 'Bình thường')}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-tighter ${selectedRisk === 'Bình thường' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'}`}
                        >
                            Bình thường
                        </button>
                    </div>
                </div>

                <div className="relative group">
                    <button
                        onClick={() => setIsDiseaseDropdownOpen(!isDiseaseDropdownOpen)}
                        className="flex items-center gap-4 bg-white dark:bg-slate-900 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-primary transition-all cursor-pointer min-w-[240px]"
                    >
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Loại bệnh:</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 flex-1 text-left">{selectedDisease}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDiseaseDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isDiseaseDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl z-50 overflow-hidden py-1"
                            >
                                {['Tất cả loại bệnh', 'Tiểu đường', 'Cao huyết áp', 'Tim mạch', 'Bệnh thận', 'Phổi tắc nghẽn'].map((disease) => (
                                    <button
                                        key={disease}
                                        onClick={() => {
                                            setSelectedDisease(disease)
                                            setIsDiseaseDropdownOpen(false)
                                        }}
                                        className="w-full px-6 py-3 text-left hover:bg-primary/10 transition-colors flex items-center justify-between group/item"
                                    >
                                        <span className={`text-sm font-bold ${selectedDisease === disease ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>
                                            {disease}
                                        </span>
                                        {selectedDisease === disease && (
                                            <div className="size-2 bg-primary rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button className="ml-auto flex items-center gap-3 px-8 py-4 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95">
                    <Plus className="w-4 h-4" />
                    <span>Thêm bệnh nhân</span>
                </button>
            </div>

            {/* Patient Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Bệnh nhân</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Loại bệnh</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Chỉ số gần nhất</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cập nhật</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {patients.map((patient, idx) => (
                                <motion.tr
                                    key={patient.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                                    onClick={() => navigate(`/patients/${patient.id}/ehr`)}
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
                                                <img alt={patient.name} className="w-full h-full object-cover" src={patient.avatar} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{patient.name}</span>
                                                <span className="text-xs text-slate-500">ID: {patient.id} • {patient.age} tuổi</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${patient.diseaseColor}`}>
                                            {patient.disease}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            {patient.metrics.map((m, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs">
                                                    <span className="text-slate-500 w-8">{m.label}:</span>
                                                    <span className={`font-bold ${m.color}`}>{m.value}</span>
                                                    {m.trend && <span className={`material-symbols-outlined text-[10px] ${m.color}`}>{m.trend}</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${patient.statusColor} w-fit`}>
                                            <div className={`size-2 rounded-full ${patient.dotColor} ${patient.pulse ? 'animate-pulse' : ''}`}></div>
                                            <span className="text-xs font-bold uppercase tracking-wide">{patient.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{patient.time}</span>
                                            <span className="text-xs text-slate-400">{patient.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/20 hover:text-primary transition-all text-slate-500"
                                                title="Xem chi tiết"
                                                onClick={() => navigate(`/patients/${patient.id}/ehr`)}
                                            >
                                                <span className="material-symbols-outlined text-xl">visibility</span>
                                            </button>
                                            <button
                                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/20 hover:text-primary transition-all text-slate-500"
                                                title="Đặt lịch tái khám"
                                                onClick={() => {
                                                    setSelectedPatientName(patient.name)
                                                    setIsAppointmentModalOpen(true)
                                                }}
                                            >
                                                <span className="material-symbols-outlined text-xl">event_available</span>
                                            </button>
                                            <button
                                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/20 hover:text-primary transition-all text-slate-500"
                                                title="Nhắn tin"
                                                onClick={() => navigate('/chat')}
                                            >
                                                <span className="material-symbols-outlined text-xl">chat</span>
                                            </button>
                                            <button
                                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/20 hover:text-primary transition-all text-slate-500"
                                                title="Kê đơn thuốc điện tử"
                                                onClick={() => {
                                                    setSelectedPatientName(patient.name)
                                                    setIsPrescriptionModalOpen(true)
                                                }}
                                            >
                                                <span className="material-symbols-outlined text-xl">description</span>
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <p className="text-sm text-slate-500 font-medium">Hiển thị 1-4 trên 45 bệnh nhân</p>
                    <div className="flex items-center gap-1">
                        <button
                            className="size-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                            disabled
                        >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        <button className="size-8 rounded-lg flex items-center justify-center bg-primary text-white text-sm font-bold shadow-sm">1</button>
                        <button className="size-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold hover:bg-primary/10 text-slate-600 dark:text-slate-400 transition-colors">2</button>
                        <button className="size-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold hover:bg-primary/10 text-slate-600 dark:text-slate-400 transition-colors">3</button>
                        <span className="px-1 text-slate-400 font-bold">...</span>
                        <button className="size-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold hover:bg-primary/10 text-slate-600 dark:text-slate-400 transition-colors">12</button>
                        <button className="size-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 transition-colors">
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            <PrescriptionModal
                isOpen={isPrescriptionModalOpen}
                onClose={() => setIsPrescriptionModalOpen(false)}
                patientName={selectedPatientName}
            />

            <AppointmentModal
                isOpen={isAppointmentModalOpen}
                onClose={() => setIsAppointmentModalOpen(false)}
                patientName={selectedPatientName}
            />
        </div>
    )
}
