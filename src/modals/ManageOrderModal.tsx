import { useState } from "react";
import Button from "../components/Button";
import Label from "../components/Label";
import Modal from "../components/Modal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useAppDispatch, useAppSelector } from "../redux/store";
import Select from "../components/Select";
import { errorHandler } from "../utils/errorHandler";
import {
	setIsOrderModalOpen,
	setOrderData,
	setOrderEditMode,
	updateOrder,
} from "../redux/slices/orderSlice";

type InputFieldsState = {
	orderStatus: boolean;
};

const defaultState: InputFieldsState = {
	orderStatus: false,
};

const orderStatusTypes: string[] = [
	"processing",
	"placed",
	"not placed",
	"shipped",
	"delivered",
];

const ManageOrderModal = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasInputFocused, setHasInputFocused] =
		useState<InputFieldsState>(defaultState);
	const [hasInputBlured, setHasInputBlured] =
		useState<InputFieldsState>(defaultState);

	const { isOrderModalOpen, orderData } = useAppSelector(
		(state) => state.orders
	);

	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	const resetState = () => {
		setHasInputBlured(defaultState);
		setHasInputFocused(defaultState);
	};

	const handleCancel = () => {
		dispatch(setIsOrderModalOpen(false));
		dispatch(setOrderData(null));
		dispatch(setOrderEditMode(false));
		resetState();
	};

	const handleUpdateOrderStatus = (formData: FormData) => {
		setIsLoading(true);
		axiosPrivate
			.put(`/order/status/update/${orderData?._id}`, formData)
			.then((res) => {
				if (!res.data.success) {
					return toast.error(
						"Order status updation failed, Please try again"
					);
				}
				dispatch(setIsOrderModalOpen(false));
				dispatch(setOrderData(null));
				dispatch(setOrderEditMode(false));
				dispatch(updateOrder(res.data.data.order));
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
			handleUpdateOrderStatus(formData);
		}
	};

	const body: React.ReactNode = (
		<form className="min-w-[20rem]" noValidate onSubmit={handleOnSubmit}>
			<div className="flex flex-col gap-1 w-full mb-6">
				<Label htmlFor="orderStatus">Order Status</Label>
				<Select
					name="orderStatus"
					id="orderStatus"
					options={orderStatusTypes?.map((it) => ({
						id: it,
						name: it,
					}))}
					defaultValue={orderData?.orderStatus}
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
				{hasInputFocused.orderStatus && hasInputBlured.orderStatus && (
					<Message error={true} className="hidden peer-invalid:block">
						Order status is required
					</Message>
				)}
			</div>
			<div className="flex gap-2 items-center justify-end col-span-2">
				<Button onClick={handleCancel} size="default" varient="outline">
					Cancel
				</Button>
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
			</div>
		</form>
	);

	return (
		<Modal
			isOpen={isOrderModalOpen}
			onClose={() => dispatch(setIsOrderModalOpen(false))}
			body={body}
			title="Edit order status"
			description="Edit the order status of your store"
		/>
	);
};

export default ManageOrderModal;
