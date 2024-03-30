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
import { ParentCategoryType } from "../types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import axios from "axios";
import Button from "../components/Button";
import { useState } from "react";
import ControlledInput from "../components/ControlledInput";
import {
	removeParentCategory,
	setIsParentCategoryModalOpen,
	setParentCategoriesPageNum,
	setParentCategoryData,
	setParentCategoryEditMode,
} from "../redux/slices/parentCategorySlice";

const ParentCategories = () => {
	const { parentCategories, parentCategoriesPerPage, pageNum } =
		useAppSelector((state) => state.parentCategories);

	const [filterQuery, setFilterQuery] = useState<string>("");

	const filteredParentCategories = parentCategories
		.slice(
			(pageNum - 1) * parentCategoriesPerPage,
			(pageNum - 1) * parentCategoriesPerPage + parentCategoriesPerPage
		)
		.filter((cat) => cat.name.includes(filterQuery));

	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	const handleActionEdit = (data: ParentCategoryType) => {
		dispatch(setParentCategoryData(data));
		dispatch(setParentCategoryEditMode(true));
		dispatch(setIsParentCategoryModalOpen(true));
	};

	const handleActionDelete = (parentCategory: ParentCategoryType) => {
		const res = axiosPrivate.delete(
			`/category/parent/delete/${parentCategory._id}`
		);
		toast.promise(res, {
			loading: `Deleting the parent category ${parentCategory?.name}`,
			success: () => {
				dispatch(removeParentCategory(parentCategory._id));
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
			dispatch(setParentCategoriesPageNum(pageNum - 1));
		} else {
			dispatch(setParentCategoriesPageNum(pageNum + 1));
		}
	};

	return (
		<div className="w-full h-full">
			<Heading
				title="Parent Categories"
				description="Manage parent categories for your products"
				action={() => dispatch(setIsParentCategoryModalOpen(true))}
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
						<THeadData>Created At</THeadData>
						<THeadData>Action</THeadData>
					</TRow>
				</THead>
				<TBody>
					{filteredParentCategories?.map((parentCategory) => (
						<TRow key={parentCategory._id}>
							<TRowData>{parentCategory.name}</TRowData>
							<TRowData>
								{dayjs(
									parentCategory?.createdAt?.split("T")[0]
								).format("MMM D, YYYY")}
							</TRowData>
							<TableAction
								onDelete={() =>
									handleActionDelete(parentCategory)
								}
								onEdit={() => handleActionEdit(parentCategory)}
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
							parentCategories.length / parentCategoriesPerPage
						)
					}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default ParentCategories;
