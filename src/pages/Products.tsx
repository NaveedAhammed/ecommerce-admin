import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Table, {
	TBody,
	THead,
	THeadData,
	TRow,
	TRowData,
} from "../components/Table";
import TableAction from "../components/TableAction";
import { useAppDispatch, useAppSelector } from "../redux/store";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
	removeProduct,
	setIsProductModalOpen,
	setPageNum,
	setProductData,
	setProductEditMode,
	setProducts,
} from "../redux/slices/productSlice";
import dayjs from "dayjs";
import Button from "../components/Button";
import { ProductType } from "../types";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import ControlledInput from "../components/ControlledInput";

const Products = () => {
	const { products, pageNum, productsPerPage, totalProducts } =
		useAppSelector((state) => state.products);

	const [filterQuery, setFilterQuery] = useState<string>("");

	const filteredProducts = products.filter((pro) =>
		pro.title.includes(filterQuery)
	);

	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	const handleActionEdit = (data: ProductType) => {
		dispatch(setProductEditMode(true));
		dispatch(setProductData(data));
		dispatch(setIsProductModalOpen(true));
	};

	const handleActionDelete = async (product: ProductType) => {
		const res = (
			await axiosPrivate.delete(`/product/delete/${product._id}`)
		).data;
		toast.promise(res, {
			loading: `Deleting the product ${product.title}`,
			success: () => {
				dispatch(removeProduct(product._id));
				return "Deleted successfully";
			},
			error: (err) => {
				const error = err as AxiosError;
				console.log(error);
				if (!error?.response) {
					return "Something went wrong";
				} else {
					return `${error.response?.data?.message}`;
				}
			},
		});
	};

	const handlePagination = (dir: string) => {
		filterQuery && setFilterQuery("");
		if (dir === "previous") {
			if (pageNum === 1) return;
			dispatch(setPageNum(pageNum - 1));
		} else {
			dispatch(setPageNum(pageNum + 1));
		}
	};

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const res = (
					await axiosPrivate.get(`/products?page=${pageNum}`)
				).data;
				dispatch(
					setProducts({
						products: res.data.products,
						totalProducts: res.data.totalProducts,
					})
				);
				console.log(res.data);
			} catch (err) {
				console.log(err);
			}
		};

		fetchProducts();
	}, [axiosPrivate, dispatch, pageNum]);
	return (
		<div className="w-full h-full">
			<Heading
				title="Products"
				description="Manage products for you store"
				action={() => dispatch(setIsProductModalOpen(true))}
				actionLabel="Add New"
			/>
			<div className="flex items-center gap-4 w-full mb-4">
				<ControlledInput
					autoComplete="off"
					name="searchQuery"
					type="text"
					placeholder="Search"
					className="max-w-[30rem]"
					id="searchQuery"
					value={filterQuery}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setFilterQuery(e.target.value)
					}
				/>
				{filterQuery && (
					<Button
						varient="default"
						size="default"
						onClick={() => setFilterQuery("")}
					>
						Reset
					</Button>
				)}
			</div>
			<Table>
				<THead>
					<TRow>
						<THeadData>Title</THeadData>
						<THeadData>Description</THeadData>
						<THeadData>Stock</THeadData>
						<THeadData>Price</THeadData>
						<THeadData>Discount</THeadData>
						<THeadData>Size</THeadData>
						<THeadData>Color</THeadData>
						<THeadData>Category</THeadData>
						<THeadData>Featured</THeadData>
						<THeadData>Date</THeadData>
						<THeadData>Action</THeadData>
					</TRow>
				</THead>
				<TBody>
					{filteredProducts?.map((product) => (
						<TRow key={product._id}>
							<TRowData>{product.title.slice(0, 10)}...</TRowData>
							<TRowData>
								{product.description.slice(0, 40)}...
							</TRowData>
							<TRowData>{product.stock}</TRowData>
							<TRowData>{product.price}</TRowData>
							<TRowData>{product.discount}</TRowData>
							<TRowData>{product.size?.name}</TRowData>
							<TRowData>{product.color?.name}</TRowData>
							<TRowData>{product.category?.name}</TRowData>
							<TRowData>
								{product.featured ? "true" : "false"}
							</TRowData>
							<TRowData>
								{dayjs(
									product?.createdAt?.split("T")[0]
								).format("MMM D, YYYY")}
							</TRowData>
							<TableAction
								onDelete={() => handleActionDelete(product)}
								onEdit={() => handleActionEdit(product)}
							/>
						</TRow>
					))}
				</TBody>
			</Table>
			<div className="w-full flex items-center p-4 justify-end gap-3">
				<Button
					varient="outline"
					size="sm"
					onClick={() => handlePagination("previous")}
					disabled={pageNum === 1}
				>
					Previous
				</Button>
				<span>{pageNum}</span>
				<Button
					varient="outline"
					size="sm"
					onClick={() => handlePagination("next")}
					disabled={
						totalProducts
							? pageNum >=
							  Math.ceil(totalProducts / productsPerPage)
							: true
					}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default Products;
