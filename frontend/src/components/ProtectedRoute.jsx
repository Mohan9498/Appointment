import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function ProtectedRoute({ children, adminOnly }) {

  const { user, token } = useAuthStore();

  // ❌ Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Not admin
  if (adminOnly && !user.is_admin) {
    return <Navigate to="/admin" replace />;
  }

  // ✅ Allowed
  return children;
}

export default ProtectedRoute;