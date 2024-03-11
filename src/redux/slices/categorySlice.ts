import { createSlice } from "@reduxjs/toolkit";

export interface Category {
	_id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}

interface CategoriesState {
	categories: Category[];
	isLoading: boolean;
}

const initialState: CategoriesState = {
	categories: [],
	isLoading: false,
};

const sizeSlice = createSlice({
	name: "category",
	initialState,
	reducers: {
		setCategories(state, action) {
			state.categories = action.payload;
		},
		setLoading(state, action) {
			state.isLoading = action.payload;
		},
	},
});

export const { setCategories, setLoading } = sizeSlice.actions;

export default sizeSlice.reducer;
