import { createContext, useState } from "react";

export type ProductType = {
  title: string;
  description: string;
  price: number | string;
  discount: number | string;
  stock: number | string;
  images: string[];
  category: string;
  color: string;
  size: string;
  featured: boolean;
};

export type ManageProductContextType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data: ProductType;
  setData: (product: ProductType) => void;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
};

export const ManageProductContext =
  createContext<ManageProductContextType | null>(null);

export const ManageProductContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [data, setData] = useState<ProductType>({
    title: "",
    description: "",
    price: "",
    category: "",
    color: "",
    discount: "",
    images: [],
    size: "",
    stock: "",
    featured: false,
  });

  const handleSetEditMode = (value: boolean) => {
    setIsEditing(value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSetData = (product: ProductType) => {
    setData(product);
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
      }}
    >
      {children}
    </ManageProductContext.Provider>
  );
};
