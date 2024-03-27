import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAdminContext from "./hooks/useAdminContext";
import { AdminContextType } from "./context/AdminContext";

const ProtectedLayout = () => {
	const { adminState } = useAdminContext() as AdminContextType;
	const location = useLocation();
	if (!adminState) {
		return (
			<Navigate
				to={`/login?redirect=${location.pathname}`}
				replace
				state={{ redirect: location }}
			/>
		);
	}
	return <Outlet />;
};

export default ProtectedLayout;
