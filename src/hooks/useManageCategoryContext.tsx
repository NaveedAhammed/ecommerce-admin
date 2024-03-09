import { useContext } from "react";
import { ManageCategoryContext } from "../context/ManageCategoryContext";

export const useManageCategoryContext = () => {
  const context = useContext(ManageCategoryContext);
  return context;
};
