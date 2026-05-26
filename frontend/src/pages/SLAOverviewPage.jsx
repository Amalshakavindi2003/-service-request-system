import { Gauge } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'

function SLAOverviewPage() {
  const pps = [
    { level: 'P1 - Critical', target: '1 Hour', current: '98.5%' },
    { level: 'P2 - High', target: '4 Hours', current: '99.2%' },
    { level: 'P3 - Medium', target: '1 Business Day', current: '97.8%' },
  ]

  return (
    <AdminLayout
      title="SLA Overview"
      subtitle="A clean read on service-level targets and compliance health."
      actions={<div className="btn-outline"><Gauge size={16} /> Compliance</div>}
    >
      <section className="grid gap-4">
        {pps.map((item) => (
          <div key={item.level} className="card flex items-center justify-between gap-4 rounded-[1.5rem]">
            <div>
              <p className="text-lg font-semibold text-white">{item.level}</p>
              <p className="text-sm text-slate-400">Response Target: {item.target}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-cyan-300">{item.current}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Compliance</p>
            </div>
          </div>
        ))}
      </section>
    </AdminLayout>
  )
}

export default SLAOverviewPage