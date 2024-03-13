import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Label from "../components/Label";
import Modal from "../components/Modal";
import { ManageColorContextType } from "../context/ManageColorContext";
import { useManageColorContext } from "../hooks/useManageColorContext";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Message from "../components/Message";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ErrorBar from "../components/ErrorBar";
import { updateColor } from "../redux/slices/colorSlice";
import { useAppDispatch } from "../redux/store";

const ManageColorModal = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasNameFocused, setHasNameFocused] = useState<boolean>(false);
  const [hasNameBlured, setHasNameBlured] = useState<boolean>(false);
  const [hasValueFocused, setHasValueFocused] = useState<boolean>(false);
  const [hasValueBlured, setHasValueBlured] = useState<boolean>(false);
  const { isOpen, onClose, data, editMode } =
    useManageColorContext() as ManageColorContextType;

  const firstInputRef = useRef<HTMLInputElement>(null);
  const errorBarRef = useRef<HTMLParagraphElement>(null);

  const axiosPrivate = useAxiosPrivate();

  const dispatch = useAppDispatch();

  const resetState = () => {
    setHasNameBlured(false);
    setHasNameFocused(false);
    setHasValueBlured(false);
    setHasValueFocused(false);
  };

  const handleCancel = () => {
    onClose();
    resetState();
  };

  const handleCreateColor = async (formData: FormData) => {
    const res = (await axiosPrivate.post("/color/new", formData)).data;
    return res;
  };

  const handleUpdateColor = async (formData: FormData) => {
    const res = (await axiosPrivate.put(`/color/update/${data._id}`, formData))
      .data;
    dispatch(updateColor(res.data.color));
    return res;
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    const isValid = formElement.checkValidity();
    const firstInvalidField = formElement.querySelector(
      ":invalid"
    ) as HTMLInputElement;
    firstInvalidField?.focus();
    if (isValid) {
      const formData = new FormData(formElement);
      try {
        setIsLoading(true);
        let res;
        if (editMode) {
          res = await handleUpdateColor(formData);
        } else {
          res = await handleCreateColor(formData);
        }
        console.log(res);
        if (!res.success) {
          return toast.error("Color creation failed, Please try again");
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
      className="grid grid-cols-2 gap-6"
      noValidate
      onSubmit={handleOnSubmit}
    >
      <ErrorBar className="col-span-2" innerRef={errorBarRef}>
        This is an error message
      </ErrorBar>
      <div className="flex flex-col gap-1">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          defaultValue={data.name}
          autoComplete="off"
          name="name"
          type="text"
          innerRef={firstInputRef}
          disabled={isLoading}
          onBlur={() => setHasNameBlured(true)}
          onFocus={() => setHasNameFocused(true)}
          className="peer"
          required={true}
        />
        {hasNameFocused && hasNameBlured && (
          <Message error={true} className="hidden peer-invalid:block">
            Color name is required
          </Message>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="value">Value</Label>
        <Input
          id="value"
          defaultValue={data.value}
          autoComplete="off"
          name="value"
          type="text"
          disabled={isLoading}
          onBlur={() => setHasValueBlured(true)}
          onFocus={() => setHasValueFocused(true)}
          className="peer"
          required={true}
        />
        {hasValueFocused && hasValueBlured && (
          <Message error={true} className="hidden peer-invalid:block">
            Color value is required
          </Message>
        )}
      </div>
      <div className="flex gap-2 items-center justify-end col-span-2">
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
            {isLoading && <Loader width="1rem" height="1rem" color="white" />}
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
            {isLoading && <Loader width="1rem" height="1rem" color="white" />}
            {isLoading ? "Updating..." : "Update"}
          </Button>
        )}
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
      title="Create Color"
      description="Create a new color for your products"
    />
  );
};

export default ManageColorModal;
