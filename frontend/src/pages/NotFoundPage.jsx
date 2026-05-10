import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="hero-bg grid min-h-screen place-items-center p-6 text-center text-white">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">404</p>
        <h1 className="mt-3 text-4xl font-black">Page not found</h1>
        <p className="mt-2 text-slate-200">The page you requested does not exist.</p>
        <Link to="/" className="btn-primary mt-6 inline-block">Back to home</Link>
      </div>
    </div>
  )
}

export default NotFoundPage