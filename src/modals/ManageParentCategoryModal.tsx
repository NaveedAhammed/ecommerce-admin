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
	addNewParentCategory,
	setParentCategoryData,
	setParentCategoryEditMode,
	setIsParentCategoryModalOpen,
	updateParentCategory,
} from "../redux/slices/parentCategorySlice";

const ManageParentCategoryModal = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasNameFocused, setHasNameFocused] = useState<boolean>(false);
	const [hasNameBlured, setHasNameBlured] = useState<boolean>(false);

	const { isParentCategoryModalOpen, parentCategoryData, editMode } =
		useAppSelector((state) => state.parentCategories);

	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	const firstInputRef = useRef<HTMLInputElement>(null);

	const resetState = () => {
		setHasNameBlured(false);
		setHasNameFocused(false);
	};

	const handleCancel = () => {
		dispatch(setIsParentCategoryModalOpen(false));
		dispatch(setParentCategoryData(null));
		dispatch(setParentCategoryEditMode(false));
		resetState();
	};

	const handleCreateCategory = async (formData: FormData) => {
		try {
			setIsLoading(true);
			const res = (
				await axiosPrivate.post("/category/parent/new", formData)
			).data;
			console.log(res);
			if (!res.success) {
				return toast.error(
					"Parent category creation failed, Please try again"
				);
			}
			if (res.success) {
				dispatch(setIsParentCategoryModalOpen(false));
				dispatch(addNewParentCategory(res.data.parentCategory));
				resetState();
				return toast.success(res.message);
			}
			dispatch(addNewParentCategory(res.data.parentCategory));
		} catch (err) {
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
	};

	const handleUpdateCategory = async (formData: FormData) => {
		try {
			setIsLoading(true);
			const res = (
				await axiosPrivate.put(
					`/category/parent/update/${parentCategoryData?._id}`,
					formData
				)
			).data;
			console.log(res);
			if (!res.success) {
				return toast.error(
					"Parent category updation failed, Please try again"
				);
			}
			if (res.success) {
				dispatch(setIsParentCategoryModalOpen(false));
				dispatch(setParentCategoryEditMode(false));
				dispatch(setParentCategoryData(null));
				dispatch(updateParentCategory(res.data.category));
				resetState();
				return toast.success(res.message);
			}
		} catch (err) {
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
			if (editMode) {
				await handleUpdateCategory(formData);
			} else {
				await handleCreateCategory(formData);
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
				<Label htmlFor="name">Parent Category</Label>
				<Input
					id="name"
					defaultValue={parentCategoryData?.name}
					autoComplete="off"
					name="name"
					type="text"
					innerRef={firstInputRef}
					required={true}
					className="peer min-w-[24rem]"
					onBlur={() => setHasNameBlured(true)}
					onFocus={() => setHasNameFocused(true)}
				/>
				{hasNameFocused && hasNameBlured && (
					<Message error={true} className="hidden peer-invalid:block">
						Parent Category is required
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
	}, [isParentCategoryModalOpen]);

	return (
		<Modal
			isOpen={isParentCategoryModalOpen}
			onClose={() => dispatch(setIsParentCategoryModalOpen(false))}
			body={body}
			title={`${editMode ? "Edit" : "Create"} Category`}
			description={`${
				editMode ? "Edit the" : "Create a new"
			} parent category for you products`}
		/>
	);
};

export default ManageParentCategoryModal;
