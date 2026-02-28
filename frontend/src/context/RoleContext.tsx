import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

/** Role chÃ­nh theo thá»±c táº¿ phÃ²ng khÃ¡m VN */
export type Role = 'admin' | 'receptionist' | 'triage_nurse' | 'doctor' | 'clinic_manager' | 'pharmacist' | 'patient'

const ROLES: { value: Role; label: string }[] = [
  { value: 'admin', label: 'Quáº£n trá»‹ há»‡ thá»‘ng' },
  { value: 'receptionist', label: 'Lá»… tÃ¢n' },
  { value: 'triage_nurse', label: 'Y tÃ¡ phÃ¢n loáº¡i' },
  { value: 'doctor', label: 'BÃ¡c sÄ©' },
  { value: 'clinic_manager', label: 'Quáº£n lÃ½ phÃ²ng khÃ¡m' },
  { value: 'pharmacist', label: 'DÆ°á»£c sÄ©' },
  { value: 'patient', label: 'Bá»‡nh nhÃ¢n' },
]

const STORAGE_KEY = 'cdm-platform-role'

const VALID_ROLES: Role[] = ['admin', 'receptionist', 'triage_nurse', 'doctor', 'clinic_manager', 'pharmacist', 'patient']

function loadRole(): Role {
  try {
    const r = localStorage.getItem(STORAGE_KEY)
    if (r && VALID_ROLES.includes(r as Role)) return r as Role
  } catch {
    // ignore
  }
  return 'receptionist'
}

type RoleContextValue = {
  role: Role
  setRole: (role: Role) => void
  roleLabel: string
  roles: { value: Role; label: string }[]
}

const RoleContext = createContext<RoleContextValue | null>(null)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(loadRole)

  const setRole = useCallback((r: Role) => {
    setRoleState(r)
    localStorage.setItem(STORAGE_KEY, r)
  }, [])

  const roleLabel = ROLES.find((x) => x.value === role)?.label ?? role

  return (
    <RoleContext.Provider value={{ role, setRole, roleLabel, roles: ROLES }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}

