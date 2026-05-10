import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <div className="hero-bg min-h-screen text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-16">
        <p className="w-fit rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
          Portfolio Project
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
          Service Request Management System
        </h1>
        <p className="mt-6 max-w-2xl text-base text-slate-200 sm:text-lg">
          A professional full-stack platform for employees to submit service requests and for admins to track, manage, and resolve them efficiently.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/register" className="btn-primary">Get Started</Link>
          <Link to="/login" className="btn-secondary">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default LandingPage