import { createContext, useState } from "react";
import { SizeType } from "../types";

export type ManageSizeContextType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setData: (size: SizeType) => void;
  data: SizeType;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
};

const defaultState: SizeType = {
  _id: "",
  name: "",
  value: "",
  createdAt: "",
  updatedAt: "",
};

export const ManageSizeContext = createContext<ManageSizeContextType | null>(
  null
);

export const ManageSizeContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<SizeType>(defaultState);
  const [isEditing, setIsEditing] = useState<boolean>(false);

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

  const handleSetData = (size: SizeType) => {
    setData(size);
  };

  return (
    <ManageSizeContext.Provider
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
    </ManageSizeContext.Provider>
  );
};
