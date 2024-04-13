import { configureStore } from "@reduxjs/toolkit";
import unitsReducer from "./slices/unitSlice";
import productsReducer from "../redux/slices/productSlice";
import childCategoriesReducer from "./slices/childCategorySlice";
import parentCategoriesReducer from "../redux/slices/parentCategorySlice";
import colorsReducer from "../redux/slices/colorSlice";
import billboardsReducer from "../redux/slices/billboardSlice";
import ordersReducer from "../redux/slices/orderSlice";
import usersReducer from "../redux/slices/userSlice";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export const store = configureStore({
	reducer: {
		units: unitsReducer,
		colors: colorsReducer,
		childCategories: childCategoriesReducer,
		products: productsReducer,
		billboards: billboardsReducer,
		parentCategories: parentCategoriesReducer,
		orders: ordersReducer,
		users: usersReducer,
	},
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
	ReturnType<typeof store.getState>
> = useSelector;
