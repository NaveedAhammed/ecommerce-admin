import { createContext, useState } from "react";

export type SizeType = {
  name: string;
  value: string;
};

export type ManageSizeContextType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setData: (size: SizeType) => void;
  data: SizeType;
};

export const ManageSizeContext = createContext<ManageSizeContextType | null>(
  null
);

export const ManageSizeContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<SizeType>({ name: "", value: "" });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setData({ name: "", value: "" });
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
      }}
    >
      {children}
    </ManageSizeContext.Provider>
  );
};
