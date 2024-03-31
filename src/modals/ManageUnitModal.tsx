import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Label from "../components/Label";
import Modal from "../components/Modal";
import Message from "../components/Message";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
	addNewUnit,
	setIsUnitModalOpen,
	setUnitData,
	setUnitEditMode,
	updateUnit,
} from "../redux/slices/unitSlice";
import { errorHandler } from "../utils/errorHandler";

type InputFieldsState = {
	name: boolean;
	value: boolean;
};

const defaultState: InputFieldsState = {
	name: false,
	value: false,
};

const ManageUnitModal = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasInputFocused, setHasInputFocused] =
		useState<InputFieldsState>(defaultState);
	const [hasInputBlured, setHasInputBlured] =
		useState<InputFieldsState>(defaultState);

	const { isUnitModalOpen, editMode, unitData } = useAppSelector(
		(state) => state.units
	);

	const dispatch = useAppDispatch();

	const axiosPrivate = useAxiosPrivate();

	const firstInputRef = useRef<HTMLInputElement>(null);

	const resetState = () => {
		setHasInputBlured(defaultState);
		setHasInputFocused(defaultState);
	};

	const handleCancel = () => {
		dispatch(setIsUnitModalOpen(false));
		dispatch(setUnitData(null));
		dispatch(setUnitEditMode(false));
		resetState();
	};

	const handleCreateUnit = (formData: FormData) => {
		setIsLoading(true);
		axiosPrivate
			.post("/unit/new", formData)
			.then((res) => {
				if (!res.data.success) {
					return toast.error(
						"Unit creation failed, Please try again"
					);
				}
				dispatch(setIsUnitModalOpen(false));
				dispatch(addNewUnit(res.data.data.unit));
				resetState();
				return toast.success(res.data.message);
			})
			.catch(errorHandler)
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleUpdateUnit = (formData: FormData) => {
		setIsLoading(true);
		axiosPrivate
			.put(`/unit/update/${unitData?._id}`, formData)
			.then((res) => {
				if (!res.data.success) {
					return toast.error(
						"Unit creation failed, Please try again"
					);
				}
				dispatch(setIsUnitModalOpen(false));
				dispatch(setUnitData(null));
				dispatch(updateUnit(res.data.unit));
				dispatch(setUnitEditMode(false));
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
				handleUpdateUnit(formData);
			} else {
				handleCreateUnit(formData);
			}
		}
	};

	const body: React.ReactNode = (
		<form
			className="flex flex-col gap-3"
			onSubmit={handleOnSubmit}
			noValidate
		>
			<div className="flex flex-col gap-2">
				<Label htmlFor="name">Name</Label>
				<Input
					id="name"
					defaultValue={unitData?.name}
					autoComplete="off"
					name="name"
					type="text"
					required={true}
					onBlur={() =>
						setHasInputBlured((prev) => ({ ...prev, name: true }))
					}
					onFocus={() =>
						setHasInputFocused((prev) => ({ ...prev, name: true }))
					}
					innerRef={firstInputRef}
					disabled={isLoading}
					className="peer min-w-[24rem]"
				/>
				{hasInputBlured.name && hasInputFocused.name && (
					<Message error={true} className="hidden peer-invalid:block">
						Unit name is required
					</Message>
				)}
			</div>
			<div className="flex flex-col gap-2">
				<Label htmlFor="value">Value</Label>
				<Input
					id="value"
					defaultValue={unitData?.value}
					autoComplete="off"
					name="value"
					type="text"
					disabled={isLoading}
					required={true}
					onBlur={() =>
						setHasInputBlured((prev) => ({ ...prev, value: true }))
					}
					onFocus={() =>
						setHasInputFocused((prev) => ({ ...prev, value: true }))
					}
					className="peer min-w-[24rem]"
				/>
				{hasInputBlured.value && hasInputFocused.value && (
					<Message error={true} className="hidden peer-invalid:block">
						Unit value is required
					</Message>
				)}
			</div>
			<div className="flex flex-col gap-2">
				<Label htmlFor="value">Short Hand</Label>
				<Input
					id="shortHand"
					defaultValue={unitData?.shortHand}
					autoComplete="off"
					name="shortHand"
					type="text"
					disabled={isLoading}
					className="min-w-[24rem]"
				/>
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
	}, [isUnitModalOpen]);

	return (
		<Modal
			isOpen={isUnitModalOpen}
			onClose={() => dispatch(setIsUnitModalOpen(false))}
			body={body}
			title={`${editMode ? "Edit" : "Create"} Unit`}
			description={`${
				editMode ? "Edit the" : "Create a new"
			} unit for your products`}
		/>
	);
};

export default ManageUnitModal;
