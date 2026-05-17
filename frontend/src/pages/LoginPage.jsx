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

  const fillUserDemo = () => {
    setForm({ email: 'john@company.com', password: 'Password@123' })
  }

  const fillAdminDemo = () => {
    setForm({ email: 'admin@company.com', password: 'Password@123' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const user = await login(form)
      if (from) {
        navigate(from, { replace: true })
      } else {
        navigate(user.role === 'admin' || user.role === 'staff' ? '/admin' : '/dashboard', { replace: true })
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="hero-bg grid min-h-screen place-items-center p-6">
      <form onSubmit={handleSubmit} className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-white">Sign In</h1>
        <p className="mt-1 text-sm text-slate-300">Access your dashboard to manage requests.</p>

        <div className="mt-4 rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-3 text-sm text-cyan-100">
          <strong>Demo credentials</strong>
          <ul className="mt-1 list-disc list-inside">
            <li><strong>User</strong>: john@company.com — <span className="font-mono">Password@123</span></li>
            <li><strong>Admin</strong>: admin@company.com — <span className="font-mono">Password@123</span></li>
          </ul>
          <p className="mt-2 text-xs text-slate-200/80">These demo accounts are for evaluation only. Do not use real credentials in production.</p>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={fillUserDemo} className="rounded border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700">Use User Demo</button>
          <button type="button" onClick={fillAdminDemo} className="rounded border border-cyan-500/40 px-3 py-2 text-sm text-cyan-200 hover:bg-cyan-500/10">Use Admin Demo</button>
        </div>

        <label className="mt-6 block text-sm text-slate-300">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          className="input"
          placeholder="you@company.com"
        />

        <label className="mt-4 block text-sm text-slate-300">Password</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          className="input"
          placeholder="Enter password"
        />

        <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-70">
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p className="mt-4 text-sm text-slate-300">
          New here? <Link to="/register" className="text-cyan-300 hover:text-cyan-200">Create account</Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage