import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("access");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  //  No token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    

    //  Token expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }


    if (adminOnly && !isAdmin) {
      return <Navigate to="/login" replace />;
    }

    return children;

  } catch (error) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;