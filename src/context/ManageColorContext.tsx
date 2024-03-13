import { createContext, useState } from "react";
import { ColorType } from "../types";

export type ManageColorContextType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data: ColorType;
  setData: (data: ColorType) => void;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
};

const defaultState: ColorType = {
  _id: "",
  name: "",
  value: "",
  createdAt: "",
  updatedAt: "",
};

export const ManageColorContext = createContext<ManageColorContextType | null>(
  null
);

export const ManageColorContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<ColorType>(defaultState);
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

  const handleSetData = (data: ColorType) => {
    setData(data);
  };

  return (
    <ManageColorContext.Provider
      value={{
        isOpen: open,
        onOpen: handleOpen,
        onClose: handleClose,
        setData: handleSetData,
        data,
        editMode: isEditing,
        setEditMode: handleSetEditMode,
      }}
    >
      {children}
    </ManageColorContext.Provider>
  );
};
