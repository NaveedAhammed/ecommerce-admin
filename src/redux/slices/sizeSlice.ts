import { createSlice } from "@reduxjs/toolkit";
import { SizeType } from "../../types";

interface SizesState {
	sizes: SizeType[];
	isSizeModalOpen: boolean;
	sizeData: SizeType | null;
	editMode: boolean;
	pageNum: number;
	sizesPerPage: number;
}

const initialState: SizesState = {
	sizes: [],
	isSizeModalOpen: false,
	sizeData: null,
	editMode: false,
	pageNum: 1,
	sizesPerPage: 5,
};

const sizeSlice = createSlice({
	name: "size",
	initialState,
	reducers: {
		setSizes(state, action) {
			state.sizes = action.payload;
		},
		addSize(state, action) {
			state.sizes.push(action.payload);
		},
		removeSize(state, action) {
			state.sizes = state.sizes.filter(
				(item) => item._id !== action.payload
			);
		},
		updateSize(state, action) {
			const indexOfSize = state.sizes.findIndex(
				(item) => item._id === action.payload._id
			);
			state.sizes[indexOfSize] = action.payload;
		},
		setSizeEditMode(state, action) {
			state.editMode = action.payload;
		},
		setSizeData(state, action) {
			state.sizeData = action.payload;
		},
		setIsSizeModalOpen(state, action) {
			state.isSizeModalOpen = action.payload;
		},
		addNewSize(state, action) {
			state.sizes.push(action.payload);
		},
		setSizesPageNum(state, action) {
			state.pageNum = action.payload;
		},
	},
});

export const {
	setSizes,
	addSize,
	removeSize,
	updateSize,
	addNewSize,
	setSizeEditMode,
	setIsSizeModalOpen,
	setSizeData,
	setSizesPageNum,
} = sizeSlice.actions;

export default sizeSlice.reducer;
