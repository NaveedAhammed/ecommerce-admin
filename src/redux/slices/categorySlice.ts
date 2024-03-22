import { createSlice } from "@reduxjs/toolkit";
import { CategoryType } from "../../types";

interface CategoriesState {
	categories: CategoryType[];
	isCategoryModalOpen: boolean;
	categoryData: CategoryType | null;
	editMode: boolean;
	pageNum: number;
	categoriesPerPage: number;
}

const initialState: CategoriesState = {
	categories: [],
	isCategoryModalOpen: false,
	categoryData: null,
	editMode: false,
	pageNum: 1,
	categoriesPerPage: 5,
};

const categorySlice = createSlice({
	name: "category",
	initialState,
	reducers: {
		setCategories(state, action) {
			state.categories = action.payload;
		},
		removeCategory(state, action) {
			state.categories = state.categories.filter(
				(item) => item._id !== action.payload
			);
		},
		updateCategory(state, action) {
			const indexOfCategory = state.categories.findIndex(
				(item) => item._id === action.payload._id
			);
			state.categories[indexOfCategory] = action.payload;
		},
		setCategoryData(state, action) {
			state.categoryData = action.payload;
		},
		setCategoryEditMode(state, action) {
			state.editMode = action.payload;
		},
		setCategoryModalOpen(state, action) {
			state.isCategoryModalOpen = action.payload;
		},
		addNewCategory(state, action) {
			state.categories.push(action.payload);
		},
		setCategoriesPageNum(state, action) {
			state.pageNum = action.payload;
		},
	},
});

export const {
	setCategories,
	updateCategory,
	removeCategory,
	addNewCategory,
	setCategoryData,
	setCategoryModalOpen,
	setCategoriesPageNum,
	setCategoryEditMode,
} = categorySlice.actions;

export default categorySlice.reducer;
