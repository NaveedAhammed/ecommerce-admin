import { createSlice } from "@reduxjs/toolkit";

export interface Size {
	_id: string;
	name: string;
	value: string;
	createdAt: string;
	updatedAt: string;
}

interface SizesState {
	sizes: Size[];
	isLoading: boolean;
}

const initialState: SizesState = {
	sizes: [],
	isLoading: false,
};

const sizeSlice = createSlice({
	name: "size",
	initialState,
	reducers: {
		setSizes(state, action) {
			state.sizes = action.payload;
		},
		setLoading(state, action) {
			state.isLoading = action.payload;
		},
		addSize(state, action) {
			state.sizes.push(action.payload);
		},
		removeSize(state, action) {
			state.sizes = state.sizes.filter(
				(size) => size._id !== action.payload
			);
		},
	},
});

export const { setSizes, setLoading, addSize, removeSize } = sizeSlice.actions;

export default sizeSlice.reducer;
