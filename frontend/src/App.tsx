import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Layout } from '@/components/Layout'
import { RequireAuth } from '@/components/RequireAuth'

import { LandingPage } from '@/pages/LandingPage'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Patients } from '@/pages/Patients'
import { Billing } from '@/pages/Billing'
import { Inventory } from '@/pages/Inventory'
import { DisplayPage } from '@/pages/DisplayPage'
import { PharmacyDispensing } from '@/pages/PharmacyDispensing'
import { Scheduling } from '@/pages/Scheduling'
import { Triage } from '@/pages/Triage'
import { Queue } from '@/pages/Queue'
import { AiAudit } from '@/pages/AiAudit'
import { Analytics } from '@/pages/Analytics'
import { Reports } from '@/pages/Reports'
import { Admin } from '@/pages/Admin'

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: '14px',
            maxWidth: '500px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/display/:branchId" element={<DisplayPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="triage" element={<Triage />} />
            <Route path="queue" element={<Queue />} />
            <Route path="scheduling" element={<Scheduling />} />
            <Route path="billing" element={<Billing />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="dispensing" element={<PharmacyDispensing />} />
            <Route path="reports" element={<Reports />} />
            <Route path="ai-audit" element={<AiAudit />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
