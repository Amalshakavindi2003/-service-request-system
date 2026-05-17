import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CreateRequestPage from './pages/CreateRequestPage'
import RequestHistoryPage from './pages/RequestHistoryPage'
import ProfilePage from './pages/ProfilePage'
import RequestDetailPage from './pages/RequestDetailPage'
import AdminDashboard from './pages/AdminDashboard'
import AnalyticsPage from './pages/AnalyticsPage'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedRouteAdmin from './components/ProtectedRouteAdmin'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/create-request" element={<CreateRequestPage />} />
        <Route path="/dashboard/request-history" element={<RequestHistoryPage />} />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
        <Route path="/request/:requestId" element={<RequestDetailPage />} />
      </Route>

      <Route element={<ProtectedRouteAdmin />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/requests" element={<AdminDashboard />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App