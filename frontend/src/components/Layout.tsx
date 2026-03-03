import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTenant } from '@/context/TenantContext'
import { TenantSelect } from './TenantSelect'

import { LogOut, Menu, X, Search, Bell, Settings, BriefcaseMedical } from 'lucide-react'
import { useState, useEffect } from 'react'
import { STAFF_NAV } from '@/routes/staffNav'
import { requestForToken, onForegroundMessage, db } from '@/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import toast from 'react-hot-toast'

export function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { tenantId, branchId } = useTenant()
  const [sidebarOpen, setSidebarOpen] = useState(false)



  useEffect(() => {
    if (!user || !tenantId) return

    // Request token on layout mount
    requestForToken().then(async (token) => {
      if (token && user?.id) {
        // Lưu token vào Firestore để Cloud Functions có thể truy cập
        await setDoc(doc(db, 'users', user.id), {
          fcmToken: token,
          lastSeenAt: serverTimestamp(),
          userType: 'DOCTOR',
          name: user?.fullNameVi || ''
        }, { merge: true }).catch(err => console.warn('Lỗi lưu token:', err));
      }
    }).catch(err => console.warn('FCM token error:', err))

    // Handle foreground push notifications
    const unsubscribe = onForegroundMessage((payload) => {
      console.log("Foreground push notification:", payload);
      toast.success(
        payload?.notification?.body || "Bạn có thông báo mới",
        {
          icon: '🔔',
          position: 'top-right',
          duration: 5000,
        }
      );
    });

    return () => {
      unsubscribe();
    }
  }, [user, tenantId])

  const visibleNav = STAFF_NAV.filter(
    (item) => !item.roles || (user?.roles && item.roles.some((r) => user.roles.includes(r)))
  )

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true, state: { openLogin: true } })
  }



  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex">
      {/* Sidebar - Desktop matching Patient Layout */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 z-40">
        <Link to="/" className="flex items-center gap-3 mb-10 px-2 hover:opacity-80 transition-opacity">
          <BriefcaseMedical className="h-9 w-9 text-emerald-500" strokeWidth={2.5} />
          <h1 className="font-semibold text-2xl text-slate-800 dark:text-slate-100 leading-none tracking-tight">Sống Khỏe</h1>
        </Link>

        <nav className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden">
          {visibleNav.map((item, idx) => {
            if (item.type === 'header') {
              return (
                <div key={idx} className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mt-4 first:mt-0">
                  {item.label}
                </div>
              )
            }
            const { to, label, icon: Icon } = item
            const isActive = location.pathname === to || (to !== '/dashboard' && to && location.pathname.startsWith(to))
            return (
              <Link
                key={idx}
                to={to || '#'}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-full font-bold transition-all ${isActive
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-300'
                  }`}
              >
                {Icon && <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`} />}
                <span className="flex-1 truncate text-base tracking-tight">{label}</span>
                {item.badge && (
                  <span className={`w-5 h-5 ${isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'} text-[10px] flex items-center justify-center rounded-full font-black`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-sm border-2 border-white shadow-sm">
              {user?.fullNameVi?.split(' ').pop()?.substring(0, 2).toUpperCase() || 'BS'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.fullNameVi || 'Bác sĩ'}</p>
              <p className="text-[10px] font-bold text-slate-400 truncate">{user?.email || 'doctor@clinic.vn'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 font-bold hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-slate-900 transition-transform duration-300 ease-out md:hidden shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <BriefcaseMedical className="h-9 w-9 text-emerald-500" strokeWidth={2.5} />
            <span className="font-semibold text-xl text-slate-800 dark:text-slate-100 tracking-tight">Sống Khỏe</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col gap-2 p-6 overflow-y-auto">
          {visibleNav.map((item, idx) => {
            if (item.type === 'header') {
              return (
                <div key={idx} className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mt-2">
                  {item.label}
                </div>
              )
            }
            return (
              <Link
                key={idx}
                to={item.to || '#'}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 rounded-full px-5 py-3.5 font-bold transition-all ${location.pathname === item.to
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-300'
                  }`}
              >
                {item.icon && <item.icon className={`h-6 w-6 ${location.pathname === item.to ? 'text-white' : 'text-slate-900 dark:text-white'}`} />}
                <span className="flex-1 truncate text-base tracking-tight">{item.label}</span>
                {item.badge && (
                  <span className={`ml-auto w-5 h-5 ${location.pathname === item.to ? 'bg-white/20 text-white' : 'bg-red-500 text-white'} text-[10px] flex items-center justify-center rounded-full font-black`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen relative">
        <header className="fixed top-0 right-0 left-0 md:left-64 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between z-30">
          <div className="flex flex-1 items-center gap-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-500 hover:text-slate-700 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Global Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bệnh nhân, bác sĩ, báo cáo..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 relative group transition-all">
              <Bell className="w-5 h-5 text-slate-500 group-hover:text-emerald-500" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <button className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 group transition-all">
              <Settings className="w-5 h-5 text-slate-500 group-hover:text-emerald-500" />
            </button>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                  {user?.fullNameVi || 'Bác sĩ'}
                </p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">
                  {user?.roles?.[0]?.toUpperCase() || 'DOCTOR'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-sm border-2 border-white shadow-sm">
                {user?.fullNameVi?.charAt(0) || 'B'}
              </div>
            </div>
          </div>
        </header>

        <main className={`flex-1 flex flex-col min-h-0 w-full pt-20 ${location.pathname.includes('/chat') ? '' : 'px-4 md:px-6 pb-12'}`}>
          {location.pathname === '/' ? (
            <Outlet />
          ) : location.pathname === '/dashboard' && !tenantId ? (
            <Outlet />
          ) : !tenantId ? (
            <div className="flex h-[50vh] flex-col items-center justify-center">
              <div className="card w-full max-w-md text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <BriefcaseMedical className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Chọn cơ sở y tế</h3>
                <p className="mt-2 text-sm text-slate-500 mb-8 font-medium">Vui lòng lựa chọn tổ chức và chi nhánh để tiếp tục làm việc.</p>
                <TenantSelect className="justify-center w-full" />
              </div>
            </div>
          ) : !branchId ? (
            <div className="flex h-[50vh] flex-col items-center justify-center">
              <div className="card w-full max-w-md text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100">
                <p className="text-slate-600 dark:text-slate-400 font-bold">Vui lòng chọn chi nhánh để tiếp tục.</p>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  )
}
