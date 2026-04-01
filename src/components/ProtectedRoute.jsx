import { Navigate } from 'react-router-dom'
import { getSession } from '../utils/sessionManager'

export default function ProtectedRoute({ children, role }) {
  const session = getSession()

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (role && session.role !== role) {
    return <Navigate to="/blogs" replace />
  }

  return children
}