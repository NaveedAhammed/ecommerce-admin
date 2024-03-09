import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
  },
});

export const { setSizes, setLoading } = sizeSlice.actions;

export default sizeSlice.reducer;
