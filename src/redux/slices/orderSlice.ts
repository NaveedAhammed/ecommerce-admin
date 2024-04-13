import { createSlice } from "@reduxjs/toolkit";
import { OrderType } from "../../types";

interface OrdersState {
	orders: OrderType[];
	isOrderModalOpen: boolean;
	orderData: OrderType | null;
	editMode: boolean;
	pageNum: number;
	ordersPerPage: number;
	totalOrders?: number;
}

const initialState: OrdersState = {
	orders: [],
	isOrderModalOpen: false,
	orderData: null,
	editMode: false,
	pageNum: 1,
	ordersPerPage: 10,
};

const orderSlice = createSlice({
	name: "order",
	initialState,
	reducers: {
		setOrders(state, action) {
			state.orders = action.payload.orders;
			state.totalOrders = action.payload?.totalOrders;
		},
		removeOrder(state, action) {
			state.orders = state.orders.filter(
				(order) => order._id !== action.payload
			);
		},
		setPageNum(state, action) {
			state.pageNum = action.payload;
		},
		updateOrder(state, action) {
			const indexOfProduct = state.orders.findIndex(
				(item) => item._id === action.payload.order._id
			);
			state.orders[indexOfProduct] = action.payload.order;
			state.totalOrders = action.payload.totalOrders;
		},
		setOrderEditMode(state, action) {
			state.editMode = action.payload;
		},
		setOrderData(state, action) {
			state.orderData = action.payload;
		},
		setIsOrderModalOpen(state, action) {
			state.isOrderModalOpen = action.payload;
		},
		addNewOrder(state, action) {
			state.orders.push(action.payload);
		},
		setTotalOrders(state, action) {
			state.totalOrders = action.payload;
		},
	},
});

export const {
	setIsOrderModalOpen,
	addNewOrder,
	removeOrder,
	setOrderData,
	setOrderEditMode,
	setOrders,
	setTotalOrders,
	updateOrder,
	setPageNum,
} = orderSlice.actions;

export default orderSlice.reducer;
