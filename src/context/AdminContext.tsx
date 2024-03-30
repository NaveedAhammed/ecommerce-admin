import { createContext, useState } from "react";
import { AdminType } from "../types";

export type AdminContextType = {
	adminState: AdminType | null;
	setAdminState: React.Dispatch<React.SetStateAction<AdminType | null>>;
};

export const AdminContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [adminState, setAdminState] = useState<AdminType | null>(null);

	return (
		<AdminContext.Provider
			value={{
				adminState,
				setAdminState,
			}}
		>
			{children}
		</AdminContext.Provider>
	);
};

export const AdminContext = createContext<AdminContextType | null>(null);
