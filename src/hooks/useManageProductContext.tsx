import { useContext } from "react";
import { ManageProductContext } from "../context/ManageProductContext";

export const useManageProductContext = () => {
  const context = useContext(ManageProductContext);
  return context;
};
