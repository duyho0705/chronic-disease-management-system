import type { PublicDisplayDto } from '@/types/api'

/**
 * Lấy dữ liệu hiển thị công khai cho Smart TV.
 * Cần URL tuyệt đối vì fetch client mặc định yêu cầu Tenant Header (thường là private).
 */
export async function getPublicDisplayData(branchId: string): Promise<PublicDisplayDto> {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'
    const res = await fetch(`${apiBase}/public/display/${branchId}`)
    if (!res.ok) throw new Error('Không thể lấy dữ liệu màn hình')
    return res.json()
}
