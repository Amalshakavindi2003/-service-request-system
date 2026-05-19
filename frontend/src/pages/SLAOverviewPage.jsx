function SLAOverviewPage() {
  const pps = [
    { level: 'P1 - Critical', target: '1 Hour', current: '98.5%' },
    { level: 'P2 - High', target: '4 Hours', current: '99.2%' },
    { level: 'P3 - Medium', target: '1 Business Day', current: '97.8%' },
  ]
  return (
    <div className="min-h-screen rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
      <h1 className="text-3xl font-bold text-white">SLA Overview</h1>
      <div className="mt-8 grid gap-4">
        {pps.map(p => (
          <div key={p.level} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <div>
              <p className="text-lg font-semibold text-white">{p.level}</p>
              <p className="text-sm text-slate-400">Response Target: {p.target}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-cyan-400">{p.current}</p>
              <p className="text-xs text-slate-500 uppercase">Compliance</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default SLAOverviewPage