import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Label from "../components/Label";
import Modal from "../components/Modal";
import Message from "../components/Message";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useAppDispatch, useAppSelector } from "../redux/store";
import Select from "../components/Select";
import { MdDeleteOutline } from "react-icons/md";
import {
	addNewBillboard,
	removeBillboardImg,
	setBillboardData,
	setBillboardEditMode,
	setIsBillboardModalOpen,
	updateBillboard,
} from "../redux/slices/billboardSlice";

const ManageBillboardModal = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasNameFocused, setHasNameFocused] = useState<boolean>(false);
	const [hasNameBlured, setHasNameBlured] = useState<boolean>(false);
	const [hasCategoryFocused, setHasCategoryFocused] =
		useState<boolean>(false);
	const [hasCategoryBlured, setHasCategoryBlured] = useState<boolean>(false);

	const { categories } = useAppSelector((state) => state.categories);
	const { billboardData, editMode, isBillboardModalOpen } = useAppSelector(
		(state) => state.billboards
	);

	const dispatch = useAppDispatch();

	const axiosPrivate = useAxiosPrivate();

	const firstInputRef = useRef<HTMLInputElement>(null);

	const resetState = () => {
		setHasNameBlured(false);
		setHasNameFocused(false);
		setHasCategoryBlured(false);
		setHasCategoryFocused(false);
	};

	const handleCancel = () => {
		dispatch(setIsBillboardModalOpen(false));
		dispatch(setBillboardData(null));
		dispatch(setBillboardEditMode(false));
		resetState();
	};

	const handleCreateBillboard = async (formData: FormData) => {
		const res = (
			await axiosPrivate.post("/billboard/new", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
		).data;
		dispatch(addNewBillboard(res.data.billboard));
		return res;
	};

	const handleUpdateBillboard = async (formData: FormData) => {
		console.log(formData.get("image"));
		const res = (
			await axiosPrivate.put(
				`/billboard/update/${billboardData?._id}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			)
		).data;
		dispatch(updateBillboard(res.data.billboard));
		return res;
	};

	const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formElement = e.target as HTMLFormElement;
		const isValid = formElement.checkValidity();
		const firstInvalidField = formElement.querySelector(
			":invalid"
		) as HTMLInputElement;
		firstInvalidField?.focus();
		if (isValid) {
			const formData = new FormData(formElement);
			try {
				setIsLoading(true);
				let res;
				if (editMode) {
					res = await handleUpdateBillboard(formData);
				} else {
					res = await handleCreateBillboard(formData);
				}
				console.log(res);
				if (!res.success) {
					return toast.error(
						"Billboard creation failed, Please try again"
					);
				}
				if (res.success) {
					dispatch(setIsBillboardModalOpen(false));
					resetState();
					dispatch(addNewBillboard(res.data.billboard));
					return toast.success(res.message);
				}
			} catch (err: unknown) {
				console.log(err);
				const error = err as AxiosError;
				console.log(error);
				if (!error?.response) {
					return toast.error("Something went wrong");
				} else {
					return toast.error(`${error.response?.data?.message}`);
				}
			} finally {
				setIsLoading(false);
			}
		}
	};

	const body: React.ReactNode = (
		<form
			className="flex flex-col gap-4 w-[30rem]"
			onSubmit={handleOnSubmit}
			noValidate
		>
			<div className="flex flex-col gap-2">
				<Label htmlFor="title">Title</Label>
				<Input
					id="title"
					defaultValue={billboardData?.title}
					autoComplete="off"
					name="title"
					type="text"
					required={true}
					onBlur={() => setHasNameBlured(true)}
					onFocus={() => setHasNameFocused(true)}
					innerRef={firstInputRef}
					disabled={isLoading}
					className="peer"
				/>
				{hasNameFocused && hasNameBlured && (
					<Message error={true} className="hidden peer-invalid:block">
						Billboard title is required
					</Message>
				)}
			</div>
			<div className="flex items-center gap-4 w-full">
				<div className="flex flex-col gap-2 w-[50%]">
					<Label htmlFor="categoryId">Category</Label>
					<Select
						name="categoryId"
						id="categoryId"
						options={categories?.map((category) => ({
							id: category?._id,
							name: category?.name,
						}))}
						defaultValue={billboardData?.category?._id}
						required={true}
						className="peer"
						onBlur={() => setHasCategoryBlured(true)}
						onFocus={() => setHasCategoryFocused(true)}
					/>
					{hasCategoryFocused && hasCategoryBlured && (
						<Message
							error={true}
							className="hidden peer-invalid:block"
						>
							Product category is required
						</Message>
					)}
				</div>
				{!billboardData?.imageUrl && (
					<div className="w-[50%] flex flex-col gap-2">
						<Label htmlFor="image">Image</Label>
						<input type="file" id="image" name="image" />
					</div>
				)}
				{billboardData?.imageUrl && (
					<div className="w-[50%] flex flex-col gap-2">
						<Label htmlFor="image">Old Image</Label>
						<div className="flex items-center gap-2">
							<img
								src={billboardData.imageUrl}
								alt=""
								className="h-10 w-auto rounded-md"
							/>
							<input
								type="hidden"
								name="imageUrl"
								value={billboardData.imageUrl}
							/>
							<Button
								size="icon"
								varient="destructive"
								onClick={() => dispatch(removeBillboardImg())}
							>
								<MdDeleteOutline size={20} />
							</Button>
						</div>
					</div>
				)}
			</div>
			<div className="flex gap-2 items-center justify-end col-span-2">
				<Button onClick={handleCancel} size="default" varient="outline">
					Cancel
				</Button>
				{!editMode && (
					<Button
						size="default"
						varient="default"
						type="submit"
						className="gap-2"
					>
						{isLoading && (
							<Loader width="1rem" height="1rem" color="white" />
						)}
						{isLoading ? "Creating..." : "Create"}
					</Button>
				)}
				{editMode && (
					<Button
						size="default"
						varient="default"
						type="submit"
						className="gap-2"
					>
						{isLoading && (
							<Loader width="1rem" height="1rem" color="white" />
						)}
						{isLoading ? "Updating..." : "Update"}
					</Button>
				)}
			</div>
		</form>
	);

	useEffect(() => {
		firstInputRef.current && firstInputRef.current.focus();
	}, [isBillboardModalOpen]);

	return (
		<Modal
			isOpen={isBillboardModalOpen}
			onClose={() => dispatch(setIsBillboardModalOpen(false))}
			body={body}
			title={editMode ? "Edit Billboard" : "Create Billboard"}
			description={
				editMode
					? "Edit billboard for your store"
					: "Create a new billboard for your store"
			}
		/>
	);
};

export default ManageBillboardModal;
