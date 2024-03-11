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
import {
	CatagoryType,
	ManageCategoryContextType,
} from "../context/ManageCategoryContext";
import { useManageCategoryContext } from "../hooks/useManageCategoryContext";
import dayjs from "dayjs";
import { useAppSelector } from "../redux/store";

const Categories = () => {
	const { onOpen, setData } =
		useManageCategoryContext() as ManageCategoryContextType;
	const handleActionEdit = (data: CatagoryType) => {
		setData(data);
		onOpen();
	};
	const { categories } = useAppSelector((state) => state.categories);
	const handleActionDelete = () => {};
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
								onDelete={handleActionDelete}
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
