import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAdminContext from "./hooks/useAdminContext";
import { AdminContextType } from "./context/AdminContext";

const ProtectedLayout = () => {
  const { adminState } = useAdminContext() as AdminContextType;
  const location = useLocation();
  const redirect =
    location.pathname === "/" ? "/" : location.pathname.replace("/", "");
  if (!adminState) {
    return <Navigate to={`/login?redirect=${redirect}`} />;
  }
  return <Outlet />;
};

export default ProtectedLayout;
