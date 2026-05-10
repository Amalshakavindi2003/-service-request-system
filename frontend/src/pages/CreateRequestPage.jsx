import { useState } from 'react'
import toast from 'react-hot-toast'
import { createRequestApi } from '../api/requestApi'

const initialForm = {
  title: '',
  description: '',
  category: '',
  priority: 'Medium',
}

function CreateRequestPage() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      await createRequestApi(form)
      toast.success('Request submitted successfully')
      setForm(initialForm)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card p-6">
      <h2 className="text-xl font-semibold text-white">Create Service Request</h2>
      <p className="mt-1 text-sm text-slate-300">Provide clear details for faster resolution.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <div>
          <label className="text-sm text-slate-300">Request Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            className="input"
            placeholder="Example: Laptop not powering on"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Category</label>
          <input
            required
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            className="input"
            placeholder="IT Support, Facilities, HR"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
            className="input"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-300">Description</label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className="input"
            placeholder="Describe the issue with as much detail as possible..."
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-fit disabled:opacity-70">
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </section>
  )
}

export default CreateRequestPage