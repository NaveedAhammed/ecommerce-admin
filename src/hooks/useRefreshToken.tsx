import { AdminContextType } from "../context/AdminContext";
import { AdminType } from "../types";
import { privateAxios } from "../utils/axios";
import useAdminContext from "./useAdminContext";

const useRefreshToken = () => {
  const { setAdmin } = useAdminContext() as AdminContextType;

  const refresh = async () => {
    const res = (await privateAxios.get("/refresh")).data;
    console.log(res);
    const { user, accessToken } = res.data;
    const admin: AdminType = {
      username: user.username,
      avatar: user?.avatar,
      accessToken,
      id: user.id,
    };
    setAdmin(admin);
    return res.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
