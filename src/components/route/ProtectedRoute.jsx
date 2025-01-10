import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowRoles }) {
  const authContext = useContext(AuthContext);
  const { user, loading } = authContext;
  if (loading) {
    return <div>Loading...</div>; // Hoặc có thể dùng Spinner, Loader tùy theo yêu cầu
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!user.roles.some((role) => allowRoles.includes(role))) {
    return <Navigate to="/unauthorize" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
