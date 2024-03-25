import { createSlice } from "@reduxjs/toolkit";
import { UnitType } from "../../types";

interface UnitsState {
	units: UnitType[];
	isUnitModalOpen: boolean;
	unitData: UnitType | null;
	editMode: boolean;
	pageNum: number;
	unitsPerPage: number;
}

const initialState: UnitsState = {
	units: [],
	isUnitModalOpen: false,
	unitData: null,
	editMode: false,
	pageNum: 1,
	unitsPerPage: 5,
};

const unitSlice = createSlice({
	name: "unit",
	initialState,
	reducers: {
		setUnits(state, action) {
			state.units = action.payload;
		},
		addNewUnit(state, action) {
			state.units.push(action.payload);
		},
		removeUnit(state, action) {
			state.units = state.units.filter(
				(item) => item._id !== action.payload
			);
		},
		updateUnit(state, action) {
			const indexOfSize = state.units.findIndex(
				(item) => item._id === action.payload._id
			);
			state.units[indexOfSize] = action.payload;
		},
		setUnitEditMode(state, action) {
			state.editMode = action.payload;
		},
		setUnitData(state, action) {
			state.unitData = action.payload;
		},
		setIsUnitModalOpen(state, action) {
			state.isUnitModalOpen = action.payload;
		},
		setUnitsPageNum(state, action) {
			state.pageNum = action.payload;
		},
	},
});

export const {
	setUnits,
	addNewUnit,
	removeUnit,
	updateUnit,
	setIsUnitModalOpen,
	setUnitData,
	setUnitEditMode,
	setUnitsPageNum,
} = unitSlice.actions;

export default unitSlice.reducer;
