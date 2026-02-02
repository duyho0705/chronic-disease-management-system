import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTenant } from '@/context/TenantContext'
import { listTenants, getBranches } from '@/api/tenants'
import { useQuery } from '@tanstack/react-query'
import { X, LogIn, Mail, Lock, Building2, MapPin, AlertCircle, Loader2, Stethoscope, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LoginRequest, TenantDto, TenantBranchDto } from '@/types/api'

interface LoginFormProps {
  onSuccess: () => void;
}

interface CustomSelectProps<T> {
  options: T[];
  value: string;
  onChange: (value: string) => void;
  labelKey: keyof T;
  valueKey: keyof T;
  placeholder: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

function CustomSelect<T>({ options, value, onChange, labelKey, valueKey, placeholder, icon, disabled }: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find(opt => String(opt[valueKey]) === value)

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between transition-all outline-none text-left
          ${isOpen ? 'ring-4 ring-[#2b8cee]/10 border-[#2b8cee] bg-white' : 'hover:border-slate-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
        <span className={`block truncate ${selectedOption ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
          {selectedOption ? String(selectedOption[labelKey]) : placeholder}
        </span>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.ul
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-50 mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 max-h-60 overflow-auto outline-none"
            >
              {options.length === 0 ? (
                <li className="px-4 py-8 text-center text-slate-400 text-sm italic">Không có dữ liệu</li>
              ) : (
                options.map((opt, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      onChange(String(opt[valueKey]))
                      setIsOpen(false)
                    }}
                    className={`px-4 py-3 text-sm cursor-pointer transition-colors flex items-center justify-between
                      ${String(opt[valueKey]) === value ? 'bg-[#2b8cee]/5 text-[#2b8cee] font-bold' : 'text-slate-600 hover:bg-slate-50'}
                    `}
                  >
                    {String(opt[labelKey])}
                    {String(opt[valueKey]) === value && <div className="w-1.5 h-1.5 rounded-full bg-[#2b8cee]" />}
                  </li>
                ))
              )}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function LoginForm({ onSuccess }: LoginFormProps) {
  const [step, setStep] = useState(1)
  const { login } = useAuth()
  const { setTenant } = useTenant()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [branchId, setBranchId] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: listTenants,
  })

  const { data: branches = [] } = useQuery({
    queryKey: ['branches', tenantId],
    queryFn: () => getBranches(tenantId),
    enabled: !!tenantId,
  })

  // Set default tenant if only one exists
  useEffect(() => {
    if (tenants.length === 1 && !tenantId) {
      setTenantId(tenants[0].id)
    }
  }, [tenants])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      if (!email || !password) {
        setError('Vui lòng nhập email và mật khẩu.')
        return
      }
      setStep(2)
      return
    }

    setError('')
    if (!tenantId) {
      setError('Vui lòng chọn phòng khám.')
      return
    }
    setSubmitting(true)
    try {
      const req: LoginRequest = {
        email: email.trim(),
        password,
        tenantId,
        branchId: branchId || undefined,
      }
      const res = await login(req)
      setTenant(res.user.tenantId, res.user.branchId ?? undefined)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại.')
      setStep(1) // Return to credentials if auth fails
    } finally {
      setSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  return (
    <div className="relative overflow-hidden">
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          {step === 1 ? (
            <motion.div
              key="step1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Tài khoản</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2b8cee] transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#2b8cee]/10 focus:border-[#2b8cee] focus:bg-white outline-none transition-all placeholder:text-slate-300 shadow-sm"
                    placeholder="admin@patientflow.vn"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Mật khẩu</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2b8cee] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#2b8cee]/10 focus:border-[#2b8cee] focus:bg-white outline-none transition-all placeholder:text-slate-300 shadow-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full group bg-[#2d3436] text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                >
                  Tiếp tục
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Phòng khám</label>
                <CustomSelect
                  options={tenants}
                  value={tenantId}
                  onChange={(val) => {
                    setTenantId(val)
                    setBranchId('')
                  }}
                  labelKey="nameVi"
                  valueKey="id"
                  placeholder="Chọn phòng khám"
                  icon={<Building2 className="w-5 h-5" />}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Chi nhánh</label>
                <CustomSelect
                  options={branches}
                  value={branchId}
                  onChange={setBranchId}
                  labelKey="nameVi"
                  valueKey="id"
                  disabled={!tenantId}
                  placeholder="Chọn chi nhánh (Tùy chọn)"
                  icon={<MapPin className="w-5 h-5" />}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-[1] bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all border border-slate-200"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] bg-[#2b8cee] text-white py-4 rounded-2xl font-bold hover:bg-[#2b8cee]/90 transition-all shadow-xl shadow-[#2b8cee]/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                  Đăng nhập
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="bg-slate-50/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Thông tin dùng thử</p>
          <p className="text-xs font-mono text-slate-500">
            Email: <span className="text-[#2b8cee]">admin@patientflow.vn</span><br />
            Pass: <span className="text-[#2b8cee]">password</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export function Login() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7f8] px-4 relative overflow-hidden">
      {/* Abstract Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#2b8cee]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white/50 relative overflow-hidden">
          <div className="text-center mb-10">
            <div className="inline-flex w-16 h-16 bg-[#2b8cee]/10 rounded-2xl items-center justify-center mb-6">
              <Stethoscope className="w-8 h-8 text-[#2b8cee]" />
            </div>
            <h1 className="text-3xl font-black text-[#2d3436] tracking-tight">ModernClinic</h1>
            <p className="text-slate-400 mt-2 font-medium">Hệ thống Phân loại Y tế AI</p>
          </div>
          <LoginForm onSuccess={() => navigate('/dashboard', { replace: true })} />
        </div>
      </motion.div>
    </div>
  )
}

export function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#2d3436]/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[440px] bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-10 pt-12">
              <div className="text-center mb-10">
                <div className="inline-flex w-14 h-14 bg-[#2b8cee]/10 rounded-2xl items-center justify-center mb-6">
                  <Stethoscope className="w-7 h-7 text-[#2b8cee]" />
                </div>
                <h2 className="text-3xl font-black text-[#2d3436] tracking-tight">Chào mừng trở lại</h2>
                <p className="text-slate-400 mt-2 font-medium">Đăng nhập để vào hệ thống quản lý</p>
              </div>

              <LoginForm onSuccess={() => {
                onClose()
                navigate('/dashboard', { replace: true })
              }} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
