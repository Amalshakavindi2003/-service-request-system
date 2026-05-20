import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRouteAdmin() {
  const { token, user, loadingAuth } = useAuth()

  if (loadingAuth) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white"><span>Loading...</span></div>
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'admin' && user?.role !== 'staff') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default ProtectedRouteAdmin