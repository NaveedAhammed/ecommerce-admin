import Heading from "../components/Heading";
import Input from "../components/Input";
import Table, {
	TBody,
	THead,
	THeadData,
	TRow,
	TRowData,
} from "../components/Table";
import {
	ColorType,
	ManageColorContextType,
} from "../context/ManageColorContext";
import { useManageColorContext } from "../hooks/useManageColorContext";
import TableAction from "../components/TableAction";
import dayjs from "dayjs";
import { useAppSelector } from "../redux/store";

const Colors = () => {
	const { onOpen, setData } =
		useManageColorContext() as ManageColorContextType;

	const { colors } = useAppSelector((state) => state.colors);
	console.log(colors);

	const handleActionEdit = (data: ColorType) => {
		setData(data);
		onOpen();
	};

	const handleActionDelete = () => {};

	return (
		<div className="h-full">
			<Heading
				title="Colors"
				description="Manage colors for your products"
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
					{colors?.map((color) => (
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
								onDelete={handleActionDelete}
								onEdit={() => handleActionEdit(color)}
							/>
						</TRow>
					))}
				</TBody>
			</Table>
		</div>
	);
};

export default Colors;
