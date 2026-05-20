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
    <div className="grid min-h-screen place-items-center p-6 bg-gradient-to-b from-[#061226] to-[#041022]">
      <form onSubmit={handleSubmit} className="card w-full max-w-lg p-0 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-primary-700 to-accent-500">
          <h1 className="text-3xl font-extrabold text-white">Service Desk</h1>
          <p className="text-sm text-primary-50/90 mt-1">Sign in to manage requests and tickets</p>
        </div>

        <div className="p-6 bg-surface">
          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="mt-1 text-sm text-muted">Access your dashboard to manage requests.</p>

          <div className="mt-5 rounded-lg border border-primary-600/20 bg-gradient-to-r from-primary-900/10 to-accent-900/6 p-3 text-sm text-primary-50">
            <strong>Demo access</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li><span className="font-semibold">User:</span> john@company.com / <span className="font-mono">Password@123</span></li>
              <li><span className="font-semibold">Admin:</span> admin@company.com / <span className="font-mono">Password@123</span></li>
            </ul>
            <p className="mt-2 text-xs text-muted">Use these only for demo/testing.</p>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={fillUserDemo} className="btn-outline">👤 Use User Demo</button>
            <button type="button" onClick={fillAdminDemo} className="btn-outline">🛠️ Use Admin Demo</button>
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