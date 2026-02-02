import { useTenant } from '@/context/TenantContext'
import { Pill } from 'lucide-react'

export function PharmacyDispensing() {
    useTenant()

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <header className="page-header text-center">
                <h1 className="text-3xl font-bold text-slate-900">Quầy thuốc & Cấp phát</h1>
                <p className="text-slate-500 mt-2">Dành cho Dược sĩ: Cấp phát thuốc theo đơn của bác sĩ.</p>
            </header>

            <section className="card max-w-xl mx-auto text-center py-12 border-dashed border-2">
                <Pill className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">Tính năng đang hoàn thiện</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2">
                    Hệ thống thuốc đã được kết nối với tồn kho. Bạn có thể quản lý thuốc tại menu "Kho thuốc".
                </p>
            </section>
        </div>
    )
}
