import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'

/**
 * Protected route wrapper.
 * Redirects to login if user is not authenticated.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner fullPage />

  if (!user) return <Navigate to="/login" replace />

  return children
}
