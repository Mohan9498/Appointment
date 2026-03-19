import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly }) {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  if (!token) return <Navigate to="/login" />;

  if (adminOnly && !isAdmin) return <Navigate to="/client" />;

  return children;
}

export default ProtectedRoute;