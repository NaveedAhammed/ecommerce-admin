import { createSlice } from "@reduxjs/toolkit";
import { BillboardType } from "../../types";

interface BillboardState {
	billboards: BillboardType[];
	isBillboardModalOpen: boolean;
	billboardData: BillboardType | null;
	editMode: boolean;
	pageNum: number;
	billboardsPerPage: number;
}

const initialState: BillboardState = {
	billboards: [],
	isBillboardModalOpen: false,
	billboardData: null,
	editMode: false,
	pageNum: 1,
	billboardsPerPage: 5,
};

const billboardSlice = createSlice({
	name: "billboard",
	initialState,
	reducers: {
		setBillboards(state, action) {
			state.billboards = action.payload;
		},
		removeBillboard(state, action) {
			state.billboards = state.billboards.filter(
				(item) => item._id !== action.payload
			);
		},
		updateBillboard(state, action) {
			console.log(action.payload);
			const indexOfBillboard = state.billboards.findIndex(
				(item) => item._id === action.payload._id
			);
			console.log(indexOfBillboard);
			state.billboards[indexOfBillboard] = action.payload;
		},
		setBillboardEditMode(state, action) {
			state.editMode = action.payload;
		},
		setBillboardData(state, action) {
			state.billboardData = action.payload;
		},
		setIsBillboardModalOpen(state, action) {
			state.isBillboardModalOpen = action.payload;
		},
		addNewBillboard(state, action) {
			state.billboards.push(action.payload);
		},
		setBillboardsPageNum(state, action) {
			state.pageNum = action.payload;
		},
		removeBillboardImg(state) {
			if (state.billboardData?.imageUrl) {
				state.billboardData.imageUrl = undefined;
			}
		},
	},
});

export const {
	setBillboards,
	updateBillboard,
	removeBillboard,
	setBillboardEditMode,
	setBillboardData,
	setIsBillboardModalOpen,
	addNewBillboard,
	removeBillboardImg,
	setBillboardsPageNum,
} = billboardSlice.actions;

export default billboardSlice.reducer;
