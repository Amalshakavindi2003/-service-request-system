import { useNavigate } from 'react-router-dom'
function SystemStatusPage() {
  const navigate = useNavigate()
  const systems = [
    { name: 'API Gateway', status: 'Healthy', note: 'No active incidents', color: 'text-emerald-400' },
    { name: 'Database', status: 'Healthy', note: 'Latency < 10ms', color: 'text-emerald-400' },
    { name: 'Mail Server', status: 'Degraded', note: 'Queue processing slowdown', color: 'text-amber-400' },
  ]
  return (
    <div className="min-h-screen rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
      <h1 className="text-3xl font-bold text-white">System Status</h1>
      <div className="mt-6 grid gap-4">
        {systems.map(s => (
          <div key={s.name} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <div>
              <p className="text-white font-medium">{s.name}</p>
              <p className="text-sm text-slate-500">{s.note}</p>
            </div>
            <span className={`text-sm font-bold uppercase ${s.color}`}>{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
export default SystemStatusPage