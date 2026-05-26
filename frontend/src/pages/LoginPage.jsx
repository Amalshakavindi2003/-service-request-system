import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LayoutGrid, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const from = location.state?.from?.pathname

  const fillUserDemo = () => setForm({ email: 'john@company.com', password: 'Password@123' })
  const fillAdminDemo = () => setForm({ email: 'admin@company.com', password: 'Password@123' })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const user = await login(form)
      navigate(from || (user.role === 'admin' || user.role === 'staff' ? '/admin' : '/dashboard'), { replace: true })
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 56, height: 56, display: 'grid', placeItems: 'center', borderRadius: 18, background: 'rgba(255, 255, 255, 0.16)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)' }}>
              <LayoutGrid size={26} />
            </div>
            <div>
              <p className="hero-card__eyebrow" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '0.3rem' }}>Service Desk</p>
              <h1 style={{ margin: 0, fontSize: '1.9rem', lineHeight: 1.05 }}>Sign in to manage requests</h1>
            </div>
          </div>
        </div>

        <div className="auth-card-body">
          <h2 style={{ marginTop: 0, marginBottom: '0.35rem', fontSize: '1.15rem' }}>Welcome back</h2>
          <p className="page-subtitle" style={{ marginTop: 0 }}>Use your workspace account or try the demo accounts below.</p>

          <div className="demo-box" style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', fontWeight: 700 }}>
              <ShieldCheck size={16} /> Demo access
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: '0.45rem' }}>
              <li><span className="font-semibold">User:</span> john@company.com / <span className="font-mono">Password@123</span></li>
              <li><span className="font-semibold">Admin:</span> admin@company.com / <span className="font-mono">Password@123</span></li>
            </ul>
          </div>

          <div className="demo-actions" style={{ marginTop: '1rem' }}>
            <button type="button" onClick={fillUserDemo} className="btn-outline"><ShieldCheck size={16} /> User demo</button>
            <button type="button" onClick={fillAdminDemo} className="btn-outline"><LayoutGrid size={16} /> Admin demo</button>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <label className="block text-sm text-muted">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className="input mt-2" placeholder="you@company.com" />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label className="block text-sm text-muted">Password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} className="input mt-2" placeholder="Enter password" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-70">{loading ? 'Signing in...' : 'Login'}</button>

          <p className="mt-4 text-sm text-muted">New here? <Link to="/register" className="text-[color:var(--accent-400)] hover:text-white">Create account</Link></p>
        </div>
      </form>
    </div>
  )
}

export default LoginPage