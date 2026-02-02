import type { PublicDisplayDto, KioskRegistrationRequest, QueueEntryDto, QueueDefinitionDto } from '@/types/api'

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

export async function registerFromKiosk(body: KioskRegistrationRequest): Promise<QueueEntryDto> {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'
    const res = await fetch(`${apiBase}/public/kiosk/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    if (!res.ok) throw new Error('Đăng ký thất bại. Vui lòng thử lại.')
    return res.json()
}

/**
 * Lấy danh sách hàng chờ công khai cho Kiosk. 
 * Note: Vì endpoint /queues/definitions là private, 
 * trong thực tế ta nên tạo một bản public hoặc cho phép Kiosk truy cập.
 * Để đơn giản hóa cho demo, tôi sẽ giả định có endpoint public.
 */
export async function getPublicQueues(branchId: string): Promise<QueueDefinitionDto[]> {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'
    // Giả sử ta mở public endpoint này hoặc dùng tham số branchId
    const res = await fetch(`${apiBase}/public/kiosk/queues?branchId=${branchId}`)
    if (!res.ok) return [] // Fallback
    return res.json()
}
