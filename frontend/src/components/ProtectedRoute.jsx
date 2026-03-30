import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function ProtectedRoute({ children, adminOnly }) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  if (!token) return <Navigate to="/login" />;

  if (adminOnly && !user?.is_admin) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;