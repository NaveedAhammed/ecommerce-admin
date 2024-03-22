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
import {
	addNewSize,
	addSize,
	setIsSizeModalOpen,
	setSizeData,
	setSizeEditMode,
	updateSize,
} from "../redux/slices/sizeSlice";

const ManageSizeModal = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasNameFocused, setHasNameFocused] = useState<boolean>(false);
	const [hasNameBlured, setHasNameBlured] = useState<boolean>(false);
	const [hasValueFocused, setHasValueFocused] = useState<boolean>(false);
	const [hasValueBlured, setHasValueBlured] = useState<boolean>(false);

	const { isSizeModalOpen, editMode, sizeData } = useAppSelector(
		(state) => state.sizes
	);

	const dispatch = useAppDispatch();

	const axiosPrivate = useAxiosPrivate();

	const firstInputRef = useRef<HTMLInputElement>(null);

	const resetState = () => {
		setHasNameBlured(false);
		setHasNameFocused(false);
		setHasValueBlured(false);
		setHasValueFocused(false);
	};

	const handleCancel = () => {
		dispatch(setIsSizeModalOpen(false));
		dispatch(setSizeData(null));
		dispatch(setSizeEditMode(false));
		resetState();
	};

	const handleCreateSize = async (formData: FormData) => {
		const res = (await axiosPrivate.post("/size/new", formData)).data;
		dispatch(addNewSize(res.data.size));
		return res;
	};

	const handleUpdateSize = async (formData: FormData) => {
		const res = (
			await axiosPrivate.put(`/size/update/${sizeData?._id}`, formData)
		).data;
		dispatch(updateSize(res.data.color));
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
					res = await handleUpdateSize(formData);
				} else {
					res = await handleCreateSize(formData);
				}
				console.log(res);
				if (!res.success) {
					return toast.error(
						"Size creation failed, Please try again"
					);
				}
				if (res.success) {
					dispatch(setIsSizeModalOpen(false));
					resetState();
					dispatch(addSize(res.data.size));
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
			className="grid grid-cols-2 gap-6"
			onSubmit={handleOnSubmit}
			noValidate
		>
			<div className="flex flex-col gap-2">
				<Label htmlFor="name">Name</Label>
				<Input
					id="name"
					defaultValue={sizeData?.name}
					autoComplete="off"
					name="name"
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
						Size name is required
					</Message>
				)}
			</div>
			<div className="flex flex-col gap-2">
				<Label htmlFor="value">Value</Label>
				<Input
					id="value"
					defaultValue={sizeData?.value}
					autoComplete="off"
					name="value"
					type="text"
					disabled={isLoading}
					required={true}
					onBlur={() => setHasValueBlured(true)}
					onFocus={() => setHasValueFocused(true)}
					className="peer"
				/>
				{hasValueFocused && hasValueBlured && (
					<Message error={true} className="hidden peer-invalid:block">
						Size value is required
					</Message>
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
	}, [isSizeModalOpen]);

	return (
		<Modal
			isOpen={isSizeModalOpen}
			onClose={() => dispatch(setIsSizeModalOpen(false))}
			body={body}
			title="Create Size"
			description="Create a new size for your products"
		/>
	);
};

export default ManageSizeModal;
