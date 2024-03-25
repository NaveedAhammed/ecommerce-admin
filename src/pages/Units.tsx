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
	removeUnit,
	setIsUnitModalOpen,
	setUnitData,
	setUnitEditMode,
	setUnitsPageNum,
} from "../redux/slices/unitSlice";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { UnitType } from "../types";
import { useState } from "react";
import ControlledInput from "../components/ControlledInput";
import Button from "../components/Button";

const Units = () => {
	const { units, pageNum, unitsPerPage } = useAppSelector(
		(state) => state.units
	);

	const [filterQuery, setFilterQuery] = useState<string>("");

	const filteredUnits = units
		?.slice(
			(pageNum - 1) * unitsPerPage,
			(pageNum - 1) * unitsPerPage + unitsPerPage
		)
		.filter((unit) => unit.name.includes(filterQuery));

	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	const handleActionEdit = (data: UnitType) => {
		dispatch(setUnitData(data));
		dispatch(setUnitEditMode(true));
		dispatch(setIsUnitModalOpen(true));
	};

	const handleActionDelete = (unit: UnitType) => {
		const res = axiosPrivate.delete(`/unit/delete/${unit._id}`);
		toast.promise(res, {
			loading: `Deleting the unit ${unit.name}`,
			success: () => {
				dispatch(removeUnit(unit._id));
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
			dispatch(setUnitsPageNum(pageNum - 1));
		} else {
			dispatch(setUnitsPageNum(pageNum + 1));
		}
	};

	return (
		<div className="w-full h-full">
			<Heading
				title="Units"
				description="Manage units for your products"
				action={() => dispatch(setIsUnitModalOpen(true))}
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
						<THeadData>Short Hand</THeadData>
						<THeadData>Created At</THeadData>
						<THeadData>Action</THeadData>
					</TRow>
				</THead>
				<TBody>
					{filteredUnits?.map((unit) => (
						<TRow key={unit._id}>
							<TRowData>{unit.name}</TRowData>
							<TRowData>{unit.value}</TRowData>
							<TRowData>{unit?.shortHand || "--"}</TRowData>
							<TRowData>
								{dayjs(unit.createdAt?.split("T")[0]).format(
									"MMM D, YYYY"
								)}
							</TRowData>
							<TableAction
								onDelete={() => handleActionDelete(unit)}
								onEdit={() => handleActionEdit(unit)}
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
						pageNum >= Math.ceil(units?.length / unitsPerPage)
					}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default Units;
