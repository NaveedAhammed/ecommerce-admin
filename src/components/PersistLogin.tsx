import { useEffect, useState } from "react";
import { AdminContextType } from "../context/AdminContext";
import useAdminContext from "../hooks/useAdminContext";
import useRefreshToken from "../hooks/useRefreshToken";
import Loader from "./Loader";
import { Outlet } from "react-router-dom";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const refresh = useRefreshToken();
  const { adminState } = useAdminContext() as AdminContextType;

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        setIsLoading(true);
        await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    !adminState?.accessToken && verifyRefreshToken();
  }, [adminState, refresh]);

  return (
    <>
      {isLoading ? (
        <Loader width="5rem" height="5rem" color="black" />
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
