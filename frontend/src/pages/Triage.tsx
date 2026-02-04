import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTenant } from '@/context/TenantContext'
import { getPatient, findPatientByCccd } from '@/api/patients'
import { suggestAcuity, createTriageSession } from '@/api/triage'
import type { VitalItem, ComplaintItem, TriageSessionDto } from '@/types/api'
import { toastService } from '@/services/toast'
import {
  Search,
  User,
  Activity,
  BrainCircuit,
  CheckCircle2,
  Thermometer,
  Heart,
  Wind,
  Droplets,
  Zap,
  MessageSquare,
  Save
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ACUITY_LEVELS = [
  { level: '1', label: 'Cấp cứu (Resuscitation)', color: 'bg-red-600', text: 'text-red-600' },
  { level: '2', label: 'Nguy kịch (Emergent)', color: 'bg-orange-500', text: 'text-orange-500' },
  { level: '3', label: 'Cấp bách (Urgent)', color: 'bg-amber-500', text: 'text-amber-500' },
  { level: '4', label: 'Ít cấp bách (Less Urgent)', color: 'bg-blue-500', text: 'text-blue-500' },
  { level: '5', label: 'Không cấp bách (Non-Urgent)', color: 'bg-slate-400', text: 'text-slate-400' },
]

const VITAL_CONFIG = [
  { type: 'TEMPERATURE', label: 'Nhiệt độ', unit: '°C', icon: Thermometer, color: 'text-orange-500' },
  { type: 'HEART_RATE', label: 'Nhịp tim', unit: 'bpm', icon: Heart, color: 'text-red-500' },
  { type: 'BLOOD_PRESSURE_SYSTOLIC', label: 'Huyết áp (Tâm thu)', unit: 'mmHg', icon: Activity, color: 'text-blue-500' },
  { type: 'BLOOD_PRESSURE_DIASTOLIC', label: 'Huyết áp (Tâm trương)', unit: 'mmHg', icon: Activity, color: 'text-blue-400' },
  { type: 'RESPIRATORY_RATE', label: 'Nhịp thở', unit: 'lần/phút', icon: Wind, color: 'text-emerald-500' },
  { type: 'SPO2', label: 'SpO2', unit: '%', icon: Droplets, color: 'text-blue-600' },
]

export function Triage() {
  const { headers, branchId } = useTenant()
  const queryClient = useQueryClient()
  const [patientId, setPatientId] = useState('')
  const [cccdSearch, setCccdSearch] = useState('')
  const [chiefComplaint, setChiefComplaint] = useState('')
  const [acuityLevel, setAcuityLevel] = useState<string>('3')
  const [suggestion, setSuggestion] = useState<{ suggestedAcuity: string; confidence: number; explanation?: string } | null>(null)
  const [vitals, setVitals] = useState<{ type: string; value: string; unit: string }[]>([])
  const [notes, setNotes] = useState('')
  const [overrideReason, setOverrideReason] = useState('')
  const [isSuggesting, setIsSuggesting] = useState(false)

  const { data: patient, isLoading: isSearching } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => getPatient(patientId, headers),
    enabled: !!patientId && !!headers?.tenantId,
  })

  const searchByCccd = async () => {
    if (!cccdSearch.trim() || !headers) return
    try {
      const p = await findPatientByCccd(cccdSearch.trim(), headers)
      if (p) {
        setPatientId(p.id)
        toastService.success(`Đã nhận diện: ${p.fullNameVi}`)
      } else {
        toastService.warning('Bệnh nhân chưa có trong hệ thống')
      }
    } catch (e) {
      toastService.error('Lỗi khi tìm kiếm bệnh nhân')
    }
  }

  const runSuggest = async () => {
    if (!headers?.tenantId) return
    setIsSuggesting(true)
    setSuggestion(null)
    try {
      const age = patient?.dateOfBirth
        ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
        : undefined
      const res = await suggestAcuity({
        chiefComplaintText: chiefComplaint.trim() || undefined,
        patientId: patientId || undefined,
        ageInYears: age,
        vitals: vitals.filter(v => v.value).map(v => ({
          vitalType: v.type,
          valueNumeric: parseFloat(v.value),
          unit: v.unit || undefined
        }))
      }, headers)

      setSuggestion(res)
      setAcuityLevel(res.suggestedAcuity)
      toastService.success('🤖 AI đã hoàn tất phân tích triệu chứng')
    } catch (e) {
      toastService.error('Không thể nhận phản hồi từ AI')
    } finally {
      setIsSuggesting(false)
    }
  }

  const createSession = useMutation<TriageSessionDto, Error, void>({
    mutationFn: () => {
      if (!headers?.tenantId || !branchId || !patientId) throw new Error('Thiếu thông tin bắt buộc')
      const vitalItems: VitalItem[] = vitals.filter(v => v.value).map(v => ({
        vitalType: v.type,
        valueNumeric: parseFloat(v.value),
        unit: v.unit || (VITAL_CONFIG.find(c => c.type === v.type)?.unit),
        recordedAt: new Date().toISOString()
      }))
      const complaints: ComplaintItem[] = chiefComplaint.trim()
        ? [{ complaintType: 'CHIEF', complaintText: chiefComplaint.trim(), displayOrder: 0 }]
        : []

      return createTriageSession({
        branchId,
        patientId,
        startedAt: new Date().toISOString(),
        acuityLevel,
        useAiSuggestion: !suggestion,
        aiSuggestedAcuity: suggestion?.suggestedAcuity,
        aiConfidenceScore: suggestion?.confidence,
        aiExplanation: suggestion?.explanation,
        acuitySource: suggestion ? 'AI' : 'HUMAN',
        chiefComplaintText: chiefComplaint.trim() || undefined,
        vitals: vitalItems.length ? vitalItems : undefined,
        complaints: complaints.length ? complaints : undefined,
        notes: notes.trim() || undefined,
        overrideReason: overrideReason.trim() || undefined
      }, headers)
    },
    onSuccess: () => {
      toastService.success('🚀 Đã gửi kết quả phân loại thành công!')
      queryClient.invalidateQueries({ queryKey: ['triage'] })
      resetForm()
    },
    onError: (e: Error) => toastService.error(e.message)
  })

  const resetForm = () => {
    setPatientId('')
    setCccdSearch('')
    setChiefComplaint('')
    setVitals([])
    setNotes('')
    setOverrideReason('')
    setSuggestion(null)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-100">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-100 text-white">
              <Activity className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tightest">Phân loại & Tiếp nhận</h1>
          </div>
          <p className="text-slate-500 font-medium ml-1">Khai thác triệu chứng, đo chỉ số sinh hiệu và xếp hàng chờ khám.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Form Entry */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-10">

          {/* Step 1: Patient Search */}
          <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 uppercase">Bước 1: Xác thực bệnh nhân</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="text"
                  placeholder="Quét mã QR hoặc nhập số CCCD/Passport..."
                  value={cccdSearch}
                  onChange={e => setCccdSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchByCccd()}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-3xl font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                />
              </div>
              <button
                onClick={searchByCccd}
                disabled={isSearching}
                className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSearching ? 'Đang tìm...' : 'Kiểm tra'}
              </button>
            </div>

            {patient && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex items-center gap-6 p-6 bg-blue-50 rounded-[2rem] border border-blue-100 shadow-inner"
              >
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black">
                  {patient.fullNameVi.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-slate-900 leading-none mb-2 uppercase">{patient.fullNameVi}</h3>
                  <div className="flex flex-wrap gap-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Năm sinh: {new Date(patient.dateOfBirth).getFullYear()}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SĐT: {patient.phone}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${patient.gender === 'MALE' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                      {patient.gender === 'MALE' ? 'NAM' : 'NỮ'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {patientId && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                {/* Step 2: Vitals & Symptoms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Signs & Vitals */}
                  <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                        <Heart className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-black text-slate-900 uppercase">Bước 2: Chỉ số sinh hiệu</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {VITAL_CONFIG.map(v => (
                        <div key={v.type} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
                          <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center ${v.color}`}>
                            <v.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">{v.label}</p>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="--"
                                value={vitals.find(vit => vit.type === v.type)?.value || ''}
                                onChange={e => {
                                  const val = e.target.value
                                  setVitals(prev => {
                                    const rest = prev.filter(vit => vit.type !== v.type)
                                    return val ? [...rest, { type: v.type, value: val, unit: v.unit }] : rest
                                  })
                                }}
                                className="w-20 bg-transparent font-black text-slate-900 focus:outline-none placeholder:text-slate-300"
                              />
                              <span className="text-xs font-bold text-slate-400">{v.unit}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Symptoms & AI */}
                  <div className="space-y-10">
                    <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <MessageSquare className="w-6 h-6" />
                          </div>
                          <h2 className="text-xl font-black uppercase tracking-tight">Bước 3: Triệu chứng</h2>
                        </div>
                        <button
                          onClick={runSuggest}
                          disabled={isSuggesting || !chiefComplaint.trim()}
                          className="p-4 bg-white/5 hover:bg-blue-600 rounded-2xl text-blue-400 hover:text-white transition-all disabled:opacity-20"
                        >
                          {isSuggesting ? <Zap className="w-6 h-6 animate-pulse" /> : <BrainCircuit className="w-6 h-6" />}
                        </button>
                      </div>

                      <textarea
                        placeholder="Nhập lý do nhập viện, các triệu chứng lâm sàng quan sát được..."
                        value={chiefComplaint}
                        onChange={e => setChiefComplaint(e.target.value)}
                        className="w-full h-44 bg-white/5 border border-white/5 rounded-3xl p-6 font-medium text-slate-200 outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all resize-none mb-4"
                      />

                      <div className="flex items-center gap-3 px-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Nhấn icon AI để phân tích ngay</p>
                      </div>
                    </div>

                    {/* AI Analysis Result */}
                    <AnimatePresence>
                      {suggestion && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-emerald-50 border-2 border-emerald-100 rounded-[3rem] p-8 shadow-xl shadow-emerald-200/20"
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <Zap className="w-5 h-5 text-emerald-600" />
                            <h3 className="text-sm font-black text-emerald-900 uppercase tracking-widest">Phân tích ưu tiên (AI)</h3>
                          </div>
                          <div className="flex items-center justify-between mb-6">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-emerald-600/60 uppercase">Mức độ đề xuất</p>
                              <p className="text-4xl font-black text-emerald-900 uppercase">LEVEL {suggestion.suggestedAcuity}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-black text-emerald-600">{(suggestion.confidence * 100).toFixed(0)}%</div>
                              <p className="text-[10px] font-bold text-emerald-900/40 uppercase">Confidence</p>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-emerald-800 leading-relaxed bg-white/40 p-5 rounded-3xl border border-emerald-200/50 italic">
                            "{suggestion.explanation}"
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Step 4: Finalize */}
                <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Chốt mức độ ưu tiên (ESI)</label>
                        <div className="flex flex-wrap gap-3">
                          {ACUITY_LEVELS.map(l => (
                            <button
                              key={l.level}
                              onClick={() => setAcuityLevel(l.level)}
                              className={`w-14 h-14 rounded-2xl font-black text-xl transition-all ${acuityLevel === l.level ? `${l.color} text-white shadow-xl scale-110` : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}
                            >
                              {l.level}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Lý do điều chỉnh (Nếu có)</label>
                        <input
                          type="text"
                          value={overrideReason}
                          onChange={e => setOverrideReason(e.target.value)}
                          placeholder="Ghi rõ lý do nếu bạn không theo gợi ý AI..."
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 outline-none focus:bg-slate-100"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-end gap-10">
                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-slate-900 uppercase">Tóm tắt quyết định</h4>
                        <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          Bệnh nhân: <span className="text-slate-900">{patient?.fullNameVi}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          Ưu tiên: <span className={ACUITY_LEVELS.find(l => l.level === acuityLevel)?.text}>{ACUITY_LEVELS.find(l => l.level === acuityLevel)?.label}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => createSession.mutate()}
                        disabled={createSession.isPending}
                        className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                      >
                        {createSession.isPending ? 'Đang khởi tạo...' : (
                          <>
                            <Save className="w-6 h-6" />
                            Xác nhận & Vào hàng chờ
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar: Active Queue info or Guide */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-10">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-blue-500">Hướng dẫn Phân loại</h3>
            <div className="space-y-6">
              {[
                { l: '1', d: 'Hồi sức cấp cứu, đe dọa tính mạng.' },
                { l: '2', d: 'Tình trạng nguy kịch, cần can thiệp ngay.' },
                { l: '3', d: 'Cần khám sớm nhưng chưa đe dọa mạng sống.' },
                { l: '4-5', d: 'Ổn định, có thể chờ hoặc chăm sóc ngoại trú.' },
              ].map(i => (
                <div key={i.l} className="flex gap-4 group">
                  <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-black text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">{i.l}</span>
                  <p className="text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors pt-1.5">{i.d}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 p-6 bg-white/5 rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">AI Note</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic">
                "Sử dụng AI Triage giúp giảm 40% thời gian phân loại và hạn chế sai sót do chủ quan."
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
            <h3 className="text-xs font-black uppercase tracking-widest mb-6 text-slate-400">Ghi chú lâm sàng khác</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full h-32 bg-slate-50 border-none rounded-3xl p-6 font-medium text-slate-600 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all resize-none"
              placeholder="Ghi thêm các quan sát khác ngoài triệu chứng chính..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
