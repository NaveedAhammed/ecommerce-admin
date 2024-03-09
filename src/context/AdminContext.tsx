import { createContext, useState } from "react";

export interface IAdmin {
  username: string;
  avatar?: string | undefined;
  accessToken: string;
  id: string;
}

export type AdminContextType = {
  adminState: IAdmin | null;
  setAdmin: (admin: IAdmin) => void;
};

export const AdminContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [adminState, setAdminState] = useState<IAdmin | null>(null);

  const setAdmin = (admin: IAdmin) => {
    setAdminState(admin);
  };

  return (
    <AdminContext.Provider
      value={{
        adminState,
        setAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const AdminContext = createContext<AdminContextType | null>(null);
