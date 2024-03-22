import { configureStore } from "@reduxjs/toolkit";
import sizesReducer from "../redux/slices/sizeSlice";
import productsReducer from "../redux/slices/productSlice";
import categoriesReducer from "../redux/slices/categorySlice";
import colorsReducer from "../redux/slices/colorSlice";
import billboardsReducer from "../redux/slices/billboardSlice";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export const store = configureStore({
	reducer: {
		sizes: sizesReducer,
		colors: colorsReducer,
		categories: categoriesReducer,
		products: productsReducer,
		billboards: billboardsReducer,
	},
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
	ReturnType<typeof store.getState>
> = useSelector;
