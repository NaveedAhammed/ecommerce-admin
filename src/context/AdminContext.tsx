import { createContext, useState } from "react";
import { AdminType } from "../types";

export type AdminContextType = {
	adminState: AdminType | null;
	setAdmin: (admin: AdminType) => void;
};

export const AdminContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [adminState, setAdminState] = useState<AdminType | null>(null);

	const setAdmin = (admin: AdminType) => {
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
