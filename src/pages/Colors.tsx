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
import { ColorType } from "../types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import {
	removeColor,
	setColorData,
	setColorEditMode,
	setColorsPageNum,
	setIsColorModalOpen,
} from "../redux/slices/colorSlice";
import { AxiosError } from "axios";
import { useState } from "react";
import Button from "../components/Button";
import ControlledInput from "../components/ControlledInput";

const Colors = () => {
	const { colors, pageNum, colorsPerPage } = useAppSelector(
		(state) => state.colors
	);

	const [filterQuery, setFilterQuery] = useState<string>("");

	const filteredColors = colors
		.slice(
			(pageNum - 1) * colorsPerPage,
			(pageNum - 1) * colorsPerPage + colorsPerPage
		)
		.filter((color) => color.name.includes(filterQuery));

	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	const handleActionEdit = (data: ColorType) => {
		dispatch(setColorData(data));
		dispatch(setColorEditMode(true));
		dispatch(setIsColorModalOpen(true));
	};

	const handleActionDelete = (color: ColorType) => {
		const res = axiosPrivate.delete(`/color/delete/${color._id}`);
		toast.promise(res, {
			loading: `Deleting the color ${color.name}`,
			success: () => {
				dispatch(removeColor(color._id));
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
			dispatch(setColorsPageNum(pageNum - 1));
		} else {
			dispatch(setColorsPageNum(pageNum + 1));
		}
	};

	return (
		<div className="h-full">
			<Heading
				title="Colors"
				description="Manage colors for your products"
				action={() => dispatch(setIsColorModalOpen(true))}
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
					{filteredColors?.map((color) => (
						<TRow key={color._id}>
							<TRowData>{color.name}</TRowData>
							<TRowData>
								<div className="flex items-center gap-2">
									<span>{color.value}</span>
									<div
										className={`w-6 h-6 rounded-full border`}
										style={{
											backgroundColor: `${color.value}`,
										}}
									></div>
								</div>
							</TRowData>
							<TRowData>
								{dayjs(color?.createdAt?.split("T")[0]).format(
									"MMM D, YYYY"
								)}
							</TRowData>
							<TableAction
								onDelete={() => handleActionDelete(color)}
								onEdit={() => handleActionEdit(color)}
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
						pageNum >= Math.ceil(colors.length / colorsPerPage)
					}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default Colors;
