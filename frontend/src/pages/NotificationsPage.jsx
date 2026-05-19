function NotificationsPage() {
  const alerts = [
    { id: 1, title: 'Request resolved', msg: 'Your request #1024 has been closed.', time: '1h ago', read: false },
    { id: 2, title: 'Policy update', msg: 'The remote work policy was updated for Q3.', time: '5h ago', read: true },
  ]
  return (
    <div className="min-h-screen rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
      <h1 className="text-3xl font-bold text-white">Notifications</h1>
      <div className="mt-6 space-y-4">
        {alerts.map(a => (
          <div key={a.id} className={`p-4 rounded-xl border ${a.read ? 'border-slate-800 bg-slate-900/30' : 'border-cyan-500/30 bg-cyan-500/5'}`}>
            <div className="flex justify-between">
              <p className="font-semibold text-white">{a.title}</p>
              <span className="text-xs text-slate-500">{a.time}</span>
            </div>
            <p className="mt-1 text-sm text-slate-400">{a.msg}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default NotificationsPage