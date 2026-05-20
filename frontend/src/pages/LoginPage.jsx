import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
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
      <form onSubmit={handleSubmit} className="card w-full max-w-md p-0">
        <div className="auth-card-header flex items-center gap-4 p-4">
          <div style={{width:56, height:56, display:'grid', placeItems:'center', borderRadius:10, background:'rgba(255,255,255,0.04)'}}>
            <span style={{fontSize:22}}>🛠️</span>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Service Desk</h1>
            <p className="text-sm text-primary-50/90 mt-1">Sign in to manage requests</p>
          </div>
        </div>

        <div className="auth-card-body p-6">
          <h2 className="text-lg font-bold text-white">Welcome back</h2>
          <p className="mt-1 text-sm text-muted">Access your dashboard to manage requests.</p>

          <div className="demo-box mt-4">
            <strong>Demo access</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li><span className="font-semibold">User:</span> john@company.com / <span className="font-mono">Password@123</span></li>
              <li><span className="font-semibold">Admin:</span> admin@company.com / <span className="font-mono">Password@123</span></li>
            </ul>
            <p className="mt-2 text-xs text-muted">Use these only for demo/testing.</p>
          </div>

          <div className="demo-actions mt-4">
            <button type="button" onClick={fillUserDemo} className="btn-outline">👤 User demo</button>
            <button type="button" onClick={fillAdminDemo} className="btn-outline">🛠️ Admin demo</button>
          </div>

          <div className="mt-6">
            <label className="block text-sm text-muted">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className="input mt-2" placeholder="you@company.com" />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-muted">Password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} className="input mt-2" placeholder="Enter password" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-70">{loading ? 'Signing in...' : 'Login'}</button>

          <p className="mt-4 text-sm text-muted">New here? <Link to="/register" className="text-accent-500 hover:underline">Create account</Link></p>
        </div>
      </form>
    </div>
  )
}

export default LoginPage