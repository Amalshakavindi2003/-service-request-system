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
    <div className="grid min-h-screen grid-cols-[240px_1fr] bg-gradient-to-b from-[#041226] to-[#051027]">
      <nav className="sidebar">
        <div className="brand">Service Request System</div>
        <nav>
          <a href="/dashboard">📊 Dashboard</a>
          <a href="/dashboard/create-request" className="active">➕ Create Request</a>
          <a href="/dashboard/request-history">📋 Request History</a>
          <a href="/dashboard/profile">👤 Profile</a>
        </nav>
      </nav>

      <main className="main">
        <div className="max-w-3xl">
          <div className="header">
            <div>
              <h1 className="text-3xl font-bold">Create New Request</h1>
              <p className="text-muted mt-1">Submit a new service request to our support team</p>
            </div>
            <div></div>
          </div>

          <form onSubmit={handleSubmit} className="card p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Request Title *</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g., Laptop not connecting to Wi-Fi" className="input w-full" />
              <p className="text-xs text-muted mt-1">Keep it concise and descriptive</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-2">Description *</label>
              <textarea required value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Describe your issue in detail..." className="input w-full resize-none" rows="6"></textarea>
              <p className="text-xs text-muted mt-1">Include any error messages or steps to reproduce the issue</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Category *</label>
                <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="input w-full">
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Priority *</label>
                <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})} className="input w-full">
                  {priorities.map(pri => <option key={pri} value={pri}>{pri}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={loading} className="btn btn-primary flex-1">{loading ? 'Creating...' : 'Create Request'}</button>
              <button type="button" onClick={() => navigate('/dashboard')} className="btn-outline px-6">Cancel</button>
            </div>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary-900/10 to-accent-900/6 border border-primary-700/20">
            <h3 className="font-bold text-accent-500 mb-2">💡 Tips for better requests:</h3>
            <ul className="text-sm text-muted space-y-1">
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