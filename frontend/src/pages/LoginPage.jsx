import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: 'john@company.com', password: 'Password@123' })
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const user = await login(form)
      if (from) {
        navigate(from, { replace: true })
      } else {
        navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
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
          Demo: john@company.com / Password@123 | Or admin@company.com for admin
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