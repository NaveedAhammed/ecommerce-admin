import { createSlice } from "@reduxjs/toolkit";
import { ColorType } from "../../types";

interface ColorsState {
  colors: ColorType[];
  isLoading: boolean;
}

const initialState: ColorsState = {
  colors: [],
  isLoading: false,
};

const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    setColors(state, action) {
      state.colors = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    removeColor(state, action) {
      state.colors = state.colors.filter((item) => item._id !== action.payload);
    },
    updateColor(state, action) {
      const indexOfColor = state.colors.findIndex(
        (item) => item._id === action.payload._id
      );
      state.colors[indexOfColor] = action.payload;
    },
  },
});

export const { setColors, setLoading, updateColor, removeColor } =
  colorSlice.actions;

export default colorSlice.reducer;
