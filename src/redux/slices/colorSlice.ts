import { createSlice } from "@reduxjs/toolkit";
import { ColorType } from "../../types";

interface ColorsState {
	colors: ColorType[];
	isColorModalOpen: boolean;
	colorData: ColorType | null;
	editMode: boolean;
	pageNum: number;
	colorsPerPage: number;
}

const initialState: ColorsState = {
	colors: [],
	isColorModalOpen: false,
	colorData: null,
	editMode: false,
	pageNum: 1,
	colorsPerPage: 10,
};

const colorSlice = createSlice({
	name: "color",
	initialState,
	reducers: {
		setColors(state, action) {
			state.colors = action.payload;
		},
		removeColor(state, action) {
			state.colors = state.colors.filter(
				(item) => item._id !== action.payload
			);
		},
		updateColor(state, action) {
			const indexOfColor = state.colors.findIndex(
				(item) => item._id === action.payload._id
			);
			state.colors[indexOfColor] = action.payload;
		},
		setColorEditMode(state, action) {
			state.editMode = action.payload;
		},
		setColorData(state, action) {
			state.colorData = action.payload;
		},
		setIsColorModalOpen(state, action) {
			state.isColorModalOpen = action.payload;
		},
		addNewColor(state, action) {
			state.colors.push(action.payload);
		},
		setColorsPageNum(state, action) {
			state.pageNum = action.payload;
		},
	},
});

export const {
	setColors,
	updateColor,
	removeColor,
	addNewColor,
	setColorData,
	setColorEditMode,
	setIsColorModalOpen,
	setColorsPageNum,
} = colorSlice.actions;

export default colorSlice.reducer;
