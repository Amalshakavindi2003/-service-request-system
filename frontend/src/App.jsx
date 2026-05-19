import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CreateRequestPage from './pages/CreateRequestPage'
import RequestHistoryPage from './pages/RequestHistoryPage'
import ProfilePage from './pages/ProfilePage'
import RequestDetailPage from './pages/RequestDetailPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminRequests from './pages/AdminRequests'
import AdminAudit from './pages/AdminAudit'
import AnalyticsPage from './pages/AnalyticsPage'

// New imports
import ServiceCatalogPage from './pages/ServiceCatalogPage'
import HelpCenterPage from './pages/HelpCenterPage'
import NotificationsPage from './pages/NotificationsPage'
import TeamDirectoryPage from './pages/TeamDirectoryPage'
import SLAOverviewPage from './pages/SLAOverviewPage'
import SystemStatusPage from './pages/SystemStatusPage'

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
        <Route path="/dashboard/service-catalog" element={<ServiceCatalogPage />} />
        <Route path="/dashboard/help-center" element={<HelpCenterPage />} />
        <Route path="/dashboard/notifications" element={<NotificationsPage />} />
        <Route path="/request/:requestId" element={<RequestDetailPage />} />
      </Route>

      <Route element={<ProtectedRouteAdmin />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/requests" element={<AdminRequests />} />
        <Route path="/admin/audit" element={<AdminAudit />} />
        <Route path="/admin/team" element={<TeamDirectoryPage />} />
        <Route path="/admin/sla" element={<SLAOverviewPage />} />
        <Route path="/admin/system-status" element={<SystemStatusPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App