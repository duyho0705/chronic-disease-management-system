import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type Role = 'reception' | 'nurse' | 'doctor' | 'admin'

const ROLES: { value: Role; label: string }[] = [
  { value: 'reception', label: 'Lễ tân' },
  { value: 'nurse', label: 'Y tá' },
  { value: 'doctor', label: 'Bác sĩ' },
  { value: 'admin', label: 'Quản lý' },
]

const STORAGE_KEY = 'patient-flow-role'

function loadRole(): Role {
  try {
    const r = localStorage.getItem(STORAGE_KEY)
    if (r && ['reception', 'nurse', 'doctor', 'admin'].includes(r)) return r as Role
  } catch {
    // ignore
  }
  return 'reception'
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
