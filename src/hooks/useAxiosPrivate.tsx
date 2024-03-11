import { useEffect } from "react";
import { AdminContextType } from "../context/AdminContext";
import { privateAxios } from "../utils/axios";
import useRefreshToken from "./useRefreshToken";
import useAdminContext from "./useAdminContext";

const useAxiosPrivate = () => {
	const refresh = useRefreshToken();
	const { adminState } = useAdminContext() as AdminContextType;

	useEffect(() => {
		const requestIntercept = privateAxios.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					config.headers[
						"Authorization"
					] = `Bearer ${adminState?.accessToken}`;
				}
				return config;
			},
			(err) => {
				Promise.reject(err);
			}
		);

		const responseInercept = privateAxios.interceptors.response.use(
			(res) => res,
			async (error) => {
				const prevRequest = error?.config;
				if (error?.response?.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const newAccessToken = await refresh();
					prevRequest.headers[
						"Authorization"
					] = `Bearer ${newAccessToken}`;
					return privateAxios(prevRequest);
				}
				return Promise.reject(error);
			}
		);

		return () => {
			privateAxios.interceptors.response.eject(responseInercept);
			privateAxios.interceptors.request.eject(requestIntercept);
		};
	}, [refresh, adminState]);

	return privateAxios;
};

export default useAxiosPrivate;
