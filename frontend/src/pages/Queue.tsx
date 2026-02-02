import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTenant } from '@/context/TenantContext'
import { getQueueDefinitions, getQueueEntries, addQueueEntry, callQueueEntry } from '@/api/queues'
import { getPatient } from '@/api/patients'
import { AcuityIndicator } from '@/components/AcuityBadge'
import { toastService } from '@/services/toast'
import { SkeletonTable } from '@/components/Skeleton'
import { useEffect } from 'react'
import { WebSocketService } from '@/services/websocket'

export function Queue() {
  const { headers, branchId } = useTenant()
  const queryClient = useQueryClient()
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null)
  const [addPatientId, setAddPatientId] = useState('')
  const [addTriageSessionId, setAddTriageSessionId] = useState('')

  const { data: definitions } = useQuery({
    queryKey: ['queue-definitions', branchId, headers?.tenantId],
    queryFn: () => getQueueDefinitions(branchId!, headers),
    enabled: !!branchId && !!headers?.tenantId,
  })

  const { data: entries, isLoading } = useQuery({
    queryKey: ['queue-entries', selectedQueueId, branchId, headers?.tenantId],
    queryFn: () => getQueueEntries(selectedQueueId!, branchId!, headers),
    enabled: !!selectedQueueId && !!branchId && !!headers?.tenantId,
  })

  useEffect(() => {
    const ws = new WebSocketService((msg) => {
      console.log('WS Update:', msg)
      if (msg.type === 'QUEUE_UPDATE') {
        queryClient.invalidateQueries({ queryKey: ['queue-entries'] })
      }
    })
    ws.connect()
    return () => ws.disconnect()
  }, [queryClient])

  const addEntry = useMutation({
    mutationFn: () => {
      if (!selectedQueueId || !addPatientId.trim() || !headers?.tenantId) throw new Error('Chọn hàng chờ và nhập ID bệnh nhân')
      return addQueueEntry(
        {
          queueDefinitionId: selectedQueueId,
          patientId: addPatientId.trim(),
          triageSessionId: addTriageSessionId.trim() || undefined,
        },
        headers
      )
    },
    onSuccess: () => {
      toastService.success('✅ Đã thêm bệnh nhân vào hàng chờ')
      setAddPatientId('')
      setAddTriageSessionId('')
      queryClient.invalidateQueries({ queryKey: ['queue-entries'] })
    },
    onError: (e: Error) => toastService.error(e.message),
  })

  const callEntry = useMutation({
    mutationFn: (entryId: string) => callQueueEntry(entryId, headers),
    onSuccess: () => {
      toastService.info('🔔 Đã gọi bệnh nhân')
      queryClient.invalidateQueries({ queryKey: ['queue-entries'] })
    },
    onError: (e: Error) => toastService.error(e.message),
  })

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="page-header">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Hàng chờ</h1>
        <p className="mt-1 text-sm text-slate-600">Xem danh sách đang chờ, thêm bệnh nhân, gọi số.</p>
      </header>

      {/* Chọn hàng chờ */}
      <section className="card">
        <h2 className="section-title mb-4">Định nghĩa hàng chờ</h2>
        {definitions?.length ? (
          <div className="flex flex-wrap gap-2">
            {definitions.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedQueueId(d.id)}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${selectedQueueId === d.id
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
              >
                {d.nameVi}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">Chưa có định nghĩa hàng chờ cho chi nhánh này.</p>
        )}
      </section>

      {selectedQueueId && (
        <>
          {/* Thêm vào hàng */}
          <section className="card max-w-2xl">
            <h2 className="section-title mb-4">Thêm bệnh nhân vào hàng</h2>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="ID bệnh nhân (UUID)"
                value={addPatientId}
                onChange={(e) => setAddPatientId(e.target.value)}
                className="input w-72"
              />
              <input
                type="text"
                placeholder="ID phiên phân loại (tùy chọn)"
                value={addTriageSessionId}
                onChange={(e) => setAddTriageSessionId(e.target.value)}
                className="input w-72"
              />
              <button
                type="button"
                onClick={() => addEntry.mutate()}
                disabled={addEntry.isPending || !addPatientId.trim()}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {addEntry.isPending ? 'Đang thêm...' : 'Thêm vào hàng'}
              </button>
            </div>
          </section>

          {/* Danh sách đang chờ */}
          <section className="card">
            <h2 className="section-title mb-4">Danh sách đang chờ (WAITING)</h2>
            {isLoading ? (
              <SkeletonTable rows={5} columns={5} />
            ) : entries?.length ? (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="table-th w-16">Ưu tiên</th>
                      <th className="table-th hidden sm:table-cell">Vị trí</th>
                      <th className="table-th">Bệnh nhân</th>
                      <th className="table-th hidden md:table-cell">Trạng thái</th>
                      <th className="table-th text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((e) => (
                      <QueueRow
                        key={e.id}
                        entry={e}
                        onCall={() => callEntry.mutate(e.id)}
                        loading={callEntry.isPending && callEntry.variables === e.id}
                        headers={headers}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500">Không có bệnh nhân nào đang chờ.</p>
            )}
          </section>
        </>
      )}
    </div>
  )
}

function QueueRow({
  entry,
  onCall,
  loading,
  headers,
}: {
  entry: { id: string; patientId: string; position?: number; status: string; acuityLevel?: string | null }
  onCall: () => void
  loading: boolean
  headers: { tenantId: string; branchId?: string } | null
}) {
  const { data: patient } = useQuery({
    queryKey: ['patient', entry.patientId],
    queryFn: () => getPatient(entry.patientId, headers),
    enabled: !!entry.patientId && !!headers?.tenantId,
  })
  return (
    <tr className="hover:bg-slate-50/80 transition-colors">
      <td className="table-td">
        <AcuityIndicator level={entry.acuityLevel} />
      </td>
      <td className="table-td font-medium text-slate-900 hidden sm:table-cell">{entry.position ?? '—'}</td>
      <td className="table-td">
        <div className="font-semibold text-slate-900 line-clamp-1">{patient ? patient.fullNameVi : 'Loading...'}</div>
        <div className="text-xs text-slate-500 sm:hidden">
          #{entry.position ?? '-'} · {entry.status}
        </div>
      </td>
      <td className="table-td hidden md:table-cell">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${entry.status === 'WAITING' ? 'bg-blue-100 text-blue-700' :
          entry.status === 'CALLED' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-700'
          }`}>
          {entry.status}
        </span>
      </td>
      <td className="table-td text-right">
        {entry.status === 'WAITING' && (
          <button
            type="button"
            onClick={onCall}
            disabled={loading}
            className="btn-success text-xs py-1.5 px-3"
          >
            {loading ? '...' : 'Gọi'}
          </button>
        )}
      </td>
    </tr>
  )
}
