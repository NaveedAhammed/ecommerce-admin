import { createContext, useState } from "react";

export type CatagoryType = {
  name: string;
};

export type ManageCategoryContextType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data: CatagoryType;
  setData: (data: CatagoryType) => void;
};

export const ManageCategoryContext =
  createContext<ManageCategoryContextType | null>(null);

export const ManageCategoryContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<CatagoryType>({
    name: "",
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setData({ name: "" });
  };

  const handleSetData = (data: CatagoryType) => {
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
      }}
    >
      {children}
    </ManageCategoryContext.Provider>
  );
};
