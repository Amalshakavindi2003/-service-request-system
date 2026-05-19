function TeamDirectoryPage() {
  const members = [
    { name: 'Alice Chen', role: 'Support Lead', dept: 'IT Ops' },
    { name: 'Bob Smith', role: 'System Admin', dept: 'Infrastructure' },
    { name: 'Sarah Miller', role: 'Security Analyst', dept: 'InfoSec' },
  ]
  return (
    <div className="min-h-screen rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
      <h1 className="text-3xl font-bold text-white">Team Directory</h1>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70">
        <table className="w-full text-left">
          <thead className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase text-slate-400">
            <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Department</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {members.map(m => (
              <tr key={m.name} className="text-slate-300">
                <td className="px-6 py-4 font-medium text-white">{m.name}</td>
                <td className="px-6 py-4">{m.role}</td>
                <td className="px-6 py-4">{m.dept}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default TeamDirectoryPage