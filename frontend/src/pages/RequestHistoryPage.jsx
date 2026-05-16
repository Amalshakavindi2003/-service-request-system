import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getMyRequestsApi } from '../api/requestApi'
import Spinner from '../components/common/Spinner'
import StatusBadge from '../components/common/StatusBadge'
import EmptyState from '../components/common/EmptyState'

function RequestHistoryPage() {
  const [requests, setRequests] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await getMyRequestsApi()
        const normalizedRequests = Array.isArray(data) ? data : data?.requests || []
        setRequests(normalizedRequests)
      } catch (error) {
        toast.error(error?.message || 'Failed to load request history')
        setRequests([])
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const filtered = useMemo(() => {
    return requests.filter((item) => {
      const keyword = search.toLowerCase()
      const title = (item?.title || '').toLowerCase()
      const category = (item?.category || '').toLowerCase()
      const status = (item?.status || '').toLowerCase()

      return title.includes(keyword) || category.includes(keyword) || status.includes(keyword)
    })
  }, [requests, search])

  if (loading) {
    return <Spinner />
  }

  return (
    <section className="card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-white">Request History</h2>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input max-w-xs"
          placeholder="Search your requests"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="No matching requests"
            subtitle="Try another keyword or create a new service request."
          />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-slate-300">
              <tr>
                <th className="pb-3">ID</th>
                <th className="pb-3">Title</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-slate-800 text-slate-200">
                  <td className="py-3">#{item.id}</td>
                  <td className="py-3">{item.title}</td>
                  <td className="py-3">{item.category}</td>
                  <td className="py-3">{item.priority}</td>
                  <td className="py-3"><StatusBadge status={item.status} /></td>
                  <td className="py-3">{new Date(item.updated_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default RequestHistoryPage