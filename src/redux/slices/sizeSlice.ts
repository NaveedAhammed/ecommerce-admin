import { createSlice } from "@reduxjs/toolkit";
import { SizeType } from "../../types";

interface SizesState {
  sizes: SizeType[];
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
      state.sizes = state.sizes.filter((item) => item._id !== action.payload);
    },
    updateSize(state, action) {
      const indexOfSize = state.sizes.findIndex(
        (item) => item._id === action.payload._id
      );
      state.sizes[indexOfSize] = action.payload;
    },
  },
});

export const { setSizes, setLoading, addSize, removeSize, updateSize } =
  sizeSlice.actions;

export default sizeSlice.reducer;
