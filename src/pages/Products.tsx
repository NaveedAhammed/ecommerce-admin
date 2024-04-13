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
import axios from "axios";
import ControlledInput from "../components/ControlledInput";
import Loader from "../components/Loader";
import { correncyFormatter } from "../utils/correncyFormat";
import { errorHandler } from "../utils/errorHandler";
import multiColor from "../assets/multiColor.svg";

const Products = () => {
	const { products, pageNum, productsPerPage, totalProducts } =
		useAppSelector((state) => state.products);
	const [isLoading, setIsLoading] = useState(false);

	const [filterQuery, setFilterQuery] = useState<string>("");

	const filteredProducts = products?.filter((pro) =>
		pro.title.toLowerCase().includes(filterQuery.toLowerCase())
	);

	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	const handleActionEdit = (data: ProductType) => {
		dispatch(setProductEditMode(true));
		dispatch(setProductData(data));
		dispatch(setIsProductModalOpen(true));
	};

	const handleActionDelete = (product: ProductType) => {
		const res = axiosPrivate.delete(`/product/delete/${product._id}`);
		toast.promise(res, {
			loading: `Deleting the product ${product.title}`,
			success: () => {
				dispatch(removeProduct(product._id));
				return "Deleted successfully";
			},
			error: (err) => {
				if (axios.isAxiosError<{ message: string }>(err)) {
					if (!err?.response) {
						return "Something went wrong";
					} else {
						return `${err.response?.data?.message}`;
					}
				}
				return "Unexpected error!";
			},
		});
	};

	const handlePagination = (dir: string) => {
		filterQuery && setFilterQuery("");
		dispatch(setProducts({ products: [] }));
		if (dir === "previous") {
			dispatch(setPageNum(pageNum - 1));
		} else {
			dispatch(setPageNum(pageNum + 1));
		}
	};

	useEffect(() => {
		const fetchProducts = () => {
			setIsLoading(true);
			axiosPrivate
				.get(`/products?page=${pageNum}`)
				.then((res) => {
					dispatch(
						setProducts({
							products: res.data.data.products,
							totalProducts: res.data.data.totalProducts,
						})
					);
				})
				.catch(errorHandler)
				.finally(() => {
					setIsLoading(false);
				});
		};

		products.length === 0 && fetchProducts();
	}, [axiosPrivate, dispatch, pageNum, products]);
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
						<THeadData>Stock</THeadData>
						<THeadData>Price</THeadData>
						<THeadData>Discount</THeadData>
						<THeadData>Unit</THeadData>
						<THeadData>Color</THeadData>
						<THeadData>Category</THeadData>
						<THeadData>Featured</THeadData>
						<THeadData>Date</THeadData>
						<THeadData>Action</THeadData>
					</TRow>
				</THead>
				{isLoading && (
					<tbody className="relative">
						<tr>
							<td className="h-16">
								<Loader
									color="black"
									height="2rem"
									width="2rem"
									className="absolute top-4 left-[50%]"
								/>
							</td>
						</tr>
					</tbody>
				)}
				{filteredProducts?.length > 0 && (
					<TBody>
						{filteredProducts?.map((product) => (
							<TRow key={product._id}>
								<TRowData>
									{product.title.slice(0, 15)}...
								</TRowData>
								<TRowData>
									<div
										className={`w-fit px-2 py-1 text-xs rounded-md flex items-center justify-center  ${
											Number(product.stock) === 0
												? "text-destructive bg-destructive/20"
												: Number(product.stock) > 6
												? "bg-green-600/20 text-green-600"
												: "text-yellow-500 bg-yellow-500/20"
										}`}
									>
										{product.stock},{" "}
										{Number(product.stock) == 0
											? "out of stock"
											: Number(product.stock) > 6
											? "in stock"
											: "few left"}
									</div>
								</TRowData>
								<TRowData>
									{
										correncyFormatter
											.format(Number(product.price))
											.split(".")[0]
									}
								</TRowData>
								<TRowData>{product.discount}%</TRowData>
								<TRowData>
									{product?.unit
										? `${product?.unit?.name}, ${product?.unit.value}`.slice(
												0,
												10
										  ) + "..."
										: "--"}
								</TRowData>
								<TRowData>
									{product?.color ? (
										<div className="flex items-center gap-2">
											<div
												className={`w-6 h-6 rounded-full border`}
												style={{
													backgroundColor: `${product.color.value}`,
												}}
											>
												{product.color.value ===
													"multiColor" && (
													<img
														src={multiColor}
														alt=""
														className="object-fill"
													/>
												)}
											</div>
										</div>
									) : (
										"--"
									)}
								</TRowData>
								<TRowData>
									{product.category
										? `${product.category.parentCategory.name}, ${product.category.name}`
										: "--"}
								</TRowData>
								<TRowData>
									<div
										className={`w-fit px-2 py-1 text-xs rounded-md flex items-center justify-center  ${
											product.featured === true
												? "bg-green-600/20 text-green-600"
												: "text-blue bg-blue/20"
										}`}
									>
										{product.featured ? "true" : "false"}
									</div>
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
				)}
			</Table>
			<div className="w-full flex items-center p-4 justify-end gap-3">
				<Button
					varient="outline"
					size="sm"
					onClick={() => handlePagination("previous")}
					disabled={pageNum === 1 || isLoading}
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
							: isLoading
					}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default Products;
