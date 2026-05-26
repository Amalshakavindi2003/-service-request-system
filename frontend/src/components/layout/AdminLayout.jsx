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
  Sparkles,
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
        `group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'border-white/15 bg-white/12 text-white shadow-lg shadow-slate-950/30'
            : 'border-transparent bg-white/[0.03] text-slate-300 hover:border-cyan-400/15 hover:bg-white/[0.06] hover:text-white'
        }`
      }
    >
      <span className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-white/10 bg-white/5 text-cyan-200 transition-transform duration-200 group-hover:scale-105 group-hover:bg-cyan-400/10 group-hover:text-cyan-100">
        <Icon size={18} />
      </span>
      <span className="flex-1 text-left">{item.label}</span>
      <ChevronRight size={16} className="text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5" />
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
      <aside className="sidebar relative overflow-hidden border-r border-white/8 bg-[linear-gradient(180deg,rgba(6,10,22,0.98),rgba(9,16,32,0.92))]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(98,125,255,0.22),transparent_58%),radial-gradient(circle_at_top_right,rgba(18,191,232,0.18),transparent_45%)] opacity-90" />
        <div className="relative flex h-full flex-col gap-6">
          <Link
            to={currentPath.startsWith('/admin') ? '/admin' : '/analytics'}
            className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-cyan-200/80">Service Request System</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Operations Console</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">Sharper navigation for admin work, reports, and platform health.</p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 text-cyan-100 shadow-lg shadow-cyan-950/20">
                <Sparkles size={22} />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-200">Live</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-200">Secure</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-200">Fast Access</span>
            </div>
          </Link>

          <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 text-white">
                <ShieldCheck size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Signed in as</p>
                <p className="truncate text-sm font-semibold text-white">{user?.full_name || 'Administrator'}</p>
                <p className="text-xs text-slate-400">{user?.role || 'admin'}</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-white/8 bg-slate-950/45 px-3 py-2 text-xs text-slate-300">
              {sectionLabel}
            </div>
          </div>

          <nav className="grid gap-5">
            {navigationSections.map((section) => (
              <div key={section.label} className="space-y-2">
                <p className="px-1 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-slate-500">{section.label}</p>
                <div className="grid gap-2">
                  {section.items.map((item) => (
                    <AdminNavLink key={item.to} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-auto rounded-[1.5rem] border border-white/8 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 p-4">
            <p className="text-sm font-semibold text-white">Need a quick escape?</p>
            <p className="mt-1 text-sm leading-6 text-slate-300">Jump back to the main workflow or sign out cleanly.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/dashboard" className="btn-outline justify-center border-white/10 bg-white/[0.04] text-sm text-white hover:border-cyan-400/30 hover:bg-cyan-400/10">User app</Link>
              <button type="button" onClick={logout} className="btn-outline justify-center border-white/10 bg-white/[0.04] text-sm text-white hover:border-rose-400/30 hover:bg-rose-500/10">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="main relative">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
          <header className="rounded-[1.75rem] border border-white/8 bg-white/[0.04] p-6 shadow-2xl shadow-slate-950/25 backdrop-blur-xl sm:p-7">
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