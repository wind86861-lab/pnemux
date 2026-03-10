import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Layout from '../components/Layout'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AdminProducts from './admin/AdminProducts'
import AdminCategories from './admin/AdminCategories'
import AdminBlogs from './admin/AdminBlogs'
import AdminBranches from './admin/AdminBranches'
import AdminFAQ from './admin/AdminFAQ'
import AdminRequests from './admin/AdminRequests'
import AdminPages from './admin/AdminPages'
import AdminSettings from './admin/AdminSettings'
import AdminTeam from './admin/AdminTeam'
import AdminOrders from './admin/AdminOrders'

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}

function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return isAuthenticated ? <Navigate to="/admin" replace /> : children
}

export default function Admin() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <Routes>
      <Route path="login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="branches" element={<AdminBranches />} />
        <Route path="faq" element={<AdminFAQ />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="pages" element={<AdminPages />} />
        <Route path="team" element={<AdminTeam />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  )
}
