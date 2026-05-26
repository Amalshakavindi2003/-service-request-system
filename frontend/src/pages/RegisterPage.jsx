import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      await register(form)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <form onSubmit={handleSubmit} className="auth-card card p-0">
        <div className="auth-card-header">
          <p className="hero-card__eyebrow" style={{ color: 'rgba(255,255,255,0.8)' }}>Create account</p>
          <h1 style={{ margin: 0, fontSize: '1.9rem', lineHeight: 1.05 }}>Start submitting requests in minutes</h1>
          <p style={{ margin: '0.6rem 0 0', color: 'rgba(255,255,255,0.88)' }}>A cleaner workspace for tickets, history, and updates.</p>
        </div>

        <div className="auth-card-body">
          <div className="demo-box" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.45rem', fontWeight: 700 }}><Sparkles size={16} /> Fast setup</div>
            <p style={{ margin: 0, color: 'var(--muted)' }}>Register once and keep track of all requests from one place.</p>
          </div>

          <label className="block text-sm text-muted">Full Name</label>
          <input type="text" required value={form.fullName} onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))} className="input mt-2" placeholder="Your full name" />

          <label className="mt-4 block text-sm text-muted">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className="input mt-2" placeholder="you@company.com" />

          <label className="mt-4 block text-sm text-muted">Password</label>
          <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} className="input mt-2" placeholder="Minimum 6 characters" />

          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-70">{loading ? 'Creating account...' : 'Register'}</button>

          <p className="mt-4 text-sm text-muted">Already have an account? <Link to="/login" className="text-[color:var(--accent-400)] hover:text-white">Login</Link></p>
        </div>
      </form>
    </div>
  )
}

export default RegisterPage