import { createContext, useState } from "react";
import { Category } from "../redux/slices/categorySlice";
import { Color } from "../redux/slices/colorSlice";
import { Size } from "../redux/slices/sizeSlice";

export type ProductType = {
	title: string;
	description: string;
	price: number | string;
	discount: number | string;
	stock: number | string;
	images: string[];
	category: Category;
	color: Color;
	size: Size;
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

const defaultState: ProductType = {
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
