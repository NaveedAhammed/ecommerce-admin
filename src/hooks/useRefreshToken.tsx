import { AxiosError } from "axios";
import { AdminContextType } from "../context/AdminContext";
import { AdminType } from "../types";
import { privateAxios } from "../utils/axios";
import useAdminContext from "./useAdminContext";

const useRefreshToken = () => {
	const { setAdminState } = useAdminContext() as AdminContextType;

	const refresh = async () => {
		try {
			const res = (await privateAxios.get("/refresh")).data;
			const { user, accessToken } = res.data;
			const admin: AdminType = {
				username: user.username,
				avatar: user?.avatar,
				accessToken,
				id: user.id,
			};
			setAdminState(admin);
			return res.data.accessToken;
		} catch (err) {
			console.log(err);
			const error = err as AxiosError;
			if (error?.response?.status === 401) {
				setAdminState(null);
				localStorage.setItem("isLoggedIn", "false");
			}
		}
	};

	return refresh;
};

export default useRefreshToken;
