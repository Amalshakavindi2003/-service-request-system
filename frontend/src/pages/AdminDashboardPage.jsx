import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  deleteRequestApi,
  getAllRequestsApi,
  updateRequestStatusApi,
} from '../api/requestApi'
import Spinner from '../components/common/Spinner'
import StatCard from '../components/common/StatCard'
import StatusBadge from '../components/common/StatusBadge'
import EmptyState from '../components/common/EmptyState'

function AdminDashboardPage() {
  const [requests, setRequests] = useState([])
  const [filters, setFilters] = useState({ search: '', status: '' })
  const [loading, setLoading] = useState(true)

  const fetchRequests = async (query = filters) => {
    const { data } = await getAllRequestsApi(query)
    setRequests(data)
  }

  useEffect(() => {
    const load = async () => {
      try {
        await fetchRequests()
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleSearch = async (event) => {
    event.preventDefault()
    try {
      await fetchRequests(filters)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await updateRequestStatusApi(requestId, { status })
      toast.success('Status updated')
      await fetchRequests(filters)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (requestId) => {
    if (!window.confirm('Delete this request permanently?')) return

    try {
      await deleteRequestApi(requestId)
      toast.success('Request deleted')
      await fetchRequests(filters)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((item) => item.status === 'Pending').length,
      inProgress: requests.filter((item) => item.status === 'In Progress').length,
      completed: requests.filter((item) => item.status === 'Completed').length,
    }
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
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <input
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="input"
            placeholder="Search by title, user, or description"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="input sm:max-w-[220px]"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button type="submit" className="btn-primary sm:w-auto">Apply</button>
        </form>

        {requests.length === 0 ? (
          <div className="mt-5">
            <EmptyState title="No requests found" subtitle="Adjust your filters and try again." />
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="text-slate-300">
                <tr>
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Requester</th>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Priority</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Created</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((item) => (
                  <tr key={item.id} className="border-t border-slate-800 text-slate-200">
                    <td className="py-3">#{item.id}</td>
                    <td className="py-3">
                      <p>{item.full_name}</p>
                      <p className="text-xs text-slate-400">{item.email}</p>
                    </td>
                    <td className="py-3">{item.title}</td>
                    <td className="py-3">{item.priority}</td>
                    <td className="py-3"><StatusBadge status={item.status} /></td>
                    <td className="py-3">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <select
                          className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs"
                          value={item.status}
                          onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                        <button
                          type="button"
                          className="rounded-lg border border-rose-500/40 px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/10"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
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

export default AdminDashboardPage