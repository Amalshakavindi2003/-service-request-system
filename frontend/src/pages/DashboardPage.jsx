import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getMyRequestsApi } from '../api/requestApi'

function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const { data } = await getMyRequestsApi()
      setRequests(data.requests || [])
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'staff'
  const stats = [
    { label: 'Total Requests', value: requests.length, color: 'bg-blue-600' },
    { label: 'Pending', value: requests.filter(r => r.status === 'Pending').length, color: 'bg-yellow-600' },
    { label: 'In Progress', value: requests.filter(r => r.status === 'In Progress').length, color: 'bg-cyan-600' },
    { label: 'Completed', value: requests.filter(r => r.status === 'Completed').length, color: 'bg-green-600' },
  ]

  return (
    <div className="grid min-h-screen grid-cols-[250px_1fr]">
      <nav className="border-r border-slate-700 bg-slate-800 p-6 shadow-xl">
        <div className="mb-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 p-4">
          <h2 className="text-xl font-bold text-white">Service Desk</h2>
          <p className="text-xs text-cyan-100 mt-1 uppercase tracking-wider">{user?.role}</p>
        </div>
        <ul className="space-y-2">
          <li><button onClick={() => navigate('/dashboard')} className="w-full text-left rounded px-3 py-2 bg-cyan-600 text-white font-bold">📊 Dashboard</button></li>
          <li><button onClick={() => navigate('/dashboard/service-catalog')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white transition-colors">📦 Service Catalog</button></li>
          <li><button onClick={() => navigate('/dashboard/create-request')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white transition-colors">➕ Create Request</button></li>
          <li><button onClick={() => navigate('/dashboard/request-history')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white transition-colors">📋 Request History</button></li>
          <li><button onClick={() => navigate('/dashboard/notifications')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white transition-colors">🔔 Notifications</button></li>
          <li><button onClick={() => navigate('/dashboard/help-center')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white transition-colors">❓ Help Center</button></li>
          <li><button onClick={() => navigate('/dashboard/profile')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white transition-colors">👤 Profile</button></li>
          {isAdmin && (
            <>
              <li className="my-4 border-t border-slate-600 pt-4 text-xs uppercase text-slate-500 font-bold">Admin</li>
              <li><button onClick={() => navigate('/admin')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white">⚙️ Admin Portal</button></li>
            </>
          )}
          <li><button onClick={() => { logout(); navigate('/login') }} className="w-full mt-6 rounded bg-red-600/20 text-red-400 border border-red-600/50 px-3 py-2 hover:bg-red-600 hover:text-white transition-all">🚪 Logout</button></li>
        </ul>
      </nav>

      <main className="p-8 bg-slate-900 overflow-y-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Hello, {user?.full_name?.split(' ')[0]}!</h1>
            <p className="text-slate-400 mt-1">Here is what is happening with your requests today.</p>
          </div>
          <button onClick={() => navigate('/dashboard/create-request')} className="btn-primary">New Request</button>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div onClick={() => navigate('/dashboard/service-catalog')} className="cursor-pointer p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-cyan-500 transition-all">
            <h4 className="text-white font-semibold">Browse Catalog</h4>
            <p className="text-slate-400 text-xs mt-1">Find the right service for your needs.</p>
          </div>
          <div onClick={() => navigate('/dashboard/help-center')} className="cursor-pointer p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-cyan-500 transition-all">
            <h4 className="text-white font-semibold">Get Help</h4>
            <p className="text-slate-400 text-xs mt-1">Read FAQs or contact our tech support.</p>
          </div>
          <div onClick={() => navigate('/dashboard/notifications')} className="cursor-pointer p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-cyan-500 transition-all">
            <h4 className="text-white font-semibold">Recent Alerts</h4>
            <p className="text-slate-400 text-xs mt-1">View your latest system and request updates.</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className={`p-6 rounded-2xl shadow-lg ${stat.color} bg-opacity-90`}>
              <p className="text-white/70 text-sm font-medium">{stat.label}</p>
              <h3 className="text-4xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="card p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Active Requests</h2>
            <button onClick={() => navigate('/dashboard/request-history')} className="text-cyan-400 text-sm hover:underline">View All</button>
          </div>
          {loading ? (
            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div></div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
              <p className="text-slate-400">No active service requests</p>
              <button onClick={() => navigate('/dashboard/create-request')} className="text-cyan-400 font-medium mt-2 hover:underline">Submit one now</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-700">
                    <th className="pb-3 px-2">Title</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 text-center">Priority</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right px-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {requests.slice(0, 5).map(req => (
                    <tr key={req.id} className="hover:bg-slate-700/30 transition-colors group">
                      <td className="py-4 px-2 font-medium text-slate-200">{req.title}</td>
                      <td className="py-4 text-slate-400 text-sm">{req.category}</td>
                      <td className="py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${req.priority === 'High' ? 'bg-red-500/10 text-red-500' : req.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{req.priority}</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${req.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : req.status === 'In Progress' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-slate-500/10 text-slate-400'}`}>{req.status}</span>
                      </td>
                      <td className="py-4 text-right px-2"><button onClick={() => navigate(`/request/${req.id}`)} className="text-slate-400 group-hover:text-cyan-400">View →</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DashboardPage