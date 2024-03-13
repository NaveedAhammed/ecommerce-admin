import { createContext, useState } from "react";
import { ProductType } from "../types";

export type ManageProductContextType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data: ProductType;
  setData: (product: ProductType) => void;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  removeImage: (id: string) => void;
};

const defaultState: ProductType = {
  _id: "",
  title: "",
  description: "",
  price: "",
  category: { name: "", _id: "", createdAt: "", updatedAt: "" },
  color: { _id: "", name: "", createdAt: "", updatedAt: "", value: "" },
  discount: "",
  images: [],
  size: { _id: "", name: "", createdAt: "", updatedAt: "", value: "" },
  stock: "",
  featured: false,
};

export const ManageProductContext =
  createContext<ManageProductContextType | null>(null);

export const ManageProductContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [data, setData] = useState<ProductType>(defaultState);

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

  const handleSetData = (product: ProductType) => {
    setData(product);
  };

  const handleRemoveImage = (id: string) => {
    data.images = data.images.filter((img) => img._id !== id);
  };

  return (
    <ManageProductContext.Provider
      value={{
        isOpen: open,
        onOpen: handleOpen,
        onClose: handleClose,
        data,
        setData: handleSetData,
        editMode: isEditing,
        setEditMode: handleSetEditMode,
        removeImage: handleRemoveImage,
      }}
    >
      {children}
    </ManageProductContext.Provider>
  );
};
