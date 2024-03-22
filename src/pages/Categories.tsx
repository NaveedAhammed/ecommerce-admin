import Heading from "../components/Heading";
import Table, {
	TBody,
	THead,
	THeadData,
	TRow,
	TRowData,
} from "../components/Table";
import TableAction from "../components/TableAction";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { CategoryType } from "../types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import {
	removeCategory,
	setCategoriesPageNum,
	setCategoryData,
	setCategoryEditMode,
	setCategoryModalOpen,
} from "../redux/slices/categorySlice";
import { AxiosError } from "axios";
import Button from "../components/Button";
import { useState } from "react";
import ControlledInput from "../components/ControlledInput";

const Categories = () => {
	const { categories, categoriesPerPage, pageNum } = useAppSelector(
		(state) => state.categories
	);

	const [filterQuery, setFilterQuery] = useState<string>("");

	const filteredCategories = categories
		.slice(
			(pageNum - 1) * categoriesPerPage,
			(pageNum - 1) * categoriesPerPage + categoriesPerPage
		)
		.filter((cat) => cat.name.includes(filterQuery));

	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	const handleActionEdit = (data: CategoryType) => {
		dispatch(setCategoryData(data));
		dispatch(setCategoryEditMode(true));
		dispatch(setCategoryModalOpen(true));
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

	const handlePagination = (dir: string) => {
		filterQuery && setFilterQuery("");
		if (dir === "previous") {
			if (pageNum === 1) return;
			dispatch(setCategoriesPageNum(pageNum - 1));
		} else {
			dispatch(setCategoriesPageNum(pageNum + 1));
		}
	};

	return (
		<div className="w-full h-full">
			<Heading
				title="Categories"
				description="Manage categories for your products"
				action={() => dispatch(setCategoryModalOpen(true))}
				actionLabel="Add New"
			/>
			<div className="flex items-center gap-4 w-full mb-4">
				<ControlledInput
					autoComplete="off"
					name="searchQuery"
					type="text"
					placeholder="Search"
					className="max-w-[30rem]"
					id="searchQuery"
					value={filterQuery}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setFilterQuery(e.target.value)
					}
				/>
				{filterQuery && (
					<Button
						varient="default"
						size="default"
						onClick={() => setFilterQuery("")}
					>
						Reset
					</Button>
				)}
			</div>
			<Table>
				<THead>
					<TRow>
						<THeadData>Name</THeadData>
						<THeadData>Value</THeadData>
						<THeadData>Action</THeadData>
					</TRow>
				</THead>
				<TBody>
					{filteredCategories?.map((category) => (
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
			<div className="w-full flex items-center p-4 justify-end gap-3">
				<Button
					varient="outline"
					size="sm"
					onClick={() => handlePagination("previous")}
					disabled={pageNum === 1}
				>
					Previous
				</Button>
				<span>{pageNum}</span>
				<Button
					varient="outline"
					size="sm"
					onClick={() => handlePagination("next")}
					disabled={
						pageNum >=
						Math.ceil(categories.length / categoriesPerPage)
					}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default Categories;
