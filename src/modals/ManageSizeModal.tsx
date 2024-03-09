import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Label from "../components/Label";
import Modal from "../components/Modal";
import { ManageSizeContextType } from "../context/ManageSizeContext";
import { useManageSizeContext } from "../hooks/useManageSizeContext";
import Message from "../components/Message";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const ManageSizeModal = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasNameFocused, setHasNameFocused] = useState<boolean>(false);
  const [hasNameBlured, setHasNameBlured] = useState<boolean>(false);
  const [hasValueFocused, setHasValueFocused] = useState<boolean>(false);
  const [hasValueBlured, setHasValueBlured] = useState<boolean>(false);
  const { isOpen, onClose, data } =
    useManageSizeContext() as ManageSizeContextType;

  const axiosPrivate = useAxiosPrivate();

  const firstInputRef = useRef<HTMLInputElement>(null);

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
        const res = (await axiosPrivate.post("/size/new", formData)).data;
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
      className="grid grid-cols-2 gap-6"
      onSubmit={handleOnSubmit}
      noValidate
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          defaultValue={data.name}
          autoComplete="off"
          name="name"
          type="text"
          required={true}
          onBlur={() => setHasNameBlured(true)}
          onFocus={() => setHasNameFocused(true)}
          innerRef={firstInputRef}
          disabled={isLoading}
          className="peer"
        />
        {hasNameFocused && hasNameBlured && (
          <Message error={true} className="hidden peer-invalid:block">
            Size name is required
          </Message>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="value">Value</Label>
        <Input
          id="value"
          defaultValue={data.value}
          autoComplete="off"
          name="value"
          type="text"
          disabled={isLoading}
          required={true}
          onBlur={() => setHasValueBlured(true)}
          onFocus={() => setHasValueFocused(true)}
          className="peer"
        />
        {hasValueFocused && hasValueBlured && (
          <Message error={true} className="hidden peer-invalid:block">
            Size value is required
          </Message>
        )}
      </div>
      <div className="flex gap-2 items-center justify-end col-span-2">
        <Button onClick={handleCancel} size="default" varient="outline">
          Cancel
        </Button>
        <Button
          type="submit"
          size="default"
          varient="default"
          className="gap-2"
        >
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
      title="Create Size"
      description="Create a new size for your products"
    />
  );
};

export default ManageSizeModal;
