import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

function ProfilePage() {
  const { user, saveProfile } = useAuth()
  const [form, setForm] = useState({ fullName: '', department: '', phone: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    setForm({
      fullName: user.full_name || '',
      department: user.department || '',
      phone: user.phone || '',
    })
  }, [user])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      await saveProfile(form)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card p-6">
      <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
      <p className="mt-1 text-sm text-slate-300">Keep your account details up to date.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:max-w-xl">
        <div>
          <label className="text-sm text-slate-300">Full Name</label>
          <input
            required
            value={form.fullName}
            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            className="input"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Department</label>
          <input
            value={form.department}
            onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
            className="input"
            placeholder="Operations, IT, Finance"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            className="input"
            placeholder="+1 555 000 1111"
          />
        </div>

        <button type="submit" className="btn-primary w-fit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </section>
  )
}

export default ProfilePage