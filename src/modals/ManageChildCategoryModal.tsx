import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Label from "../components/Label";
import Modal from "../components/Modal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
	addNewChildCategory,
	setChildCategoryData,
	setChildCategoryEditMode,
	setIsChildCategoryModalOpen,
	updateChildCategory,
} from "../redux/slices/childCategorySlice";
import Select from "../components/Select";
import { errorHandler } from "../utils/errorHandler";

type InputFieldsState = {
	parentCategory: boolean;
	name: boolean;
};

const defaultState: InputFieldsState = {
	name: false,
	parentCategory: false,
};

const ManageChildCategoryModal = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasInputFocused, setHasInputFocused] =
		useState<InputFieldsState>(defaultState);
	const [hasInputBlured, setHasInputBlured] =
		useState<InputFieldsState>(defaultState);

	const { isChildCategoryModalOpen, childCategoryData, editMode } =
		useAppSelector((state) => state.childCategories);

	const { parentCategories } = useAppSelector(
		(state) => state.parentCategories
	);

	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	const firstInputRef = useRef<HTMLInputElement>(null);

	const resetState = () => {
		setHasInputBlured(defaultState);
		setHasInputFocused(defaultState);
	};

	const handleCancel = () => {
		dispatch(setIsChildCategoryModalOpen(false));
		dispatch(setChildCategoryData(null));
		dispatch(setChildCategoryEditMode(false));
		resetState();
	};

	const handleCreateChildCategory = (formData: FormData) => {
		setIsLoading(true);
		axiosPrivate
			.post("/category/child/new", formData)
			.then((res) => {
				if (!res.data.success) {
					return toast.error(
						"Child category creation failed, Please try again"
					);
				}
				dispatch(setIsChildCategoryModalOpen(false));
				dispatch(addNewChildCategory(res.data.data.childCategory));
				resetState();
				return toast.success(res.data.message);
			})
			.catch(errorHandler)
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleUpdateChildCategory = (formData: FormData) => {
		setIsLoading(true);
		axiosPrivate
			.put(`/category/child/update/${childCategoryData?._id}`, formData)
			.then((res) => {
				if (!res.data.success) {
					return toast.error(
						"Child category updation failed, Please try again"
					);
				}
				dispatch(setIsChildCategoryModalOpen(false));
				dispatch(setChildCategoryEditMode(false));
				dispatch(setChildCategoryData(null));
				dispatch(updateChildCategory(res.data.data.childCategory));
				resetState();
				return toast.success(res.data.message);
			})
			.catch(errorHandler)
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
				handleUpdateChildCategory(formData);
			} else {
				handleCreateChildCategory(formData);
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
				<Label htmlFor="name">Child Category Name</Label>
				<Input
					id="name"
					defaultValue={childCategoryData?.name}
					autoComplete="off"
					name="name"
					type="text"
					innerRef={firstInputRef}
					required={true}
					className="peer min-w-[24rem]"
					onBlur={() =>
						setHasInputBlured((prev) => ({
							...prev,
							name: true,
						}))
					}
					onFocus={() =>
						setHasInputFocused((prev) => ({
							...prev,
							name: true,
						}))
					}
				/>
				{hasInputFocused.name && hasInputBlured.name && (
					<Message error={true} className="hidden peer-invalid:block">
						Child category name is required
					</Message>
				)}
			</div>
			<div className="flex flex-col gap-1">
				<Label htmlFor="parentCategoryId">Parent Category</Label>
				<Select
					name="parentCategoryId"
					id="parentCategoryId"
					options={parentCategories?.map((parentCategory) => ({
						id: parentCategory?._id,
						name: parentCategory?.name,
					}))}
					required={true}
					className="peer"
					onBlur={() =>
						setHasInputBlured((prev) => ({
							...prev,
							parentCategory: true,
						}))
					}
					onFocus={() =>
						setHasInputFocused((prev) => ({
							...prev,
							parentCategory: true,
						}))
					}
				/>
				{hasInputFocused.parentCategory &&
					hasInputBlured.parentCategory && (
						<Message
							error={true}
							className="hidden peer-invalid:block"
						>
							Parent category is required
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
	}, [isChildCategoryModalOpen]);

	return (
		<Modal
			isOpen={isChildCategoryModalOpen}
			onClose={() => dispatch(setIsChildCategoryModalOpen(false))}
			body={body}
			title={`${editMode ? "Edit" : "Create"} child category`}
			description={`${
				editMode ? "Edit the" : "Create a new"
			} child category for you products`}
		/>
	);
};

export default ManageChildCategoryModal;
