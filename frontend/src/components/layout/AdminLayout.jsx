import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  BarChart3,
  ChevronRight,
  ClipboardList,
  Gauge,
  LayoutDashboard,
  LogOut,
  ServerCog,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navigationSections = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', label: 'Command Center', icon: LayoutDashboard, end: true },
      { to: '/admin/requests', label: 'Manage Requests', icon: ClipboardList },
      { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/admin/audit', label: 'Audit Trail', icon: ShieldCheck },
      { to: '/admin/team', label: 'Team Directory', icon: Users },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/sla', label: 'SLA Performance', icon: Gauge },
      { to: '/admin/system-status', label: 'System Status', icon: ServerCog },
    ],
  },
]

function AdminNavLink({ item }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-3 py-3 text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'border-cyan-400/30 bg-white/[0.09] text-white shadow-lg shadow-cyan-950/20'
            : 'border-white/6 bg-white/[0.03] text-slate-300 hover:border-white/10 hover:bg-white/[0.06] hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`grid h-9 w-9 place-items-center rounded-xl border transition-colors ${
              isActive ? 'border-cyan-400/30 bg-cyan-400/12 text-cyan-200' : 'border-white/8 bg-white/[0.03] text-slate-300 group-hover:text-white'
            }`}
          >
            <Icon size={16} />
          </span>
          <span className="flex-1 text-left leading-tight">
            <span className="block">{item.label}</span>
            <span className="mt-0.5 block text-[0.72rem] font-normal tracking-[0.08em] text-slate-500">
              {isActive ? 'Open page' : 'Go to section'}
            </span>
          </span>
          <ChevronRight
            size={14}
            className={`transition-transform duration-200 ${isActive ? 'translate-x-0 text-cyan-200' : 'text-slate-500 group-hover:translate-x-0.5 group-hover:text-slate-200'}`}
          />
          {isActive ? <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-gradient-to-b from-cyan-300 to-blue-500" /> : null}
        </>
      )}
    </NavLink>
  )
}

function AdminLayout({ title, subtitle, actions, children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const currentPath = location.pathname
  const sectionLabel = currentPath.startsWith('/analytics') ? 'Analytics workspace' : 'Admin workspace'

  return (
    <div className="page-shell page-shell--split admin-shell">
      <aside className="sidebar relative h-screen overflow-hidden border-r border-white/8 bg-[linear-gradient(180deg,rgba(6,10,22,0.98),rgba(9,16,32,0.92))]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top_left,rgba(98,125,255,0.16),transparent_55%),radial-gradient(circle_at_top_right,rgba(18,191,232,0.12),transparent_42%)] opacity-90" />
        <div className="relative flex h-full flex-col gap-4 overflow-y-auto pr-1">
          <Link
            to={currentPath.startsWith('/admin') ? '/admin' : '/analytics'}
            className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] px-4 py-4 shadow-lg shadow-slate-950/20 backdrop-blur-xl transition hover:border-cyan-400/20 hover:bg-white/[0.07]"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 text-cyan-100 ring-1 ring-white/10">
                <ShieldCheck size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-cyan-200/80">Service Request System</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Admin Panel</h2>
                <p className="mt-1 text-sm leading-6 text-slate-300">Requests, audits, and system health in one place.</p>
              </div>
            </div>
          </Link>

          <div className="rounded-[1.15rem] border border-white/8 bg-white/[0.035] px-4 py-3 backdrop-blur-md">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-slate-400">Signed in as</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/8 bg-gradient-to-br from-cyan-400/18 to-indigo-500/18 text-white">
                <ShieldCheck size={16} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user?.full_name || 'Administrator'}</p>
                <p className="text-xs text-slate-400">{user?.role || 'admin'}</p>
              </div>
            </div>
          </div>

          <nav className="grid gap-4">
            {navigationSections.map((section) => (
              <div key={section.label} className="space-y-2">
                <p className="px-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-slate-500">{section.label}</p>
                <div className="grid gap-2">
                  {section.items.map((item) => (
                    <AdminNavLink key={item.to} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-auto rounded-[1.15rem] border border-white/8 bg-white/[0.035] p-4">
            <p className="text-sm font-semibold text-white">Quick exit</p>
            <p className="mt-1 text-sm leading-6 text-slate-300">Return to the user app or sign out.</p>
            <div className="mt-4 grid gap-2">
              <Link
                to="/dashboard"
                className="btn-outline justify-center border-white/10 bg-white/[0.04] text-sm text-white hover:border-cyan-400/30 hover:bg-cyan-400/10"
              >
                User app
              </Link>
              <button
                type="button"
                onClick={logout}
                className="btn-outline justify-center border-white/10 bg-white/[0.04] text-sm text-white hover:border-rose-400/30 hover:bg-rose-500/10"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="main relative">
        <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-6">
          <header className="rounded-[1.35rem] border border-white/8 bg-white/[0.04] p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="hero-card__eyebrow">{sectionLabel}</p>
                <h1 className="page-title">{title}</h1>
                <p className="page-subtitle mt-3 text-base leading-7">{subtitle}</p>
              </div>
              {actions ? <div className="page-actions">{actions}</div> : null}
            </div>
          </header>

          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout