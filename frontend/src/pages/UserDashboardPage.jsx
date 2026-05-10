import { useEffect, useMemo, useState } from 'react'
import { getMyRequestsApi } from '../api/requestApi'
import Spinner from '../components/common/Spinner'
import StatCard from '../components/common/StatCard'
import StatusBadge from '../components/common/StatusBadge'
import EmptyState from '../components/common/EmptyState'

function UserDashboardPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getMyRequestsApi()
        setRequests(data)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const stats = useMemo(() => {
    const total = requests.length
    const pending = requests.filter((item) => item.status === 'Pending').length
    const inProgress = requests.filter((item) => item.status === 'In Progress').length
    const completed = requests.filter((item) => item.status === 'Completed').length
    return { total, pending, inProgress, completed }
  }, [requests])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Requests" value={stats.total} />
        <StatCard label="Pending" value={stats.pending} accent="from-amber-500 to-orange-500" />
        <StatCard label="In Progress" value={stats.inProgress} accent="from-sky-500 to-indigo-500" />
        <StatCard label="Completed" value={stats.completed} accent="from-emerald-500 to-teal-500" />
      </div>

      <section className="card p-5">
        <h2 className="text-lg font-semibold text-white">Recent Requests</h2>
        {requests.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No service requests yet"
              subtitle="Create your first request from the Create Request page."
            />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-slate-300">
                <tr>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Priority</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 5).map((item) => (
                  <tr key={item.id} className="border-t border-slate-800 text-slate-200">
                    <td className="py-3">{item.title}</td>
                    <td className="py-3">{item.category}</td>
                    <td className="py-3">{item.priority}</td>
                    <td className="py-3"><StatusBadge status={item.status} /></td>
                    <td className="py-3">{new Date(item.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default UserDashboardPage