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
import { BillboardType } from "../types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import axios from "axios";
import {
	setBillboardData,
	setBillboardEditMode,
	setIsBillboardModalOpen,
	setBillboardsPageNum,
	removeBillboard,
} from "../redux/slices/billboardSlice";
import Button from "../components/Button";
import { useState } from "react";
import ControlledInput from "../components/ControlledInput";
import Loader from "../components/Loader";
import { GoDotFill } from "react-icons/go";

const Billboards = () => {
	const { billboards, pageNum, billboardsPerPage } = useAppSelector(
		(state) => state.billboards
	);

	const [filterQuery, setFilterQuery] = useState<string>("");

	const filteredBillboards = billboards
		.slice(
			(pageNum - 1) * billboardsPerPage,
			(pageNum - 1) * billboardsPerPage + billboardsPerPage
		)
		.filter((bill) =>
			bill.title.toLowerCase().includes(filterQuery.toLowerCase())
		);

	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	const handleActionEdit = (data: BillboardType) => {
		dispatch(setBillboardData(data));
		dispatch(setBillboardEditMode(true));
		dispatch(setIsBillboardModalOpen(true));
	};

	const handleActionDelete = (billboard: BillboardType) => {
		const res = axiosPrivate.delete(`/billboard/delete/${billboard._id}`);
		toast.promise(res, {
			loading: `Deleting the billboard ${billboard.title}`,
			success: () => {
				dispatch(removeBillboard(billboard._id));
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
			dispatch(setBillboardsPageNum(pageNum - 1));
		} else {
			dispatch(setBillboardsPageNum(pageNum + 1));
		}
	};

	return (
		<div className="w-full h-full">
			<Heading
				title="Billboards"
				description="Manage billboards for your store"
				action={() => dispatch(setIsBillboardModalOpen(true))}
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
						<THeadData>Image</THeadData>
						<THeadData>Title</THeadData>
						<THeadData>Brand</THeadData>
						<THeadData>Category</THeadData>
						<THeadData>Parent Category</THeadData>
						<THeadData>State</THeadData>
						<THeadData>Created At</THeadData>
						<THeadData>Action</THeadData>
					</TRow>
				</THead>
				<TBody>
					{!filteredBillboards && (
						<TRow>
							<TRowData>
								<Loader
									color="black"
									height="2rem"
									width="2rem"
								/>
							</TRowData>
						</TRow>
					)}
					{filteredBillboards?.map((billboard) => (
						<TRow key={billboard._id}>
							<TRowData>
								<img
									src={billboard.imageUrl}
									alt=""
									className="h-10 rounded-md"
								/>
							</TRowData>
							<TRowData>{billboard.title}</TRowData>
							<TRowData>{billboard.brand}</TRowData>
							<TRowData>{billboard.category.name}</TRowData>
							<TRowData>{billboard.parentCategory.name}</TRowData>
							<TRowData>
								<div className="flex items-center">
									<GoDotFill
										style={{
											color: billboard.isActive
												? "green"
												: "red",
										}}
									/>
									{billboard.isActive ? "active" : "inactive"}
								</div>
							</TRowData>
							<TRowData>
								{dayjs(
									billboard?.createdAt?.split("T")[0]
								).format("MMM D, YYYY")}
							</TRowData>
							<TableAction
								onDelete={() => handleActionDelete(billboard)}
								onEdit={() => handleActionEdit(billboard)}
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
						Math.ceil(billboards.length / billboardsPerPage)
					}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default Billboards;
