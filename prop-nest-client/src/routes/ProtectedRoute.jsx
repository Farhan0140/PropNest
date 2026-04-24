import { Navigate, Outlet } from "react-router-dom";
import useAuthContext from "../hooks/Auth/useAuthContext";
import LoadingAnimation from "../components/Message/LoadingAnimation";

const ProtectedRoute = ({ allowedRoles }) => {
  const {user, isLoading} = useAuthContext();
  
  if(isLoading) {
    return <LoadingAnimation />
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;