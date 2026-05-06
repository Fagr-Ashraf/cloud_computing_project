import { Navigate } from 'react-router-dom';
import { getAuthUser } from '../utils/auth';

export default function ProtectedRoute({ allowRoles, children }) {
  const user = getAuthUser();
  if (!user) return <Navigate to="/login" replace />;
  if (Array.isArray(allowRoles) && allowRoles.length > 0 && !allowRoles.includes(user.role)) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/user'} replace />;
  }
  return children;
}

