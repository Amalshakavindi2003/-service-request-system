import { ServerCog } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'

function SystemStatusPage() {
  const systems = [
    { name: 'API Gateway', status: 'Healthy', note: 'No active incidents', color: 'text-emerald-300' },
    { name: 'Database', status: 'Healthy', note: 'Latency < 10ms', color: 'text-emerald-300' },
    { name: 'Mail Server', status: 'Degraded', note: 'Queue processing slowdown', color: 'text-amber-300' },
  ]

  return (
    <AdminLayout
      title="System Status"
      subtitle="A high-signal view of platform health and service quality."
      actions={<div className="btn-outline"><ServerCog size={16} /> Live status</div>}
    >
      <section className="grid gap-4">
        {systems.map((system) => (
          <div key={system.name} className="card flex items-center justify-between gap-4 rounded-[1.5rem]">
            <div>
              <p className="text-lg font-semibold text-white">{system.name}</p>
              <p className="text-sm text-slate-400">{system.note}</p>
            </div>
            <span className={`text-sm font-bold uppercase tracking-[0.16em] ${system.color}`}>{system.status}</span>
          </div>
        ))}
      </section>
    </AdminLayout>
  )
}

export default SystemStatusPage