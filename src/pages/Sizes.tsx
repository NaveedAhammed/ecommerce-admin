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
import { ManageSizeContextType, SizeType } from "../context/ManageSizeContext";
import { useManageSizeContext } from "../hooks/useManageSizeContext";

const sizes = [
  {
    name: "Small",
    value: "S",
    createdAt: "21st May, 2019",
  },
  {
    name: "Large",
    value: "L",
    createdAt: "12th Mar, 2023",
  },
];

const Sizes = () => {
  const { onOpen, setData } = useManageSizeContext() as ManageSizeContextType;

  const handleActionEdit = (data: SizeType) => {
    setData(data);
    onOpen();
  };

  const handleActionDelete = () => {};
  return (
    <div className="w-full h-full">
      <Heading
        title="Sizes"
        description="Manage sizes for your products"
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
            <THeadData>Name</THeadData>
            <THeadData>Value</THeadData>
            <THeadData>Date</THeadData>
            <THeadData>Action</THeadData>
          </TRow>
        </THead>
        <TBody>
          {sizes.map((size, i) => (
            <TRow key={i}>
              <TRowData>{size.name}</TRowData>
              <TRowData>{size.value}</TRowData>
              <TRowData>{size.createdAt}</TRowData>
              <TableAction
                onDelete={handleActionDelete}
                onEdit={() => handleActionEdit(size)}
              />
            </TRow>
          ))}
        </TBody>
      </Table>
    </div>
  );
};

export default Sizes;
