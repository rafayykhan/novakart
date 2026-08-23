import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../features/auth/authSlice";

// Wraps the routes that need a signed-in user. `state` carries where they
// were headed so login can send them back there instead of the homepage.
export default function ProtectedRoute() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
