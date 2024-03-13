import { createSlice } from "@reduxjs/toolkit";
import { CategoryType } from "../../types";

interface CategoriesState {
  categories: CategoryType[];
  isLoading: boolean;
}

const initialState: CategoriesState = {
  categories: [],
  isLoading: false,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
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
  },
});

export const { setCategories, setLoading, updateCategory, removeCategory } =
  categorySlice.actions;

export default categorySlice.reducer;
