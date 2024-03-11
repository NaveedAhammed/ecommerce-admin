import { createSlice } from "@reduxjs/toolkit";

export interface Color {
	_id: string;
	name: string;
	value: string;
	createdAt: string;
	updatedAt: string;
}

interface ColorsState {
	colors: Color[];
	isLoading: boolean;
}

const initialState: ColorsState = {
	colors: [],
	isLoading: false,
};

const sizeSlice = createSlice({
	name: "color",
	initialState,
	reducers: {
		setColors(state, action) {
			state.colors = action.payload;
		},
		setLoading(state, action) {
			state.isLoading = action.payload;
		},
	},
});

export const { setColors, setLoading } = sizeSlice.actions;

export default sizeSlice.reducer;
