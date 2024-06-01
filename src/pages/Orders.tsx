import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Table, {
	TBody,
	THead,
	THeadData,
	TRow,
	TRowData,
} from "../components/Table";
import TableAction from "../components/TableAction";
import { useAppDispatch, useAppSelector } from "../redux/store";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import dayjs from "dayjs";
import Button from "../components/Button";
import { OrderType } from "../types";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../components/Loader";
import { correncyFormatter } from "../utils/correncyFormat";
import { errorHandler } from "../utils/errorHandler";
import {
	removeOrder,
	setIsOrderModalOpen,
	setOrderData,
	setOrderEditMode,
	setOrders,
	setPageNum,
} from "../redux/slices/orderSlice";

const Orders = () => {
	const { orders, pageNum, ordersPerPage, totalOrders } = useAppSelector(
		(state) => state.orders
	);
	const [isLoading, setIsLoading] = useState(false);

	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	const handleActionEdit = (data: OrderType) => {
		dispatch(setOrderEditMode(true));
		dispatch(setOrderData(data));
		dispatch(setIsOrderModalOpen(true));
	};

	const handleActionDelete = (order: OrderType) => {
		const res = axiosPrivate.delete(`/order/delete/${order._id}`);
		toast.promise(res, {
			loading: `Deleting the order ${order._id}`,
			success: () => {
				dispatch(removeOrder(order._id));
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
		dispatch(setOrders({ orders: [] }));
		if (dir === "previous") {
			dispatch(setPageNum(pageNum - 1));
		} else {
			dispatch(setPageNum(pageNum + 1));
		}
	};

	useEffect(() => {
		const fetchOrders = () => {
			setIsLoading(true);
			axiosPrivate
				.get(`/orders?page=${pageNum}`)
				.then((res) => {
					dispatch(
						setOrders({
							orders: res.data.data.orders,
							totalOrders: res.data.data.totalOrders,
						})
					);
				})
				.catch(errorHandler)
				.finally(() => {
					setIsLoading(false);
				});
		};

		orders.length === 0 && fetchOrders();
	}, [axiosPrivate, dispatch, pageNum, orders]);
	return (
		<div className="w-full h-full">
			<Heading
				title="Orders"
				description="Manage orders of your store"
				action={() => dispatch(setIsOrderModalOpen(true))}
				actionLabel="Add New"
				actionLabelNotRequired
			/>
			<Table>
				<THead>
					<TRow>
						<THeadData>Order ID</THeadData>
						<THeadData>Shipping Info</THeadData>
						<THeadData>Customer</THeadData>
						<THeadData>Amount</THeadData>
						<THeadData>Payment Info</THeadData>
						<THeadData>Shipping Charge</THeadData>
						<THeadData>Order Status</THeadData>
						<THeadData>OrderAt</THeadData>
						<THeadData>Action</THeadData>
					</TRow>
				</THead>
				{isLoading && (
					<tbody className="relative">
						<tr>
							<td className="h-16">
								<Loader
									color="black"
									height="2rem"
									width="2rem"
									className="absolute top-4 left-[50%]"
								/>
							</td>
						</tr>
					</tbody>
				)}
				{orders?.length > 0 && (
					<TBody>
						{orders?.map((order) => (
							<TRow key={order._id}>
								<TRowData>{order._id.slice(0, 15)}...</TRowData>
								<TRowData>
									{`${order.shippingInfo?.address}, ${order.shippingInfo?.city}(City.), ${order.shippingInfo?.state} - ${order.shippingInfo?.pincode}`.slice(
										0,
										15
									)}
									...
								</TRowData>
								<TRowData>{order.userId.username}</TRowData>
								<TRowData>
									{
										correncyFormatter
											.format(
												Number(
													order.orderItems
														.map(
															(it) =>
																(it.price *
																	(100 -
																		it.discount) *
																	it.quantity) /
																100
														)
														.reduce(
															(prev, curr) =>
																prev + curr,
															0
														)
												)
											)
											.split(".")[0]
									}
								</TRowData>
								<TRowData>
									<div
										className={`w-fit px-2 py-1 text-xs rounded-md flex items-center justify-center  ${
											order.paymentInfo === "pending"
												? "text-yellow-500 bg-yellow-500/20"
												: order.paymentInfo ===
												  "success"
												? "bg-green-600/20 text-green-600"
												: "text-destructive bg-destructive/20"
										}`}
									>
										{order.paymentInfo}
									</div>
								</TRowData>
								<TRowData>
									{
										correncyFormatter
											.format(Number(order.shippingPrice))
											.split(".")[0]
									}
								</TRowData>
								<TRowData>
									<div
										className={`w-fit px-2 py-1 text-xs rounded-md flex items-center justify-center  ${
											order.orderStatus === "not placed"
												? "text-destructive bg-destructive/20"
												: order.orderStatus ===
												  "processing"
												? "text-yellow-500 bg-yellow-500/20"
												: order.orderStatus ===
												  "shipped"
												? "bg-green-600/20 text-green-600"
												: "text-blue bg-blue/20"
										}`}
									>
										{order.orderStatus}
									</div>
								</TRowData>
								<TRowData>
									{dayjs(
										order?.orderedAt?.split("T")[0]
									).format("MMM D, YYYY")}
								</TRowData>
								<TableAction
									onDelete={() => handleActionDelete(order)}
									onEdit={() => handleActionEdit(order)}
								/>
							</TRow>
						))}
					</TBody>
				)}
			</Table>
			<div className="w-full flex items-center p-4 justify-end gap-3">
				<Button
					varient="outline"
					size="sm"
					onClick={() => handlePagination("previous")}
					disabled={pageNum === 1 || isLoading}
				>
					Previous
				</Button>
				<span>{pageNum}</span>
				<Button
					varient="outline"
					size="sm"
					onClick={() => handlePagination("next")}
					disabled={
						totalOrders
							? pageNum >= Math.ceil(totalOrders / ordersPerPage)
							: isLoading
					}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default Orders;
