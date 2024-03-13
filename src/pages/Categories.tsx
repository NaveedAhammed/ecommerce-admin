import Heading from "../components/Heading";
import Input from "../components/Input";
import Table, {
	TBody,
	THead,
	THeadData,
	TRow,
	TRowData,
} from "../components/Table";
import TableAction from "../components/TableAction";
import { ManageCategoryContextType } from "../context/ManageCategoryContext";
import { useManageCategoryContext } from "../hooks/useManageCategoryContext";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { CategoryType } from "../types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { removeCategory } from "../redux/slices/categorySlice";
import { AxiosError } from "axios";

const Categories = () => {
	const { onOpen, setData } =
		useManageCategoryContext() as ManageCategoryContextType;

	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	const { categories } = useAppSelector((state) => state.categories);

	const handleActionEdit = (data: CategoryType) => {
		setData(data);
		onOpen();
	};

	const handleActionDelete = (category: CategoryType) => {
		const res = axiosPrivate.delete(`/category/delete/${category._id}`);
		toast.promise(res, {
			loading: `Deleting the category ${category.name}`,
			success: () => {
				dispatch(removeCategory(category._id));
				return "Deleted successfully";
			},
			error: (err) => {
				const error = err as AxiosError;
				console.log(error);
				if (!error?.response) {
					return "Something went wrong";
				} else {
					return `${error.response?.data?.message}`;
				}
			},
		});
	};

	return (
		<div className="w-full h-full">
			<Heading
				title="Categories"
				description="Manage categories for your products"
				action={onOpen}
				actionLabel="Add New"
			/>
			<Input
				autoComplete="off"
				name="searchQuery"
				type="text"
				placeholder="Search"
				className="mb-4 w-[30rem]"
				id="searchQuery"
			/>
			<Table>
				<THead>
					<TRow>
						<THeadData>Name</THeadData>
						<THeadData>Value</THeadData>
						<THeadData>Action</THeadData>
					</TRow>
				</THead>
				<TBody>
					{categories?.map((category) => (
						<TRow key={category._id}>
							<TRowData>{category.name}</TRowData>
							<TRowData>
								{dayjs(
									category?.createdAt?.split("T")[0]
								).format("MMM D, YYYY")}
							</TRowData>
							<TableAction
								onDelete={() => handleActionDelete(category)}
								onEdit={() => handleActionEdit(category)}
							/>
						</TRow>
					))}
				</TBody>
			</Table>
		</div>
	);
};

export default Categories;
