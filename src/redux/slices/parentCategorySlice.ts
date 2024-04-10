import { createSlice } from "@reduxjs/toolkit";
import { ParentCategoryType } from "../../types";

interface ParentCategoriesState {
	parentCategories: ParentCategoryType[];
	isParentCategoryModalOpen: boolean;
	parentCategoryData: ParentCategoryType | null;
	editMode: boolean;
	pageNum: number;
	parentCategoriesPerPage: number;
}

const initialState: ParentCategoriesState = {
	parentCategories: [],
	isParentCategoryModalOpen: false,
	parentCategoryData: null,
	editMode: false,
	pageNum: 1,
	parentCategoriesPerPage: 10,
};

const parentCategorySlice = createSlice({
	name: "parentCategory",
	initialState,
	reducers: {
		setParentCategories(state, action) {
			state.parentCategories = action.payload;
		},
		removeParentCategory(state, action) {
			state.parentCategories = state.parentCategories.filter(
				(item) => item._id !== action.payload
			);
		},
		updateParentCategory(state, action) {
			const indexOfCategory = state.parentCategories.findIndex(
				(item) => item._id === action.payload._id
			);
			state.parentCategories[indexOfCategory] = action.payload;
		},
		setParentCategoryData(state, action) {
			state.parentCategoryData = action.payload;
		},
		setParentCategoryEditMode(state, action) {
			state.editMode = action.payload;
		},
		setIsParentCategoryModalOpen(state, action) {
			state.isParentCategoryModalOpen = action.payload;
		},
		addNewParentCategory(state, action) {
			state.parentCategories.push(action.payload);
		},
		setParentCategoriesPageNum(state, action) {
			state.pageNum = action.payload;
		},
	},
});

export const {
	addNewParentCategory,
	removeParentCategory,
	setIsParentCategoryModalOpen,
	setParentCategories,
	setParentCategoriesPageNum,
	setParentCategoryData,
	setParentCategoryEditMode,
	updateParentCategory,
} = parentCategorySlice.actions;

export default parentCategorySlice.reducer;
