import { createSlice } from "@reduxjs/toolkit";
import { Size } from "./sizeSlice";
import { Color } from "./colorSlice";
import { Category } from "./categorySlice";

export interface Product {
	_id: string;
	title: string;
	description: string;
	price: number | string;
	discount: number | string;
	stock: number | string;
	images: string[];
	category: Category;
	color: Color;
	size: Size;
	featured: boolean;
	createdAt: string;
}

interface ProductsState {
	products: Product[];
	isLoading: boolean;
	pageNum: number;
}

const initialState: ProductsState = {
	products: [],
	isLoading: false,
	pageNum: 1,
};

const productSlice = createSlice({
	name: "product",
	initialState,
	reducers: {
		setProducts(state, action) {
			state.products = action.payload;
		},
		setLoading(state, action) {
			state.isLoading = action.payload;
		},
		addProduct(state, action) {
			state.products.push(action.payload);
		},
		removeProduct(state, action) {
			state.products = state.products.filter(
				(product) => product._id !== action.payload
			);
		},
		setPageNum(state, action) {
			state.pageNum = action.payload;
		},
	},
});

export const {
	setProducts,
	setLoading,
	addProduct,
	removeProduct,
	setPageNum,
} = productSlice.actions;

export default productSlice.reducer;
