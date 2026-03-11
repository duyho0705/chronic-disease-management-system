import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTenant } from '@/context/TenantContext'
import { listTenants } from '@/api/tenants'
import { useQuery } from '@tanstack/react-query'
import {
  X, AlertCircle, Loader2, ShieldCheck, CheckCircle2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RegisterRequest } from '@/api-client'
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/firebase'
import { ERROR_CODES } from '@/constants'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { EnterpriseErrorUtils } from '@/utils/errors'

/* ─────────── helper ─────────── */

function getPasswordStrength(pw: string) {
  if (!pw) return { level: 0, label: '', color: 'transparent' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 2) return { level: 1, label: 'Yếu', color: '#ef4444' }
  if (score <= 3) return { level: 2, label: 'Trung bình', color: '#f59e0b' }
  if (score <= 4) return { level: 3, label: 'Mạnh', color: '#22c55e' }
  return { level: 4, label: 'Rất mạnh', color: '#059669' }
}

/* ─────────── Components ─────────── */

interface FormFieldProps {
  label: string
  icon: string
  error?: string
  touched?: boolean
  children: React.ReactNode
  className?: string
}

function FormField({ label, icon, error, touched, children, className = "" }: FormFieldProps) {
  const isInvalid = !!(error && touched)

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className={`text-slate-700 dark:text-slate-300 text-[13px] font-semibold px-1 transition-colors ${isInvalid ? 'text-red-500' : ''}`}>
        {label}
      </label>
      <div className="relative group">
        <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors ${isInvalid ? 'text-red-400' : 'text-slate-400 group-focus-within:text-primary'}`}>
          {icon}
        </span>
        {children}
      </div>
      <AnimatePresence>
        {isInvalid && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-[11px] text-red-500 font-medium px-1 mt-0.5"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function SocialButton({ icon, label, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-3 h-12 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-800 shadow-sm"
    >
      {icon}
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
    </button>
  )
}

/* ═══════════════════════════════════════
   LoginForm — core logic for both page/modal
   ═══════════════════════════════════════ */

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: { pathname?: string; search?: string }
  initialFirebaseToken?: string
  mode: 'login' | 'register'
  setMode: (m: 'login' | 'register') => void
  onStepChange?: (step: number) => void
}

function LoginForm({ onSuccess, redirectTo, initialFirebaseToken, mode, setMode, onStepChange }: LoginFormProps) {
  const [step, setStep] = useState(initialFirebaseToken ? 2 : 1)
  const { login, register, socialLogin } = useAuth()
  const { setTenant } = useTenant()
  const navigation = useAppNavigation()

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullNameVi, setFullNameVi] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [tenantId, setTenantId] = useState('')

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [firebaseIdToken, setFirebaseIdToken] = useState<string | null>(initialFirebaseToken || null)

  const { data: tenants = [] } = useQuery({ queryKey: ['tenants'], queryFn: listTenants })

  useEffect(() => {
    if (initialFirebaseToken) {
      setFirebaseIdToken(initialFirebaseToken)
      setStep(2)
    }
  }, [initialFirebaseToken])

  useEffect(() => {
    onStepChange?.(step)
  }, [step, onStepChange])

  const pwStrength = useMemo(() => getPasswordStrength(password), [password])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    // Email
    if (!email) newErrors.email = 'Vui lòng nhập email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email không hợp lệ'

    // Password
    if (!password) newErrors.password = 'Vui lòng nhập mật khẩu'
    else if (mode === 'register' && password.length < 8) newErrors.password = 'Mật khẩu phải ít nhất 8 ký tự'

    if (mode === 'register') {
      if (!fullNameVi.trim()) newErrors.fullName = 'Vui lòng nhập họ tên'
      else if (fullNameVi.trim().split(' ').length < 2) newErrors.fullName = 'Vui lòng nhập đầy đủ họ tên'

      if (!phoneNumber) newErrors.phone = 'Vui lòng nhập số điện thoại'
      else if (!/^\d{10,11}$/.test(phoneNumber.replace(/\s/g, ''))) newErrors.phone = 'Số điện thoại không hợp lệ'

      if (password !== confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp'
    }

    setFieldErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validate()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Mark all as touched
    const allTouched: Record<string, boolean> = { email: true, password: true }
    if (mode === 'register') {
      allTouched.fullName = true
      allTouched.phone = true
      allTouched.confirmPassword = true
    }
    setTouched(allTouched)

    if (!firebaseIdToken && !validate()) return

    if (step === 1 && mode === 'register' && !firebaseIdToken) {
      setStep(2)
      return
    }

    setSubmitting(true)
    try {
      let res;
      if (firebaseIdToken) {
        res = await socialLogin({ idToken: firebaseIdToken, tenantId: tenantId || undefined, branchId: undefined })
      } else {
        if (mode === 'register') {
          if (!tenantId) { setError('Vui lòng chọn một cơ sở y tế.'); return }
          const req: RegisterRequest = { email: email.trim(), password, fullNameVi: fullNameVi.trim(), tenantId, branchId: undefined }
          res = await register(req)
        } else {
          res = await login({ email: email.trim(), password, tenantId: tenantId || undefined, branchId: undefined })
        }
      }

      if (!res?.user) {
        throw new Error("Không lấy được thông tin người dùng")
      }
      setTenant(res.user.tenantId || null, res.user.branchId || undefined)
      navigation.navigateAfterLogin(res.user as any, redirectTo?.pathname)
      onSuccess?.()
    } catch (err: any) {
      setError(EnterpriseErrorUtils.getMessage(err))
      if (err.errorCode === ERROR_CODES.AUTH_TENANT_REQUIRED) {
        setStep(2)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleSocialLogin = async (providerName: 'google' | 'facebook') => {
    setError('')
    try {
      const provider = providerName === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider()
      const result = await signInWithPopup(auth, provider)
      if (result.user) {
        const token = await result.user.getIdToken()
        setFirebaseIdToken(token)
        setStep(2)
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') return
      setError(`Lỗi đăng nhập ${providerName}: ${err.message}`)
    }
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setStep(1)
    setError('')
    setFieldErrors({})
    setTouched({})
    setFirebaseIdToken(null)
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-2 mb-8 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                {mode === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
                {mode === 'login'
                  ? 'Đăng nhập vào tài khoản Sống Khỏe của bạn'
                  : 'Tham gia cộng đồng Sống Khỏe để quản lý sức khỏe tốt hơn mỗi ngày'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {mode === 'register' ? (
                /* Compact Register Layout */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                  <FormField label="Họ và tên" icon="person" error={fieldErrors.fullName} touched={touched.fullName}>
                    <input
                      type="text"
                      value={fullNameVi}
                      onBlur={() => handleBlur('fullName')}
                      onChange={e => { setFullNameVi(e.target.value); if (touched.fullName) validate() }}
                      className={`form-input flex w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 h-12 pl-12 pr-4 text-sm focus:border-primary focus:ring-primary/20 dark:text-white placeholder:text-slate-400 transition-all outline-none ${fieldErrors.fullName && touched.fullName ? 'border-red-300 ring-red-100 ring-4' : ''}`}
                      placeholder="Nguyễn Văn A"
                    />
                  </FormField>

                  <FormField label="Số điện thoại" icon="call" error={fieldErrors.phone} touched={touched.phone}>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onBlur={() => handleBlur('phone')}
                      onChange={e => { setPhoneNumber(e.target.value); if (touched.phone) validate() }}
                      className={`form-input flex w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 h-12 pl-12 pr-4 text-sm focus:border-primary focus:ring-primary/20 dark:text-white placeholder:text-slate-400 transition-all outline-none ${fieldErrors.phone && touched.phone ? 'border-red-300 ring-red-100 ring-4' : ''}`}
                      placeholder="090 123 4567"
                    />
                  </FormField>

                  <FormField label="Email" icon="mail" error={fieldErrors.email} touched={touched.email} className="md:col-span-2">
                    <input
                      type="email"
                      value={email}
                      onBlur={() => handleBlur('email')}
                      onChange={e => { setEmail(e.target.value); if (touched.email) validate() }}
                      className={`form-input flex w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 h-12 pl-12 pr-4 text-sm focus:border-primary focus:ring-primary/20 dark:text-white placeholder:text-slate-400 transition-all outline-none ${fieldErrors.email && touched.email ? 'border-red-300 ring-red-100 ring-4' : ''}`}
                      placeholder="example@gmail.com"
                      required
                    />
                  </FormField>

                  <FormField label="Mật khẩu" icon="lock" error={fieldErrors.password} touched={touched.password}>
                    <>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onBlur={() => handleBlur('password')}
                        onChange={e => { setPassword(e.target.value); if (touched.password) validate() }}
                        className={`form-input flex w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 h-12 pl-12 pr-12 text-sm focus:border-primary focus:ring-primary/20 dark:text-white placeholder:text-slate-400 transition-all outline-none ${fieldErrors.password && touched.password ? 'border-red-300 ring-red-100 ring-4' : ''}`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                      {password && mode === 'register' && (
                        <div className="absolute -bottom-1.5 left-0 w-full px-1">
                          <div className="flex gap-1 h-0.5 w-full">
                            {[1, 2, 3, 4].map(s => (
                              <div key={s} className={`flex-1 rounded-full transition-colors ${s <= pwStrength.level ? '' : 'bg-slate-200 dark:bg-slate-700'}`} style={{ backgroundColor: s <= pwStrength.level ? pwStrength.color : undefined }} />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  </FormField>

                  <FormField label="Xác nhận" icon="lock_reset" error={fieldErrors.confirmPassword} touched={touched.confirmPassword}>
                    <input
                      type="password"
                      value={confirmPassword}
                      onBlur={() => handleBlur('confirmPassword')}
                      onChange={e => { setConfirmPassword(e.target.value); if (touched.confirmPassword) validate() }}
                      className={`form-input flex w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 h-12 pl-12 pr-4 text-sm focus:border-primary focus:ring-primary/20 dark:text-white placeholder:text-slate-400 transition-all outline-none ${fieldErrors.confirmPassword && touched.confirmPassword ? 'border-red-300 ring-red-100 ring-4' : ''}`}
                      placeholder="••••••••"
                      required
                    />
                  </FormField>
                </div>
              ) : (
                /* Login Layout remains clean but with validation support */
                <div className="flex flex-col gap-4">
                  <FormField label="Email" icon="mail" error={fieldErrors.email} touched={touched.email}>
                    <input
                      type="email"
                      value={email}
                      onBlur={() => handleBlur('email')}
                      onChange={e => { setEmail(e.target.value); if (touched.email) validate() }}
                      className={`form-input flex w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 h-14 pl-12 pr-4 text-base focus:border-primary focus:ring-primary/20 dark:text-white placeholder:text-slate-400 transition-all outline-none ${fieldErrors.email && touched.email ? 'border-red-300 ring-red-100 ring-4' : ''}`}
                      placeholder="example@gmail.com"
                      required
                    />
                  </FormField>

                  <FormField label="Mật khẩu" icon="lock" error={fieldErrors.password} touched={touched.password}>
                    <div className="w-full relative">
                      <div className="absolute -top-[30px] right-1">
                        <button type="button" className="text-primary text-xs font-bold hover:underline">Quên mật khẩu?</button>
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onBlur={() => handleBlur('password')}
                        onChange={e => { setPassword(e.target.value); if (touched.password) validate() }}
                        className={`form-input flex w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 h-14 pl-12 pr-12 text-base focus:border-primary focus:ring-primary/20 dark:text-white placeholder:text-slate-400 transition-all outline-none ${fieldErrors.password && touched.password ? 'border-red-300 ring-red-100 ring-4' : ''}`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </FormField>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex items-center gap-2 px-1">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded text-primary focus:ring-primary border-primary/30 size-4 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none">Duy trì đăng nhập</label>
                </div>
              )}

              {mode === 'register' && (
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="terms" className="mt-1 rounded text-primary focus:ring-primary bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer" required />
                  <label htmlFor="terms" className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight cursor-pointer select-none">
                    Tôi đồng ý với <Link to="#" className="text-primary hover:underline font-semibold">Điều khoản dịch vụ</Link> và <Link to="#" className="text-primary hover:underline font-semibold">Chính sách bảo mật</Link>.
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={`w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 ${mode === 'register' ? 'h-12 text-base shadow-md shadow-primary/10' : 'h-14 text-lg shadow-lg shadow-primary/20'}`}
              >
                {submitting ? <Loader2 className="size-5 animate-spin" /> : <span>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký ngay'}</span>}
                {mode === 'register' && !submitting && <span className="material-symbols-outlined">arrow_forward</span>}
              </button>
            </form>

            <div className={`relative ${mode === 'register' ? 'my-4' : 'my-8'}`}>
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
              <div className="relative flex justify-center text-[11px] font-bold uppercase tracking-widest"><span className="bg-white dark:bg-slate-900 px-4 text-slate-400 font-bold uppercase">Hoặc</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SocialButton
                icon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M12 5.04c1.9 0 3.51.64 4.85 1.91l3.62-3.62C18.23 1.33 15.35 0 12 0 7.31 0 3.32 2.68 1.41 6.59l4.23 3.29C6.64 7.08 9.09 5.04 12 5.04z" fill="#EA4335"></path>
                    <path d="M23.49 12.27c0-.85-.07-1.68-.21-2.48H12v4.69h6.44c-.28 1.51-1.13 2.79-2.41 3.65l3.86 2.99c2.26-2.09 3.6-5.17 3.6-8.85z" fill="#4285F4"></path>
                    <path d="M5.64 14.86c-.24-.72-.37-1.49-.37-2.3s.13-1.58.37-2.3L1.41 6.59C.51 8.24 0 10.06 0 12s.51 3.76 1.41 5.41l4.23-3.29z" fill="#FBBC05"></path>
                    <path d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.86-2.99c-1.1.74-2.51 1.18-4.09 1.18-2.91 0-5.36-2.04-6.25-4.81l-4.23 3.29C3.32 21.32 7.31 24 12 24z" fill="#34A853"></path>
                  </svg>
                }
                label="Google"
                onClick={() => handleSocialLogin('google')}
              />
              <SocialButton
                icon={
                  <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                  </svg>
                }
                label="Facebook"
                onClick={() => handleSocialLogin('facebook')}
              />
            </div>

            <p className={`mt-6 text-center text-slate-500 dark:text-slate-400 text-sm ${mode === 'register' ? 'mt-4' : 'mt-8'}`}>
              {mode === 'login' ? 'Chưa có tài khoản?' : 'Bạn đã tham gia Sống Khỏe?'}
              <button
                type="button"
                onClick={switchMode}
                className="text-primary font-bold hover:underline ml-1"
              >
                {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
              </button>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-6"
          >
            <div className="flex flex-col gap-2 mb-8 text-center md:text-left">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Chọn cơ sở y tế</h1>
              <p className="text-slate-500 font-medium text-sm">Vui lòng chọn phòng khám bạn muốn tham gia</p>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {tenants.map((t: any) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTenantId(t.id)}
                  className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 text-left ${tenantId === t.id
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5'
                    : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white dark:border-slate-800 dark:bg-slate-800/30'
                    }`}
                >
                  <div className={`size-12 rounded-xl flex items-center justify-center transition-colors ${tenantId === t.id ? 'bg-primary text-white' : 'bg-white dark:bg-slate-700 text-slate-400'
                    }`}>
                    <span className="material-symbols-outlined">health_and_safety</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.nameVi}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.code}</p>
                  </div>
                  {tenantId === t.id && (
                    <CheckCircle2 className="size-6 text-primary" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-6 flex flex-col gap-3">
              <button
                onClick={handleSubmit}
                disabled={!tenantId || submitting}
                className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="size-5 animate-spin" /> : <ShieldCheck className="size-5" />}
                Xác nhận & Vào hệ thống
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
              >
                Quay lại
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════
   Login — Split screen full page
   ═══════════════════════════════════════ */

export function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Header */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 md:px-10 py-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined">health_and_safety</span>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-tight">Sống Khỏe</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-sm text-slate-500 dark:text-slate-400">
                {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
              </span>
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="flex items-center justify-center rounded-xl h-10 bg-primary/10 dark:bg-primary/20 text-primary px-4 text-sm font-bold hover:bg-primary/20 transition-all"
              >
                {mode === 'login' ? 'Đăng ký' : 'Đăng nhập'}
              </button>
            </div>
          </header>

          <main className={`flex-1 flex items-center justify-center p-4 md:p-10 ${mode === 'login' ? '' : 'py-10'}`}>
            {mode === 'login' ? (
              /* Split Screen for Login */
              <div className="w-full max-w-[960px] grid md:grid-cols-2 gap-8 items-center">
                <div className="hidden md:flex flex-col gap-6 pr-8">
                  <div className="rounded-xl overflow-hidden shadow-2xl shadow-primary/10 border border-primary/20 aspect-video relative">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDietfcqf2oN-h9pyuFOYs1Egf0xNBMdNvkFVWgxUpVyyFpbUAPUrU6mEAf4GQSYIUsKRYeNVNcA4ouMYK9Bds1i5PAmUqsU88BwlSGNaiUWguIsMghVA09kqdDdqSlBwcdXAuZWERk3JUsREK2uqlYyp0Gh5Vgd34zWwT4ABYZLyvlDsSowxpd6sHFCBZ8xGiVyMxNueS-ScvE6qmT_29FueigTNvGVBwEpi6iyv0CzfSDfbLSXBkbDVpevIZVZOGkClOr1YaiKJ4"
                      alt="Healthcare"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                      <h3 className="text-white text-2xl font-bold mb-2">Chăm sóc sức khỏe toàn diện</h3>
                      <p className="text-slate-200 text-sm">Kết nối với bác sĩ hàng đầu chỉ trong vài phút.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                      <span className="material-symbols-outlined text-primary mb-2">verified_user</span>
                      <h4 className="font-bold text-sm">Bảo mật 100%</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Dữ liệu y tế của bạn được mã hóa an toàn.</p>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                      <span className="material-symbols-outlined text-primary mb-2">support_agent</span>
                      <h4 className="font-bold text-sm">Hỗ trợ 24/7</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Đội ngũ chuyên gia luôn sẵn sàng giúp đỡ.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/50 p-6 md:p-10 rounded-2xl shadow-xl border border-primary/10 backdrop-blur-sm">
                  <LoginForm mode={mode} setMode={setMode} />
                </div>
              </div>
            ) : (
              /* Centered Card for Register */
              <div className="layout-content-container flex flex-col max-w-[520px] flex-1 bg-white dark:bg-slate-900/50 p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                <LoginForm mode={mode} setMode={setMode} />
              </div>
            )}
          </main>

          <footer className="py-6 px-10 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-400">© 2024 Sồng Khỏe Healthcare. Tất cả quyền lợi được bảo lưu.</p>
          </footer>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   LoginModal — Popup implementation
   ═══════════════════════════════════════ */

export function LoginModal({
  isOpen,
  onClose,
  redirectTo,
  initialFirebaseToken,
}: {
  isOpen: boolean
  onClose: () => void
  redirectTo?: { pathname?: string; search?: string }
  initialFirebaseToken?: string
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full ${mode === 'login' ? 'max-w-[480px]' : 'max-w-[540px]'} bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800`}
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-10 size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-colors"
            >
              <X className="size-5" />
            </button>

            <div className="p-8 md:p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <LoginForm mode={mode} setMode={setMode} onSuccess={onClose} redirectTo={redirectTo} initialFirebaseToken={initialFirebaseToken} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
