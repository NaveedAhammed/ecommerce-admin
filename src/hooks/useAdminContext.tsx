import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";

const useAdminContext = () => {
  const context = useContext(AdminContext);
  return context;
};

export default useAdminContext;
