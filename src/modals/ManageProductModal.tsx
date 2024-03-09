import Button from "../components/Button";
import Input from "../components/Input";
import Label from "../components/Label";
import Modal from "../components/Modal";
import Select from "../components/Select";
import { ManageProductContextType } from "../context/ManageProductContext";
import { useManageProductContext } from "../hooks/useManageProductContext";
import { MdDeleteOutline } from "react-icons/md";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Message from "../components/Message";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { AxiosError } from "axios";
import Loader from "../components/Loader";

type StateType = {
  title: boolean;
  description: boolean;
  price: boolean;
  stock: boolean;
  category: boolean;
  color: boolean;
  size: boolean;
};

const ManageProductModal = () => {
  const [images, setImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasInputFocused, setHasInputFocused] = useState<StateType>({
    title: false,
    description: false,
    price: false,
    stock: false,
    category: false,
    color: false,
    size: false,
  });
  const [hasInputBlured, setHasInputBlured] = useState<StateType>({
    title: false,
    description: false,
    price: false,
    stock: false,
    category: false,
    color: false,
    size: false,
  });
  const { isOpen, onClose, data, editMode, setEditMode } =
    useManageProductContext() as ManageProductContextType;

  const axiosPrivate = useAxiosPrivate();

  const firstInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBrowseClick = () => {
    inputRef?.current?.click();
  };

  const handleImagesSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    const files: FileList | null = e.target.files;
    console.log(files);
    if (files?.length && files.length > 0) {
      for (let i = 0; i < files?.length; i++) {
        if (!images.some((img) => img.name === files[i].name)) {
          setImages((prevImages) => [...prevImages, files[i]]);
        }
      }
    }
  };

  const resetState = () => {
    setHasInputBlured({
      title: false,
      description: false,
      price: false,
      category: false,
      color: false,
      size: false,
      stock: false,
    });
    setHasInputFocused({
      title: false,
      description: false,
      price: false,
      category: false,
      color: false,
      size: false,
      stock: false,
    });
  };

  const handleCancel = () => {
    onClose();
    setEditMode(false);
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

  const handleDeleteImage = (index: number): void => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    const isValid = formElement.checkValidity();
    console.log(isValid);
    if (!editMode && images.length === 0) {
      return toast.error("Atleast one product image is required");
    }
    const firstInvalidField = formElement.querySelector(
      ":invalid"
    ) as HTMLInputElement;
    firstInvalidField?.focus();
    const formData = new FormData(formElement);
    console.log(formData.get("images"));
    if (isValid) {
      const formData = new FormData(formElement);
      console.log(formData.get("images"));
      try {
        setIsLoading(true);
        const res = (
          await axiosPrivate.post("/product/new", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        ).data;
        console.log(res);
        if (!res.success) {
          return toast.error("Size creation failed, Please try again");
        }
        if (res.success) {
          onClose();
          resetState();
          return toast.success(res.message);
        }
      } catch (err: unknown) {
        console.log(err);
        const error = err as AxiosError;
        console.log(error);
        if (!error?.response) {
          return toast.error("Something went wrong");
        } else {
          return toast.error(`${error.response?.data?.message}`);
        }
      } finally {
        setIsLoading(false);
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
          defaultValue={data.title}
          autoComplete="off"
          name="title"
          type="text"
          required={true}
          className="peer"
          innerRef={firstInputRef}
          onBlur={() => setHasInputBlured((prev) => ({ ...prev, title: true }))}
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
          defaultValue={data.price}
          name="price"
          required={true}
          className="peer"
          type="number"
          onBlur={() => setHasInputBlured((prev) => ({ ...prev, price: true }))}
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
          defaultValue={data.stock}
          autoComplete="off"
          name="stock"
          type="number"
          required={true}
          className="peer"
          onBlur={() => setHasInputBlured((prev) => ({ ...prev, stock: true }))}
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
        <Label htmlFor="category">Category</Label>
        <Select
          name="category"
          id="category"
          options={["Men", "Women", "Kid", "65e754780339e0426673b576"]}
          defaultValue={data.category}
          required={true}
          className="peer"
          onBlur={() =>
            setHasInputBlured((prev) => ({ ...prev, category: true }))
          }
          onFocus={() =>
            setHasInputFocused((prev) => ({ ...prev, category: true }))
          }
        />
        {hasInputFocused.category && hasInputBlured.category && (
          <Message error={true} className="hidden peer-invalid:block">
            Product category is required
          </Message>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="color">Color</Label>
        <Select
          name="color"
          id="color"
          options={[
            "Red",
            "Blue",
            "Green",
            "White",
            "65e74713e25f718544f21521",
          ]}
          defaultValue={data.color}
          required={true}
          className="peer"
          onBlur={() => setHasInputBlured((prev) => ({ ...prev, color: true }))}
          onFocus={() =>
            setHasInputFocused((prev) => ({ ...prev, color: true }))
          }
        />
        {hasInputFocused.color && hasInputBlured.color && (
          <Message error={true} className="hidden peer-invalid:block">
            Product color is required
          </Message>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="size">Size</Label>
        <Select
          name="size"
          id="size"
          options={[
            "Extra Small",
            "Small",
            "Medium",
            "Large",
            "65e7416db865943988a42ead",
          ]}
          defaultValue={data.size}
          className="peer"
          required={true}
          onBlur={() => setHasInputBlured((prev) => ({ ...prev, size: true }))}
          onFocus={() =>
            setHasInputFocused((prev) => ({ ...prev, size: true }))
          }
        />
        {hasInputFocused.size && hasInputBlured.size && (
          <Message error={true} className="hidden peer-invalid:block">
            Product size is required
          </Message>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="stock">Discount</Label>
        <Input
          id="discount"
          defaultValue={data.discount}
          autoComplete="off"
          name="discount"
          type="number"
        />
      </div>
      <div
        className={`flex flex-col col-span-1 ${
          editMode ? "row-span-1" : "row-span-2"
        } row-span-2 gap-4`}
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
                className="w-full h-auto object-contain"
              />
              <MdDeleteOutline
                onClick={() => handleDeleteImage(i)}
                className="w-full h-full bg-black/40 p-2 cursor-pointer absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-destructive z-20 hidden group-hover:block"
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
          ref={inputRef}
        />
        <div className="w-full py-2 flex-1 bg-slate-100 text-[12px] mt-auto px-4 rounded-md border-dashed border border-black flex justify-center items-center">
          <span className="text-black mr-2">{`${
            isDragging ? "Drop images here" : "Drag & Drop images or"
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
      {/* <div className="flex flex-col gap-1">
        <Label htmlFor="size">Old images</Label>
        <div className="flex items-center gap-1 py-2">
          <div className="w-10 h-12 relative rounded-md overflow-hidden group border">
            <img src={image} alt="" className="w-full h-auto object-contain" />
            <MdDeleteOutline
              onClick={() => console.log("Hello")}
              className="w-full h-full bg-black/40 p-2 cursor-pointer absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-destructive z-20 hidden group-hover:block"
            />
          </div>
          <div className="w-10 h-12 relative rounded-md overflow-hidden group border">
            <img src={image} alt="" className="w-full h-auto object-contain" />
            <MdDeleteOutline
              onClick={() => console.log("Hello")}
              className="w-full h-full bg-black/40 p-2 cursor-pointer absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-destructive z-20 hidden group-hover:block"
            />
          </div>
        </div>
      </div> */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="description">Descroption</Label>
        <textarea
          name="description"
          id="description"
          rows={5}
          required={true}
          defaultValue={data.description}
          onBlur={() =>
            setHasInputBlured((prev) => ({ ...prev, description: true }))
          }
          onFocus={() =>
            setHasInputFocused((prev) => ({ ...prev, description: true }))
          }
          className="flex peer resize-none w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-mutedForeground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        ></textarea>
        {hasInputFocused.description && hasInputBlured.description && (
          <Message error={true} className="hidden peer-invalid:block">
            Product description is required
          </Message>
        )}
      </div>
      <div className="flex gap-4 items-start">
        <input
          type="checkbox"
          name="featured"
          id="featured"
          className="mt-2 cursor-pointer"
          defaultChecked={data.featured}
        />
        <Label htmlFor="featured">
          Featured <br />
          <span className="text-xs">
            This product will be displayed in featured section
          </span>
        </Label>
      </div>
      <div className="flex gap-2 items-center justify-end col-span-3">
        <Button onClick={handleCancel} size="default" varient="outline">
          Cancel
        </Button>
        <Button size="default" varient="default" type="submit">
          {isLoading && <Loader width="1rem" height="1rem" color="white" />}
          Create
        </Button>
      </div>
    </form>
  );

  useEffect(() => {
    firstInputRef.current && firstInputRef.current.focus();
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      body={body}
      title="Create Product"
      description="Create a new product"
    />
  );
};

export default ManageProductModal;
