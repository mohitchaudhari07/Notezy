import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/common/Loader";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";

export default function GuestRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}
