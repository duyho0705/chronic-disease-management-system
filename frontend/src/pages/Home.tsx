import { Link } from 'react-router-dom'

/**
 * Landing page — đẹp, chuyên nghiệp, tránh phong cách AI slop.
 * Màu chủ đạo: off-white, slate, một accent xanh lá/teal nhẹ. Không gradient tím, không orb.
 */

const features = [
  {
    to: '/patients',
    title: 'Bệnh nhân',
    desc: 'Tìm CCCD, đăng ký mới, cập nhật hồ sơ.',
  },
  {
    to: '/triage',
    title: 'Phân loại',
    desc: 'Gợi ý AI từ lý do khám và sinh hiệu, mức ưu tiên 1–5.',
  },
  {
    to: '/queue',
    title: 'Hàng chờ',
    desc: 'Xem danh sách chờ, thêm bệnh nhân, gọi số.',
  },
]

export function Home() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#faf9f7]">
      {/* Hero — chữ lớn, thoáng, một màu nhấn */}
      <section className="px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 md:pt-28 md:pb-32">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Hệ thống phòng khám
          </p>
          <h1 className="mt-5 text-[2.25rem] font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-[2.75rem]">
            Luồng bệnh nhân
            <br />
            <span className="text-teal-700">và phân loại ưu tiên</span>
          </h1>
          <p className="mt-6 max-w-lg text-slate-600 leading-relaxed">
            Một nền tảng cho lễ tân, y tá và bác sĩ: đăng ký bệnh nhân, gợi ý phân loại ưu tiên, quản lý hàng chờ.
          </p>
          <div className="mt-10">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Vào hệ thống
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Vạch ngăn nhẹ */}
      <div className="mx-auto max-w-2xl px-4">
        <hr className="border-slate-200" />
      </div>

      {/* 3 tính năng — thẻ đơn giản, không icon to, không gradient */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-lg font-semibold text-slate-900">
            Trong một nền tảng
          </h2>
          <p className="mt-2 text-slate-600">
            Đủ nghiệp vụ từ tiếp đón đến phân loại và gọi số.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl px-4">
          <ul className="grid gap-4 sm:grid-cols-3">
            {features.map((f) => (
              <li key={f.to}>
                <Link
                  to={f.to}
                  className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  <h3 className="font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600">{f.desc}</p>
                  <span className="mt-3 inline-block text-sm font-medium text-teal-700">
                    Mở →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA nhỏ — không quá to, không màu chói */}
      <section className="border-t border-slate-200 bg-white/60 px-4 py-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm text-slate-600">
            Chọn <strong className="text-slate-800">vai trò</strong>, <strong className="text-slate-800">tenant</strong> và <strong className="text-slate-800">chi nhánh</strong> ở góc phải trên.
          </p>
        </div>
      </section>
    </div>
  )
}
