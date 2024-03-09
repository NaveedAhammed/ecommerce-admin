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

const products = [
  {
    title: "White Shirt",
    description: "A good shirt to ware on weddings",
    price: 250,
    stock: 10,
    featured: true,
    discount: 61,
    category: "Men",
    size: "Large",
    color: "White",
    createdAt: "1st Mar, 2022",
    images: [],
  },
];

const Products = () => {
  const { onOpen, setData } =
    useManageProductContext() as ManageProductContextType;

  const handleActionEdit = (data: ProductType) => {
    setData(data);
    onOpen();
  };

  const handleActionDelete = () => {};
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
          {products.map((product, i) => (
            <TRow key={i}>
              <TRowData>{product.title}</TRowData>
              <TRowData>{product.description}</TRowData>
              <TRowData>{product.stock}</TRowData>
              <TRowData>{product.price}</TRowData>
              <TRowData>{product.discount}</TRowData>
              <TRowData>{product.size}</TRowData>
              <TRowData>{product.color}</TRowData>
              <TRowData>{product.category}</TRowData>
              <TRowData>{product.featured ? "true" : "false"}</TRowData>
              <TRowData>{product.createdAt}</TRowData>
              <TableAction
                onDelete={handleActionDelete}
                onEdit={() => handleActionEdit(product)}
              />
            </TRow>
          ))}
        </TBody>
      </Table>
    </div>
  );
};

export default Products;
