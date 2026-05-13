import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createRequestApi } from '../api/requestApi'

function CreateRequestPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', category: 'IT Support', priority: 'Medium' })
  const [loading, setLoading] = useState(false)

  const categories = ['IT Support', 'Hardware', 'Software', 'Network', 'Security', 'Other']
  const priorities = ['Low', 'Medium', 'High', 'Critical']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Please fill all fields')
      return
    }
    try {
      setLoading(true)
      await createRequestApi(form)
      toast.success('Request created successfully!')
      navigate('/dashboard/request-history')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-[250px_1fr]">
      <nav className="border-r border-slate-700 bg-slate-800 p-6">
        <div className="mb-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 p-4">
          <h2 className="text-xl font-bold text-white">Service Request System</h2>
        </div>
        <ul className="space-y-2">
          <li><button onClick={() => navigate('/dashboard')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white">📊 Dashboard</button></li>
          <li><button onClick={() => navigate('/dashboard/create-request')} className="w-full text-left rounded px-3 py-2 bg-cyan-500 text-white">➕ Create Request</button></li>
          <li><button onClick={() => navigate('/dashboard/request-history')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white">📋 Request History</button></li>
          <li><button onClick={() => navigate('/dashboard/profile')} className="w-full text-left rounded px-3 py-2 hover:bg-slate-700 text-white">👤 Profile</button></li>
        </ul>
      </nav>

      <main className="p-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Request</h1>
          <p className="text-slate-400 mb-8">Submit a new service request to our support team</p>

          <form onSubmit={handleSubmit} className="card p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Request Title *</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g., Laptop not connecting to Wi-Fi" className="input w-full" />
              <p className="text-xs text-slate-500 mt-1">Keep it concise and descriptive</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
              <textarea required value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Describe your issue in detail..." className="input w-full resize-none" rows="6"></textarea>
              <p className="text-xs text-slate-500 mt-1">Include any error messages or steps to reproduce the issue</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
                <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="input w-full">
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Priority *</label>
                <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})} className="input w-full">
                  {priorities.map(pri => <option key={pri} value={pri}>{pri}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Creating...' : 'Create Request'}</button>
              <button type="button" onClick={() => navigate('/dashboard')} className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded">Cancel</button>
            </div>
          </form>

          <div className="mt-8 p-4 rounded-lg bg-cyan-600/10 border border-cyan-600/30">
            <h3 className="font-bold text-cyan-400 mb-2">💡 Tips for better requests:</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>✓ Be specific about what is not working</li>
              <li>✓ Include any error messages you see</li>
              <li>✓ Set appropriate priority level</li>
              <li>✓ You can add comments after creation for updates</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreateRequestPage