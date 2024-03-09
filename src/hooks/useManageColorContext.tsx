import { useContext } from "react";
import { ManageColorContext } from "../context/ManageColorContext";

export const useManageColorContext = () => {
  const context = useContext(ManageColorContext);
  return context;
};
