import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireRole = ({ role, children }) => {
  const { auth } = useAuth();

  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  if (auth.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RequireRole;
