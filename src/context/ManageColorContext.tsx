import { createContext, useState } from "react";

export type ColorType = {
  name: string;
  value: string;
};

export type ManageColorContextType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data: ColorType;
  setData: (data: ColorType) => void;
};

export const ManageColorContext = createContext<ManageColorContextType | null>(
  null
);

export const ManageColorContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<ColorType>({
    name: "",
    value: "",
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setData({ name: "", value: "" });
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
      }}
    >
      {children}
    </ManageColorContext.Provider>
  );
};
