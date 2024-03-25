import { createSlice } from "@reduxjs/toolkit";
import { ProductType } from "../../types";

interface ProductsState {
	products: ProductType[];
	isProductModalOpen: boolean;
	productData: ProductType | null;
	editMode: boolean;
	pageNum: number;
	productsPerPage: number;
	totalProducts?: number;
}

const initialState: ProductsState = {
	products: [],
	isProductModalOpen: false,
	productData: null,
	editMode: false,
	pageNum: 1,
	productsPerPage: 5,
};

const productSlice = createSlice({
	name: "product",
	initialState,
	reducers: {
		setProducts(state, action) {
			state.products = action.payload.products;
			state.totalProducts = action.payload?.totalProducts;
		},
		removeProduct(state, action) {
			state.products = state.products.filter(
				(product) => product._id !== action.payload
			);
		},
		setPageNum(state, action) {
			state.pageNum = action.payload;
		},
		updateProduct(state, action) {
			const indexOfProduct = state.products.findIndex(
				(item) => item._id === action.payload.product._id
			);
			state.products[indexOfProduct] = action.payload.product;
			state.totalProducts = action.payload.totalProducts;
		},
		removeProductImage(state, action) {
			const indexOfProduct = state.products.findIndex(
				(prd) => prd._id === action.payload.productId
			);
			const indexOfImage = state.products[
				indexOfProduct
			].images.findIndex((img) => img._id === action.payload.imageId);
			state.products[indexOfProduct].images.splice(indexOfImage, 1);
		},
		setProductEditMode(state, action) {
			state.editMode = action.payload;
		},
		setProductData(state, action) {
			state.productData = action.payload;
		},
		setIsProductModalOpen(state, action) {
			state.isProductModalOpen = action.payload;
		},
		addNewProduct(state, action) {
			state.products.push(action.payload);
		},
		setTotalProducts(state, action) {
			state.totalProducts = action.payload;
		},
	},
});

export const {
	setProducts,
	removeProduct,
	setPageNum,
	updateProduct,
	removeProductImage,
	addNewProduct,
	setIsProductModalOpen,
	setProductData,
	setProductEditMode,
	setTotalProducts,
} = productSlice.actions;

export default productSlice.reducer;
