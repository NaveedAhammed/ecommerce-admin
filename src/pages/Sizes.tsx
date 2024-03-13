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
import { ManageSizeContextType } from "../context/ManageSizeContext";
import { useManageSizeContext } from "../hooks/useManageSizeContext";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { removeSize } from "../redux/slices/sizeSlice";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { SizeType } from "../types";

const Sizes = () => {
	const { onOpen, setData } = useManageSizeContext() as ManageSizeContextType;

	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	const handleActionEdit = (data: SizeType) => {
		setData(data);
		onOpen();
	};

	const { sizes } = useAppSelector((state) => state.sizes);

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

	return (
		<div className="w-full h-full">
			<Heading
				title="Sizes"
				description="Manage sizes for your products"
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
						<THeadData>Date</THeadData>
						<THeadData>Action</THeadData>
					</TRow>
				</THead>
				<TBody>
					{sizes?.map((size) => (
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
		</div>
	);
};

export default Sizes;
