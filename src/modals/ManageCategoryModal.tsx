import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Label from "../components/Label";
import Modal from "../components/Modal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
	addNewCategory,
	setCategoryData,
	setCategoryEditMode,
	setCategoryModalOpen,
	updateCategory,
} from "../redux/slices/categorySlice";

const ManageCategoryModal = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasNameFocused, setHasNameFocused] = useState<boolean>(false);
	const [hasNameBlured, setHasNameBlured] = useState<boolean>(false);

	const { isCategoryModalOpen, categoryData, editMode } = useAppSelector(
		(state) => state.categories
	);

	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	const firstInputRef = useRef<HTMLInputElement>(null);

	const resetState = () => {
		setHasNameBlured(false);
		setHasNameFocused(false);
	};

	const handleCancel = () => {
		dispatch(setCategoryModalOpen(false));
		dispatch(setCategoryData(null));
		dispatch(setCategoryEditMode(false));
		resetState();
	};

	const handleCreateCategory = async (formData: FormData) => {
		const res = (await axiosPrivate.post("/category/new", formData)).data;
		dispatch(addNewCategory(res.data.category));
		return res;
	};

	const handleUpdateCategory = async (formData: FormData) => {
		const res = (
			await axiosPrivate.put(
				`/category/update/${categoryData?._id}`,
				formData
			)
		).data;
		dispatch(updateCategory(res.data.category));
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
					res = await handleUpdateCategory(formData);
				} else {
					res = await handleCreateCategory(formData);
				}
				console.log(res);
				if (!res.success) {
					return toast.error(
						"Category creation failed, Please try again"
					);
				}
				if (res.success) {
					dispatch(setCategoryModalOpen(false));
					resetState();
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
			noValidate
			onSubmit={handleOnSubmit}
		>
			<div className="flex flex-col col-span-2 gap-2">
				<Label htmlFor="name">Name</Label>
				<Input
					id="name"
					defaultValue={categoryData?.name}
					autoComplete="off"
					name="name"
					type="text"
					innerRef={firstInputRef}
					required={true}
					className="peer w-[24rem]"
					onBlur={() => setHasNameBlured(true)}
					onFocus={() => setHasNameFocused(true)}
				/>
				{hasNameFocused && hasNameBlured && (
					<Message error={true} className="hidden peer-invalid:block">
						Category name is required
					</Message>
				)}
			</div>
			<div className="flex gap-2 items-center justify-end col-span-2">
				<Button onClick={handleCancel} size="default" varient="outline">
					Cancel
				</Button>
				<Button
					type="submit"
					size="default"
					varient="default"
					className="gap-2"
				>
					{isLoading && (
						<Loader width="1rem" height="1rem" color="white" />
					)}
					Create
				</Button>
			</div>
		</form>
	);

	useEffect(() => {
		firstInputRef.current && firstInputRef.current.focus();
	}, [isCategoryModalOpen]);

	return (
		<Modal
			isOpen={isCategoryModalOpen}
			onClose={() => dispatch(setCategoryModalOpen(false))}
			body={body}
			title="Create Category"
			description="Create a new category for you products"
		/>
	);
};

export default ManageCategoryModal;
