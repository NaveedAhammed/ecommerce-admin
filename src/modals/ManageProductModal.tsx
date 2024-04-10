import Button from "../components/Button";
import Input from "../components/Input";
import Label from "../components/Label";
import Modal from "../components/Modal";
import Select from "../components/Select";
import { MdDeleteOutline } from "react-icons/md";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Message from "../components/Message";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "axios";
import Loader from "../components/Loader";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
	addNewProduct,
	removeProductImage,
	setIsProductModalOpen,
	setProductData,
	setProductEditMode,
	setTotalProducts,
	updateProduct,
} from "../redux/slices/productSlice";
import ControlledSelect from "../components/ControlledSelect";
import { errorHandler } from "../utils/errorHandler";

type InputFieldsState = {
	title: boolean;
	description: boolean;
	brand: boolean;
	price: boolean;
	stock: boolean;
	parentCategory: boolean;
	childCategory: boolean;
};

const defaultState: InputFieldsState = {
	title: false,
	description: false,
	brand: false,
	price: false,
	stock: false,
	parentCategory: false,
	childCategory: false,
};

const ManageProductModal = () => {
	const [images, setImages] = useState<File[]>([]);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [parentCat, setParentCat] = useState("");
	const [hasInputFocused, setHasInputFocused] =
		useState<InputFieldsState>(defaultState);
	const [hasInputBlured, setHasInputBlured] =
		useState<InputFieldsState>(defaultState);
	const dispatch = useAppDispatch();
	const { colors } = useAppSelector((state) => state.colors);
	const { units } = useAppSelector((state) => state.units);
	const { parentCategories } = useAppSelector(
		(state) => state.parentCategories
	);
	const { childCategories } = useAppSelector(
		(state) => state.childCategories
	);

	const filteredChildCategories = childCategories?.filter((childCategory) =>
		childCategory.parentCategory._id.includes(parentCat)
	);

	const { isProductModalOpen, productData, editMode, products } =
		useAppSelector((state) => state.products);

	const axiosPrivate = useAxiosPrivate();

	const firstInputRef = useRef<HTMLInputElement>(null);
	const browserBtnRef = useRef<HTMLInputElement>(null);

	const handleBrowseClick = () => {
		browserBtnRef?.current?.click();
	};

	const handleImagesSelect = (e: ChangeEvent<HTMLInputElement>): void => {
		const files: FileList | null = e.target.files;
		if (files?.length && files.length > 0) {
			for (let i = 0; i < files?.length; i++) {
				if (!images.some((img) => img.name === files[i].name)) {
					setImages((prevImages) => [...prevImages, files[i]]);
				}
			}
		}
	};

	const resetState = () => {
		setHasInputBlured(defaultState);
		setHasInputFocused(defaultState);
		setParentCat("");
		setImages([]);
	};

	const handleCancel = () => {
		dispatch(setIsProductModalOpen(false));
		dispatch(setProductData(null));
		dispatch(setProductEditMode(false));
		setParentCat("");
		setImages([]);
		resetState();
	};

	const handleOnDragOver = (e: DragEvent<HTMLDivElement>): void => {
		e.preventDefault();
		setIsDragging(true);
		e.dataTransfer.dropEffect = "copy";
	};

	const handleOnDragLeave = (e: DragEvent<HTMLDivElement>): void => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleOnDrop = (e: DragEvent<HTMLDivElement>): void => {
		e.preventDefault();
		setIsDragging(false);
		const files: FileList = e.dataTransfer.files;
		if (files?.length && files.length > 0) {
			for (let i = 0; i < files?.length; i++) {
				if (!images.some((img) => img.name === files[i].name)) {
					setImages((prevImages) => [...prevImages, files[i]]);
				}
			}
		}
	};

	const handleDeletePrevImage = (index: number): void => {
		setImages((prevImages) => prevImages.filter((_, i) => i !== index));
	};

	const handleDeleteServerImage = async (imageId: string) => {
		const res = axiosPrivate.delete(
			`/product/image/delete/${productData?._id}?imageId=${imageId}`
		);
		toast.promise(res, {
			loading: "Deleting the image...",
			success: (res) => {
				dispatch(
					removeProductImage({ imageId, productId: productData?._id })
				);
				return res.data.message;
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

	const handleCreateProduct = (formData: FormData) => {
		setIsLoading(true);
		axiosPrivate
			.post("/product/new", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((res) => {
				if (!res.data.success) {
					return toast.error(
						"Product creation failed, Please try again"
					);
				}

				products.length < 5 &&
					dispatch(addNewProduct(res.data.data.product));
				dispatch(setTotalProducts(res.data.data.totalProducts));
				dispatch(setIsProductModalOpen(false));
				resetState();
				return toast.success(res.data.message);
			})
			.catch(errorHandler)
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleUpdateProduct = (formData: FormData) => {
		setIsLoading(true);
		axiosPrivate
			.put(`/product/update/${productData?._id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((res) => {
				if (!res.data.success) {
					return toast.error(
						"Product updation failed, Please try again"
					);
				}
				dispatch(
					updateProduct({
						product: res.data.data.product,
						totalProducts: res.data.data.totalProducts,
					})
				);
				dispatch(setProductData(null));
				dispatch(setProductEditMode(false));
				dispatch(setIsProductModalOpen(false));
				resetState();
				return toast.success(res.data.message);
			})
			.catch(errorHandler)
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formElement = e.target as HTMLFormElement;
		const isValid = formElement.checkValidity();
		if (!editMode && images.length === 0) {
			return toast.error("Atleast one product image is required");
		}
		const firstInvalidField = formElement.querySelector(
			":invalid"
		) as HTMLInputElement;
		firstInvalidField?.focus();
		if (isValid) {
			const formData = new FormData(formElement);
			if (editMode) {
				handleUpdateProduct(formData);
			} else {
				handleCreateProduct(formData);
			}
		}
	};

	const body: React.ReactNode = (
		<form
			className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
			noValidate
			onSubmit={handleOnSubmit}
		>
			<div className="flex flex-col gap-1 col-span-2">
				<Label htmlFor="title">Title</Label>
				<Input
					id="title"
					defaultValue={productData?.title}
					autoComplete="off"
					name="title"
					type="text"
					required={true}
					className="peer"
					innerRef={firstInputRef}
					onBlur={() =>
						setHasInputBlured((prev) => ({ ...prev, title: true }))
					}
					onFocus={() =>
						setHasInputFocused((prev) => ({ ...prev, title: true }))
					}
				/>
				{hasInputFocused.title && hasInputBlured.title && (
					<Message error={true} className="hidden peer-invalid:block">
						Product title is required
					</Message>
				)}
			</div>
			<div className="flex flex-col gap-1">
				<Label htmlFor="price">Price</Label>
				<Input
					id="price"
					autoComplete="off"
					defaultValue={productData?.price}
					name="price"
					required={true}
					className="peer"
					type="number"
					onBlur={() =>
						setHasInputBlured((prev) => ({ ...prev, price: true }))
					}
					onFocus={() =>
						setHasInputFocused((prev) => ({ ...prev, price: true }))
					}
				/>
				{hasInputFocused.price && hasInputBlured.price && (
					<Message error={true} className="hidden peer-invalid:block">
						Product price is required
					</Message>
				)}
			</div>
			<div className="flex flex-col gap-1">
				<Label htmlFor="stock">Stock</Label>
				<Input
					id="stock"
					defaultValue={productData?.stock}
					autoComplete="off"
					name="stock"
					type="number"
					required={true}
					className="peer"
					onBlur={() =>
						setHasInputBlured((prev) => ({ ...prev, stock: true }))
					}
					onFocus={() =>
						setHasInputFocused((prev) => ({ ...prev, stock: true }))
					}
				/>
				{hasInputFocused.stock && hasInputBlured.stock && (
					<Message error={true} className="hidden peer-invalid:block">
						Product stock is required
					</Message>
				)}
			</div>
			<div className="flex flex-col gap-1">
				<Label htmlFor="parentCategoryId">Parent Category</Label>
				<ControlledSelect
					name="parentCategoryId"
					id="parentCategoryId"
					options={parentCategories?.map((parentCategory) => ({
						id: parentCategory?._id,
						name: parentCategory?.name,
					}))}
					required={true}
					className="peer"
					onBlur={() =>
						setHasInputBlured((prev) => ({
							...prev,
							parentCategory: true,
						}))
					}
					onFocus={() =>
						setHasInputFocused((prev) => ({
							...prev,
							parentCategory: true,
						}))
					}
					value={
						productData?.category?.parentCategory._id || parentCat
					}
					onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
						setParentCat(e.target.value)
					}
				/>
				{hasInputFocused.parentCategory &&
					hasInputBlured.parentCategory && (
						<Message
							error={true}
							className="hidden peer-invalid:block"
						>
							Parent category is required
						</Message>
					)}
			</div>
			<div className="flex flex-col gap-1">
				<Label htmlFor="childCategoryId">Child Category</Label>
				<Select
					name="childCategoryId"
					id="childCategoryId"
					options={filteredChildCategories?.map((childCategory) => ({
						id: childCategory?._id,
						name: childCategory?.name,
					}))}
					defaultValue={productData?.category?._id}
					required={true}
					className="peer"
					onBlur={() =>
						setHasInputBlured((prev) => ({
							...prev,
							childCategory: true,
						}))
					}
					onFocus={() =>
						setHasInputFocused((prev) => ({
							...prev,
							childCategory: true,
						}))
					}
				/>
				{hasInputFocused.childCategory &&
					hasInputBlured.childCategory && (
						<Message
							error={true}
							className="hidden peer-invalid:block"
						>
							Child category is required
						</Message>
					)}
			</div>
			<div className="flex flex-col gap-1">
				<Label htmlFor="color">Color</Label>
				<Select
					name="colorId"
					id="colorId"
					options={colors?.map((color) => ({
						id: color?._id,
						name: color?.name,
					}))}
					defaultValue={productData?.color?._id}
				/>
			</div>
			<div className="flex flex-col gap-1">
				<Label htmlFor="unit">Unit</Label>
				<Select
					name="unitId"
					id="unitId"
					options={units?.map((unit) => ({
						id: unit?._id,
						name: `${unit?.name}, ${unit?.value}`,
					}))}
					defaultValue={productData?.unit?._id}
					className="peer"
				/>
			</div>
			<div className="flex flex-col gap-1">
				<Label htmlFor="discount">Discount</Label>
				<Input
					id="discount"
					defaultValue={productData?.discount}
					autoComplete="off"
					name="discount"
					type="number"
				/>
			</div>
			{editMode && (
				<div className="flex flex-col gap-1">
					<Label htmlFor="oldImages">Old images</Label>
					<div className="flex items-center gap-1 py-2">
						{productData?.images?.map((img) => (
							<div
								className="w-10 h-12 relative rounded-md overflow-hidden group border"
								key={img?._id}
							>
								<img
									src={img?.url}
									alt=""
									className="w-full h-full object-cover"
								/>
								<MdDeleteOutline
									onClick={() =>
										handleDeleteServerImage(img?._id)
									}
									className="w-full h-full bg-black/40 p-2 cursor-pointer absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-destructive z-20 hidden group-hover:block"
								/>
							</div>
						))}
					</div>
				</div>
			)}
			<div className="flex flex-col gap-1">
				<Label htmlFor="description">Descroption</Label>
				<textarea
					name="description"
					id="description"
					rows={5}
					required={true}
					defaultValue={productData?.description}
					onBlur={() =>
						setHasInputBlured((prev) => ({
							...prev,
							description: true,
						}))
					}
					onFocus={() =>
						setHasInputFocused((prev) => ({
							...prev,
							description: true,
						}))
					}
					className="flex peer resize-none w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-mutedForeground transition duration-300 focus:shadow-inputFocus hover:shadow-inputHover focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				></textarea>
				{hasInputFocused.description && hasInputBlured.description && (
					<Message error={true} className="hidden peer-invalid:block">
						Product description is required
					</Message>
				)}
			</div>
			<div className="flex flex-col gap-2">
				<div className="flex flex-col gap-1">
					<Label htmlFor="brand">Brand</Label>
					<Input
						id="brand"
						autoComplete="off"
						defaultValue={productData?.brand}
						name="brand"
						required={true}
						className="peer"
						type="text"
						onBlur={() =>
							setHasInputBlured((prev) => ({
								...prev,
								brand: true,
							}))
						}
						onFocus={() =>
							setHasInputFocused((prev) => ({
								...prev,
								brand: true,
							}))
						}
					/>
					{hasInputFocused.brand && hasInputBlured.brand && (
						<Message
							error={true}
							className="hidden peer-invalid:block"
						>
							Product brand is required
						</Message>
					)}
				</div>
				<div className="flex gap-4 items-start">
					<input
						type="checkbox"
						name="featured"
						id="featured"
						className="cursor-pointer"
						defaultChecked={productData?.featured}
					/>
					<Label htmlFor="featured">
						Featured <br />
						<span className="text-xs">
							This product will be displayed in featured section
						</span>
					</Label>
				</div>
			</div>
			<div
				className={`flex flex-col col-span-1 ${
					editMode ? "row-span-1" : "row-span-2"
				} gap-4`}
				onDragOver={handleOnDragOver}
				onDragLeave={handleOnDragLeave}
				onDrop={handleOnDrop}
			>
				<div className="flex mt-6 gap-1 items-center flex-wrap">
					{images.map((img, i) => (
						<div
							key={i}
							className={`${
								editMode ? "w-10" : "w-14"
							} relative rounded-md h-auto overflow-hidden group border`}
						>
							<img
								src={URL.createObjectURL(img)}
								alt=""
								className="w-full h-16 object-contain"
							/>
							<MdDeleteOutline
								onClick={() => handleDeletePrevImage(i)}
								className="w-full h-full p-2 bg-black/40 cursor-pointer absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-destructive z-20 hidden group-hover:block"
							/>
						</div>
					))}
				</div>
				<input
					onChange={handleImagesSelect}
					multiple
					type="file"
					name="images"
					id="images"
					className="hidden"
					accept="image/*"
					ref={browserBtnRef}
				/>
				<div className="w-full py-2 flex-1 bg-slate-100 text-[12px] mt-auto px-4 rounded-md border-dashed border border-black flex justify-center items-center">
					<span className="text-black mr-2">{`${
						isDragging
							? "Drop images here"
							: "Drag & Drop images or"
					}`}</span>
					<span
						className={`text-blue-600 cursor-pointer ${
							isDragging ? "hidden" : ""
						}`}
						onClick={handleBrowseClick}
					>
						Browse
					</span>
				</div>
			</div>
			<div className="flex gap-2 items-center justify-end col-span-3">
				<Button onClick={handleCancel} size="default" varient="outline">
					Cancel
				</Button>
				{!editMode && (
					<Button
						size="default"
						varient="default"
						type="submit"
						className="gap-2"
					>
						{isLoading && (
							<Loader width="1rem" height="1rem" color="white" />
						)}
						{isLoading ? "Creating..." : "Create"}
					</Button>
				)}
				{editMode && (
					<Button
						size="default"
						varient="default"
						type="submit"
						className="gap-2"
					>
						{isLoading && (
							<Loader width="1rem" height="1rem" color="white" />
						)}
						{isLoading ? "Updating..." : "Update"}
					</Button>
				)}
			</div>
		</form>
	);

	useEffect(() => {
		firstInputRef.current && firstInputRef.current.focus();
	}, [isProductModalOpen]);

	return (
		<Modal
			isOpen={isProductModalOpen}
			onClose={() => dispatch(setIsProductModalOpen(false))}
			body={body}
			title={`${editMode ? "Edit Product" : "Create Product"}`}
			description={`${
				editMode ? "Edit the product" : "Create a new product"
			}`}
		/>
	);
};

export default ManageProductModal;
