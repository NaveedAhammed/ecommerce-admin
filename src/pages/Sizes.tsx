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
import {
	removeSize,
	setIsSizeModalOpen,
	setSizeData,
	setSizeEditMode,
	setSizesPageNum,
} from "../redux/slices/sizeSlice";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { SizeType } from "../types";
import { useState } from "react";
import ControlledInput from "../components/ControlledInput";
import Button from "../components/Button";

const Sizes = () => {
	const { sizes, pageNum, sizesPerPage } = useAppSelector(
		(state) => state.sizes
	);

	const [filterQuery, setFilterQuery] = useState<string>("");

	const filteredSizes = sizes
		.slice(
			(pageNum - 1) * sizesPerPage,
			(pageNum - 1) * sizesPerPage + sizesPerPage
		)
		.filter((size) => size.name.includes(filterQuery));

	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	const handleActionEdit = (data: SizeType) => {
		dispatch(setSizeData(data));
		dispatch(setSizeEditMode(true));
		dispatch(setIsSizeModalOpen(true));
	};

	const handleActionDelete = (size: SizeType) => {
		const res = axiosPrivate.delete(`/size/delete/${size._id}`);
		toast.promise(res, {
			loading: `Deleting the size ${size.name}`,
			success: () => {
				dispatch(removeSize(size._id));
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
			dispatch(setSizesPageNum(pageNum - 1));
		} else {
			dispatch(setSizesPageNum(pageNum + 1));
		}
	};

	return (
		<div className="w-full h-full">
			<Heading
				title="Sizes"
				description="Manage sizes for your products"
				action={() => dispatch(setIsSizeModalOpen(true))}
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
						<THeadData>Date</THeadData>
						<THeadData>Action</THeadData>
					</TRow>
				</THead>
				<TBody>
					{filteredSizes?.map((size) => (
						<TRow key={size._id}>
							<TRowData>{size.name}</TRowData>
							<TRowData>{size.value}</TRowData>
							<TRowData>
								{dayjs(size?.createdAt?.split("T")[0]).format(
									"MMM D, YYYY"
								)}
							</TRowData>
							<TableAction
								onDelete={() => handleActionDelete(size)}
								onEdit={() => handleActionEdit(size)}
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
					disabled={pageNum >= Math.ceil(sizes.length / sizesPerPage)}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default Sizes;
