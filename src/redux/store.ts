import { configureStore } from "@reduxjs/toolkit";
import sizesReducer from "../redux/slices/sizeSlice";

export const store = configureStore({
  reducer: {
    sizes: sizesReducer,
  },
});
