import { createSlice } from "@reduxjs/toolkit";
import { ChildCategoryType } from "../../types";

interface ChildCategoriesState {
	childCategories: ChildCategoryType[];
	isChildCategoryModalOpen: boolean;
	childCategoryData: ChildCategoryType | null;
	editMode: boolean;
	pageNum: number;
	childCategoriesPerPage: number;
}

const initialState: ChildCategoriesState = {
	childCategories: [],
	isChildCategoryModalOpen: false,
	childCategoryData: null,
	editMode: false,
	pageNum: 1,
	childCategoriesPerPage: 10,
};

const childCategorySlice = createSlice({
	name: "category",
	initialState,
	reducers: {
		setChildCategories(state, action) {
			state.childCategories = action.payload;
		},
		removeChildCategory(state, action) {
			state.childCategories = state.childCategories.filter(
				(item) => item._id !== action.payload
			);
		},
		updateChildCategory(state, action) {
			const indexOfCategory = state.childCategories.findIndex(
				(item) => item._id === action.payload._id
			);
			state.childCategories[indexOfCategory] = action.payload;
		},
		setChildCategoryData(state, action) {
			state.childCategoryData = action.payload;
		},
		setChildCategoryEditMode(state, action) {
			state.editMode = action.payload;
		},
		setIsChildCategoryModalOpen(state, action) {
			state.isChildCategoryModalOpen = action.payload;
		},
		addNewChildCategory(state, action) {
			state.childCategories.push(action.payload);
		},
		setChildCategoriesPageNum(state, action) {
			state.pageNum = action.payload;
		},
	},
});

export const {
	addNewChildCategory,
	removeChildCategory,
	setChildCategories,
	setChildCategoriesPageNum,
	setChildCategoryData,
	setChildCategoryEditMode,
	setIsChildCategoryModalOpen,
	updateChildCategory,
} = childCategorySlice.actions;

export default childCategorySlice.reducer;
