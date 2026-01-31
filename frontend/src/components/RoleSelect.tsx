import { useRole } from '@/context/RoleContext'

export function RoleSelect() {
  const { role, setRole, roleLabel, roles } = useRole()

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Vai trò</span>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as import('@/context/RoleContext').Role)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      >
        {roles.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  )
}
