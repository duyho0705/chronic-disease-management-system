import { Link } from 'react-router-dom'
import { useRole } from '@/context/RoleContext'
import type { Role } from '@/context/RoleContext'

const ROLE_CONFIG: Record<
  Role,
  { title: string; subtitle: string; actions: { to: string; label: string; desc: string }[] }
> = {
  reception: {
    title: 'Lễ tân',
    subtitle: 'Đăng ký bệnh nhân, tìm hồ sơ, thêm vào hàng chờ.',
    actions: [
      { to: '/patients', label: 'Bệnh nhân', desc: 'Tìm CCCD, đăng ký mới, cập nhật hồ sơ' },
      { to: '/queue', label: 'Hàng chờ', desc: 'Thêm bệnh nhân vào hàng, xem danh sách chờ' },
    ],
  },
  nurse: {
    title: 'Y tá',
    subtitle: 'Phân loại ưu tiên, ghi sinh hiệu, gợi ý AI.',
    actions: [
      { to: '/triage', label: 'Phân loại', desc: 'Tạo phiên phân loại, gợi ý mức ưu tiên AI' },
      { to: '/patients', label: 'Bệnh nhân', desc: 'Tìm bệnh nhân theo CCCD trước khi phân loại' },
      { to: '/queue', label: 'Hàng chờ', desc: 'Thêm bệnh nhân vào hàng sau phân loại' },
    ],
  },
  doctor: {
    title: 'Bác sĩ',
    subtitle: 'Xem hàng chờ, gọi bệnh nhân vào khám.',
    actions: [
      { to: '/queue', label: 'Hàng chờ', desc: 'Xem danh sách đang chờ, gọi số khi sẵn sàng' },
      { to: '/patients', label: 'Bệnh nhân', desc: 'Tra cứu hồ sơ bệnh nhân khi cần' },
    ],
  },
  admin: {
    title: 'Quản lý',
    subtitle: 'Tổng quan chi nhánh, cấu hình tenant.',
    actions: [
      { to: '/patients', label: 'Bệnh nhân', desc: 'Xem danh sách bệnh nhân' },
      { to: '/triage', label: 'Phân loại', desc: 'Xem phiên phân loại' },
      { to: '/queue', label: 'Hàng chờ', desc: 'Theo dõi hàng chờ các chi nhánh' },
    ],
  },
}

export function Dashboard() {
  const { role } = useRole()
  const config = ROLE_CONFIG[role]

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {config.title}
        </h1>
        <p className="mt-2 text-slate-600">
          {config.subtitle}
        </p>
      </header>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Thao tác nhanh
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {config.actions.map((a) => (
            <li key={a.to}>
              <Link
                to={a.to}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                <span className="font-semibold text-slate-900">{a.label}</span>
                <span className="mt-1 text-sm text-slate-600">{a.desc}</span>
                <span className="mt-3 inline-flex items-center text-sm font-medium text-teal-700">
                  Mở
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-sm text-slate-500">
        Chọn vai trò khác ở góc phải trên nếu bạn đang đảm nhiệm vai trò khác.
      </p>
    </div>
  )
}
