import { createContext, useState } from "react";
import { CategoryType } from "../types";

export type ManageCategoryContextType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data: CategoryType;
  setData: (data: CategoryType) => void;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
};

const defaultState: CategoryType = {
  _id: "",
  name: "",
  createdAt: "",
  updatedAt: "",
};

export const ManageCategoryContext =
  createContext<ManageCategoryContextType | null>(null);

export const ManageCategoryContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [data, setData] = useState<CategoryType>(defaultState);

  const handleSetEditMode = (value: boolean) => {
    setIsEditing(value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setData(defaultState);
  };

  const handleSetData = (data: CategoryType) => {
    setData(data);
  };

  return (
    <ManageCategoryContext.Provider
      value={{
        isOpen: open,
        onOpen: handleOpen,
        onClose: handleClose,
        data,
        setData: handleSetData,
        editMode: isEditing,
        setEditMode: handleSetEditMode,
      }}
    >
      {children}
    </ManageCategoryContext.Provider>
  );
};
