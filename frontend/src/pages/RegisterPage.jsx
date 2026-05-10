import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
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
    <div className="hero-bg grid min-h-screen place-items-center p-6">
      <form onSubmit={handleSubmit} className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-white">Create Account</h1>
        <p className="mt-1 text-sm text-slate-300">Start submitting service requests in minutes.</p>

        <label className="mt-6 block text-sm text-slate-300">Full Name</label>
        <input
          type="text"
          required
          value={form.fullName}
          onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
          className="input"
          placeholder="Your full name"
        />

        <label className="mt-4 block text-sm text-slate-300">Email</label>
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
          minLength={6}
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          className="input"
          placeholder="Minimum 6 characters"
        />

        <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-70">
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="mt-4 text-sm text-slate-300">
          Already have an account? <Link to="/login" className="text-cyan-300 hover:text-cyan-200">Login</Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage