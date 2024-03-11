import { useEffect } from "react";
import Heading from "../components/Heading";
import Input from "../components/Input";
import Table, {
  TBody,
  THead,
  THeadData,
  TRow,
  TRowData,
} from "../components/Table";
import TableAction from "../components/TableAction";
import {
  ManageProductContextType,
  ProductType,
} from "../context/ManageProductContext";
import { useManageProductContext } from "../hooks/useManageProductContext";
import { useAppDispatch, useAppSelector } from "../redux/store";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { setPageNum, setProducts } from "../redux/slices/productSlice";
import dayjs from "dayjs";
import Button from "../components/Button";

const Products = () => {
  const { onOpen, setData } =
    useManageProductContext() as ManageProductContextType;

  const axiosPrivate = useAxiosPrivate();

  const dispatch = useAppDispatch();
  const { products, pageNum } = useAppSelector((state) => state.products);

  const handleActionEdit = (data: ProductType) => {
    setData(data);
    onOpen();
  };

  const handleActionDelete = () => {};

  const handlePagination = (dir: string) => {
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
        const res = (await axiosPrivate.get(`/products?page=${pageNum}`)).data;
        dispatch(setProducts(res.data.products));
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
        action={onOpen}
        actionLabel="Add New"
      />
      <Input
        autoComplete="off"
        name="searchQuery"
        type="text"
        placeholder="Search"
        className="mb-4 w-[30rem]"
        id="searchQuery"
      />
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
          {products?.map((product) => (
            <TRow key={product._id}>
              <TRowData>{product.title.slice(0, 10)}...</TRowData>
              <TRowData>{product.description.slice(0, 40)}...</TRowData>
              <TRowData>{product.stock}</TRowData>
              <TRowData>{product.price}</TRowData>
              <TRowData>{product.discount}</TRowData>
              <TRowData>{product.size?.name}</TRowData>
              <TRowData>{product.color?.name}</TRowData>
              <TRowData>{product.category?.name}</TRowData>
              <TRowData>{product.featured ? "true" : "false"}</TRowData>
              <TRowData>
                {dayjs(product?.createdAt?.split("T")[0]).format("MMM D, YYYY")}
              </TRowData>
              <TableAction
                onDelete={handleActionDelete}
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
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Products;
