import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTenant } from '@/context/TenantContext'
import { listPatients, findPatientByCccd, findPatientByPhone, createPatient, updatePatient } from '@/api/patients'
import type { PatientDto, CreatePatientRequest } from '@/types/api'
import { toastService } from '@/services/toast'
import { CheckInModal } from '@/components/CheckInModal'
import { SkeletonPatientList } from '@/components/Skeleton'
import { QrCode, ExternalLink, FileText, Activity, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'

function PatientForm({
  initial,
  onSuccess,
  onCancel,
}: {
  initial?: PatientDto | null
  onSuccess: () => void
  onCancel: () => void
}) {
  const { headers } = useTenant()
  const [form, setForm] = useState<CreatePatientRequest>({
    fullNameVi: initial?.fullNameVi ?? '',
    dateOfBirth: initial?.dateOfBirth ?? '',
    cccd: initial?.cccd ?? '',
    externalId: initial?.externalId ?? '',
    gender: initial?.gender ?? '',
    phone: initial?.phone ?? '',
    email: initial?.email ?? '',
    addressLine: initial?.addressLine ?? '',
    city: initial?.city ?? '',
    district: initial?.district ?? '',
    ward: initial?.ward ?? '',
    nationality: initial?.nationality ?? '',
    ethnicity: initial?.ethnicity ?? '',
  })
  const [saving, setSaving] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (initial?.id) {
        await updatePatient(initial.id, form, headers)
        toastService.success('✅ Cập nhật thông tin bệnh nhân thành công!')
      } else {
        await createPatient(form, headers)
        toastService.success('✅ Đăng ký bệnh nhân mới thành công!')
      }
      onSuccess()
    } catch (err) {
      toastService.error(err instanceof Error ? err.message : 'Lỗi lưu thông tin bệnh nhân')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-4 max-w-2xl">
      <h3 className="section-title">{initial?.id ? 'Cập nhật bệnh nhân' : 'Đăng ký bệnh nhân mới'}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Họ tên *</label>
          <input
            className="input"
            value={form.fullNameVi}
            onChange={(e) => setForm((f) => ({ ...f, fullNameVi: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="label">Ngày sinh *</label>
          <input
            type="date"
            className="input"
            value={form.dateOfBirth}
            onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="label">CCCD</label>
          <input
            className="input"
            value={form.cccd ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, cccd: e.target.value }))}
          />
        </div>
        <div>
          <label className="label">Giới tính</label>
          <select
            className="input"
            value={form.gender ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
          >
            <option value="">--</option>
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>
        <div>
          <label className="label">SĐT</label>
          <input
            className="input"
            value={form.phone ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            value={form.email ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Địa chỉ</label>
          <input
            className="input"
            value={form.addressLine ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, addressLine: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Đang lưu...' : initial?.id ? 'Cập nhật' : 'Đăng ký'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Hủy
        </button>
      </div>
    </form>
  )
}

export function Patients() {
  const { headers } = useTenant()
  const [page, setPage] = useState(0)
  const [cccdSearch, setCccdSearch] = useState('')
  const [phoneSearch, setPhoneSearch] = useState('')
  const [foundPatient, setFoundPatient] = useState<PatientDto | null | 'none'>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState<PatientDto | null>(null)
  const [checkInPatient, setCheckInPatient] = useState<PatientDto | null>(null)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['patients', headers?.tenantId, page],
    queryFn: () => listPatients({ page, size: 10 }, headers),
    enabled: !!headers?.tenantId,
  })

  const searchCccd = async () => {
    if (!cccdSearch.trim() || !headers) return
    setFoundPatient(null)
    const p = await findPatientByCccd(cccdSearch.trim(), headers)
    setFoundPatient(p ?? 'none')
    if (p) setEditingPatient(p)
  }

  const searchPhone = async () => {
    if (!phoneSearch.trim() || !headers) return
    setFoundPatient(null)
    const p = await findPatientByPhone(phoneSearch.trim(), headers)
    setFoundPatient(p ?? 'none')
    if (p) setEditingPatient(p)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="page-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý bệnh nhân</h1>
          <p className="mt-1 text-sm text-slate-600">Tìm CCCD, đăng ký mới, cập nhật hồ sơ.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowForm(true)
            setEditingPatient(null)
            setFoundPatient(null)
          }}
          className="btn-primary rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 focus:ring-slate-500"
        >
          + Đăng ký bệnh nhân mới
        </button>
      </header>

      {/* Tìm theo CCCD */}
      <section className="card max-w-2xl">
        <h2 className="section-title mb-4">Tìm theo CCCD</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nhập số CCCD"
            value={cccdSearch}
            onChange={(e) => setCccdSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchCccd()}
            className="input flex-1"
          />
          <button type="button" onClick={searchCccd} className="btn-primary">
            Tìm
          </button>
        </div>
        {foundPatient === 'none' && (
          <p className="mt-3 text-sm text-slate-600">Không tìm thấy. Có thể đăng ký mới.</p>
        )}
        {foundPatient && foundPatient !== 'none' && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <p className="font-semibold text-slate-900">{foundPatient.fullNameVi}</p>
            <p className="mt-1 text-sm text-slate-600">
              {foundPatient.dateOfBirth} · {foundPatient.cccd || '—'} · {foundPatient.phone || '—'}
            </p>
            <button
              type="button"
              onClick={() => {
                setEditingPatient(foundPatient)
                setShowForm(true)
              }}
              className="btn-secondary mt-3 text-sm"
            >
              Cập nhật thông tin
            </button>
            <button
              type="button"
              onClick={() => setCheckInPatient(foundPatient)}
              className="mt-3 ml-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white hover:from-emerald-700 hover:to-teal-700 transition-all"
            >
              ✅ Check-in
            </button>
          </div>
        )}
      </section>

      {/* Tìm theo SĐT */}
      <section className="card max-w-2xl">
        <h2 className="section-title mb-4">Tìm theo Số điện thoại</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nhập số điện thoại"
            value={phoneSearch}
            onChange={(e) => setPhoneSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchPhone()}
            className="input flex-1"
          />
          <button type="button" onClick={searchPhone} className="btn-primary">
            Tìm
          </button>
        </div>
      </section>

      {/* Form đăng ký / cập nhật */}
      {showForm && (
        <PatientForm
          initial={editingPatient}
          onSuccess={() => {
            setShowForm(false)
            setEditingPatient(null)
            refetch()
          }}
          onCancel={() => {
            setShowForm(false)
            setEditingPatient(null)
          }}
        />
      )}

      {/* Danh sách phân trang */}
      <section className="card">
        <h2 className="section-title mb-4">Danh sách bệnh nhân</h2>
        {isLoading ? (
          <SkeletonPatientList />
        ) : data?.content?.length ? (
          <>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="table-th">Họ tên</th>
                    <th className="table-th hidden md:table-cell">Ngày sinh</th>
                    <th className="table-th hidden sm:table-cell">CCCD</th>
                    <th className="table-th">Liên hệ</th>
                    <th className="table-th text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="table-td" onClick={() => {
                        setEditingPatient(p)
                        setShowForm(true)
                      }}>
                        <div className="font-semibold text-slate-900">{p.fullNameVi}</div>
                        <div className="text-xs text-slate-500 md:hidden">
                          {p.dateOfBirth} {p.cccd ? `· ${p.cccd}` : ''}
                        </div>
                      </td>
                      <td className="table-td hidden md:table-cell" onClick={() => {
                        setEditingPatient(p)
                        setShowForm(true)
                      }}>{p.dateOfBirth}</td>
                      <td className="table-td hidden sm:table-cell" onClick={() => {
                        setEditingPatient(p)
                        setShowForm(true)
                      }}>{p.cccd || '—'}</td>
                      <td className="table-td text-sm" onClick={() => {
                        setEditingPatient(p)
                        setShowForm(true)
                      }}>{p.phone || '—'}</td>
                      <td className="table-td text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/patients/${p.id}/ehr`}
                            title="Hồ sơ EHR"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <FileText className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const url = `${window.location.origin}/portal/${p.id}`
                              navigator.clipboard.writeText(url)
                              toastService.success('Đã sao chép link Portal cho BN')
                            }}
                            title="Copy Link Portal"
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setCheckInPatient(p)
                            }}
                            title="Check-in nhanh"
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                          >
                            <Activity className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setPage((x) => Math.max(0, x - 1))}
                disabled={data.first}
                className="btn-secondary rounded-lg text-sm"
              >
                Trước
              </button>
              <span className="text-sm text-slate-600">
                Trang {data.page + 1} / {data.totalPages || 1}
              </span>
              <button
                type="button"
                onClick={() => setPage((x) => x + 1)}
                disabled={data.last}
                className="btn-secondary rounded-lg text-sm"
              >
                Sau
              </button>
            </div>
          </>
        ) : (
          <p className="text-slate-500">Chưa có bệnh nhân nào.</p>
        )}
      </section>

      {/* Check-In Modal */}
      {checkInPatient && (
        <CheckInModal
          patient={checkInPatient}
          onClose={() => setCheckInPatient(null)}
          onSuccess={() => {
            setCheckInPatient(null)
            setFoundPatient(null)
            setCccdSearch('')
            setPhoneSearch('')
          }}
        />
      )}
    </div>
  )
}
