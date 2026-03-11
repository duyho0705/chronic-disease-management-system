import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/constants'
import type { AuthUserDto } from '@/api-client'

/**
 * Enterprise Navigation Hook to handle complex routing logic.
 */
export function useAppNavigation() {
    const navigate = useNavigate()

    const navigateAfterLogin = (user: AuthUserDto, targetPath?: string, replace = true) => {
        // Staff roles take priority over patient role
        const STAFF_ROLES = ['DOCTOR', 'ADMIN', 'SYSTEM_ADMIN', 'CLINIC_MANAGER', 'RECEPTIONIST', 'TRIAGE_NURSE', 'PHARMACIST']
        const isStaff = (user.roles || []).some(r => STAFF_ROLES.includes(r.toUpperCase()))

        // Use targetPath if provided, otherwise default based on role
        const target = targetPath || (isStaff ? APP_ROUTES.STAFF_DASHBOARD : APP_ROUTES.PATIENT_DASHBOARD)

        navigate(target, { replace })
    }

    const navigateToLogin = (state?: any) => {
        navigate(APP_ROUTES.LOGIN, { state, replace: true })
    }

    const navigateToLanding = (state?: any) => {
        navigate(APP_ROUTES.LANDING, { state, replace: true })
    }

    return {
        navigateAfterLogin,
        navigateToLogin,
        navigateToLanding
    }
}
