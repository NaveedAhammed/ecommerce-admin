import { useContext } from "react";
import { ManageSizeContext } from "../context/ManageSizeContext";

export const useManageSizeContext = () => {
  const context = useContext(ManageSizeContext);
  return context;
};
