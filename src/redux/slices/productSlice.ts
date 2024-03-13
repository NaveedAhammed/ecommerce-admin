import { createSlice } from "@reduxjs/toolkit";
import { ProductType } from "../../types";

interface ProductsState {
  products: ProductType[];
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
    updateProduct(state, action) {
      const indexOfProduct = state.products.findIndex(
        (item) => item._id === action.payload._id
      );
      state.products[indexOfProduct] = action.payload;
    },
    removeProductImage(state, action) {
      const indexOfProduct = state.products.findIndex(
        (prd) => prd._id === action.payload.productId
      );
      const indexOfImage = state.products[indexOfProduct].images.findIndex(
        (img) => img._id === action.payload.imageId
      );
      state.products[indexOfProduct].images.splice(indexOfImage, 1);
    },
  },
});

export const {
  setProducts,
  setLoading,
  addProduct,
  removeProduct,
  setPageNum,
  updateProduct,
  removeProductImage,
} = productSlice.actions;

export default productSlice.reducer;
