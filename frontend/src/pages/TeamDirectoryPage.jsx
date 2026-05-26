import { Users, UserCog } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'

function TeamDirectoryPage() {
  const members = [
    { name: 'Alice Chen', role: 'Support Lead', dept: 'IT Ops' },
    { name: 'Bob Smith', role: 'System Admin', dept: 'Infrastructure' },
    { name: 'Sarah Miller', role: 'Security Analyst', dept: 'InfoSec' },
  ]

  return (
    <AdminLayout
      title="Team Directory"
      subtitle="A concise view of the people keeping the service desk moving."
      actions={<div className="btn-outline"><UserCog size={16} /> Directory</div>}
    >
      <section className="card overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-white">Support Team</h2>
            <p className="page-subtitle mt-1 text-sm">Internal contact list for operations and support routing.</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-slate-300">
            <Users size={14} className="mr-2 inline" /> {members.length} members
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.name}>
                <td className="font-medium text-white">{member.name}</td>
                <td>{member.role}</td>
                <td>{member.dept}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AdminLayout>
  )
}

export default TeamDirectoryPage