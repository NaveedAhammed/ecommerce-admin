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
import { ChildCategoryType } from "../types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import {
	removeChildCategory,
	setChildCategoriesPageNum,
	setChildCategoryData,
	setChildCategoryEditMode,
	setIsChildCategoryModalOpen,
} from "../redux/slices/childCategorySlice";
import axios from "axios";
import Button from "../components/Button";
import { useState } from "react";
import ControlledInput from "../components/ControlledInput";

const Categories = () => {
	const { childCategories, childCategoriesPerPage, pageNum } = useAppSelector(
		(state) => state.childCategories
	);

	const [filterQuery, setFilterQuery] = useState<string>("");

	const filteredChildCategories = childCategories
		.slice(
			(pageNum - 1) * childCategoriesPerPage,
			(pageNum - 1) * childCategoriesPerPage + childCategoriesPerPage
		)
		.filter((cat) => cat.name.includes(filterQuery));

	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	const handleActionEdit = (data: ChildCategoryType) => {
		dispatch(setChildCategoryData(data));
		dispatch(setChildCategoryEditMode(true));
		dispatch(setIsChildCategoryModalOpen(true));
	};

	const handleActionDelete = (childCategory: ChildCategoryType) => {
		const res = axiosPrivate.delete(
			`/category/child/delete/${childCategory._id}`
		);
		toast.promise(res, {
			loading: `Deleting the category ${childCategory?.name}`,
			success: () => {
				dispatch(removeChildCategory(childCategory._id));
				return "Deleted successfully";
			},
			error: (err) => {
				if (axios.isAxiosError<{ message: string }>(err)) {
					if (!err?.response) {
						return "Something went wrong";
					} else {
						return `${err.response?.data?.message}`;
					}
				}
				return "Unexpected error!";
			},
		});
	};

	const handlePagination = (dir: string) => {
		filterQuery && setFilterQuery("");
		if (dir === "previous") {
			if (pageNum === 1) return;
			dispatch(setChildCategoriesPageNum(pageNum - 1));
		} else {
			dispatch(setChildCategoriesPageNum(pageNum + 1));
		}
	};

	return (
		<div className="w-full h-full">
			<Heading
				title="Child Categories"
				description="Manage child categories for your products"
				action={() => dispatch(setIsChildCategoryModalOpen(true))}
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
						<THeadData>Parent Category</THeadData>
						<THeadData>Created At</THeadData>
						<THeadData>Action</THeadData>
					</TRow>
				</THead>
				<TBody>
					{filteredChildCategories?.map((childCategory) => (
						<TRow key={childCategory._id}>
							<TRowData>{childCategory.name}</TRowData>
							<TRowData>
								{childCategory.parentCategory.name}
							</TRowData>
							<TRowData>
								{dayjs(
									childCategory?.createdAt?.split("T")[0]
								).format("MMM D, YYYY")}
							</TRowData>
							<TableAction
								onDelete={() =>
									handleActionDelete(childCategory)
								}
								onEdit={() => handleActionEdit(childCategory)}
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
						Math.ceil(
							childCategories.length / childCategoriesPerPage
						)
					}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default Categories;
