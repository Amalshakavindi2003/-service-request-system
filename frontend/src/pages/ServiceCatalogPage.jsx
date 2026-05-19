import { useNavigate } from 'react-router-dom'

const services = [
  { id: 1, name: 'Identity & Access', desc: 'Request new accounts, permissions, or password resets.', icon: '🔑' },
  { id: 2, name: 'Hardware & Devices', desc: 'Order laptops, monitors, or peripheral accessories.', icon: '💻' },
  { id: 3, name: 'Software & Apps', desc: 'Install enterprise software or request license keys.', icon: '📦' },
  { id: 4, name: 'Network & Connectivity', desc: 'VPN access, Wi-Fi issues, or desk phone setup.', icon: '🌐' },
]

function ServiceCatalogPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Catalog</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Service Catalog</h1>
          <p className="mt-2 text-slate-400">Select a category to start your request.</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">Back to Dashboard</button>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(s => (
          <div key={s.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 hover:border-cyan-500/50 transition-colors">
            <div className="text-4xl mb-4">{s.icon}</div>
            <h2 className="text-lg font-semibold text-white">{s.name}</h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">{s.desc}</p>
            <button className="mt-4 text-cyan-400 text-sm font-medium hover:underline">View forms →</button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default ServiceCatalogPage