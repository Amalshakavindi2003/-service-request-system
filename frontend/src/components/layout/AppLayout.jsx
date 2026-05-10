import { Link, NavLink, Outlet } from 'react-router-dom'
import { ClipboardList, Home, ListChecks, LogOut, Settings, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
          isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`
      }
    >
      <Icon size={16} />
      {label}
    </NavLink>
  )
}

function AppLayout() {
  const { user, isAdmin, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-slate-800 bg-slate-900/80 p-4 lg:min-h-screen">
          <Link to={isAdmin ? '/admin' : '/dashboard'} className="mb-8 block rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 p-3 font-semibold text-white">
            Service Request System
          </Link>

          <nav className="space-y-2">
            {isAdmin ? (
              <>
                <NavItem to="/admin" icon={Shield} label="Admin Dashboard" />
                <NavItem to="/admin/profile" icon={Settings} label="Profile" />
              </>
            ) : (
              <>
                <NavItem to="/dashboard" icon={Home} label="Dashboard" />
                <NavItem to="/dashboard/create-request" icon={ClipboardList} label="Create Request" />
                <NavItem to="/dashboard/request-history" icon={ListChecks} label="Request History" />
                <NavItem to="/dashboard/profile" icon={Settings} label="Profile" />
              </>
            )}
          </nav>

          <button
            type="button"
            onClick={logout}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            <LogOut size={16} /> Logout
          </button>
        </aside>

        <main className="p-4 sm:p-6 lg:p-8">
          <header className="mb-6 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-wider text-cyan-300">Welcome</p>
            <h1 className="text-xl font-bold text-white">{user?.full_name || 'User'} </h1>
            <p className="text-sm text-slate-300">Manage service requests with real-time status visibility.</p>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout