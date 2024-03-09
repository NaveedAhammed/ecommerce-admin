import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Label from "../components/Label";
import Modal from "../components/Modal";
import { ManageCategoryContextType } from "../context/ManageCategoryContext";
import { useManageCategoryContext } from "../hooks/useManageCategoryContext";
import ErrorBar from "../components/ErrorBar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import Message from "../components/Message";
import Loader from "../components/Loader";

const ManageCategoryModal = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasNameFocused, setHasNameFocused] = useState<boolean>(false);
  const [hasNameBlured, setHasNameBlured] = useState<boolean>(false);
  const { isOpen, onClose, data } =
    useManageCategoryContext() as ManageCategoryContextType;

  const axiosPrivate = useAxiosPrivate();

  const firstInputRef = useRef<HTMLInputElement>(null);
  const errorBarRef = useRef<HTMLParagraphElement>(null);

  const resetState = () => {
    setHasNameBlured(false);
    setHasNameFocused(false);
  };

  const handleCancel = () => {
    onClose();
    resetState();
  };

  const handleShowError = (msg: string) => {
    if (errorBarRef.current) {
      errorBarRef.current.innerText = msg;
      errorBarRef.current.style.display = "block";
    }
    setTimeout(() => {
      if (errorBarRef.current) {
        errorBarRef.current.style.display = "none";
      }
    }, 4000);
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
        const res = (await axiosPrivate.post("/category/new", formData)).data;
        console.log(res);
        if (!res.success) {
          return handleShowError("Category creation failed, Please try again");
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
          return handleShowError("Something went wrong");
        } else {
          return handleShowError(`${error.response?.data?.message}`);
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
      <div className="flex flex-col col-span-2 gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          defaultValue={data.name}
          autoComplete="off"
          name="name"
          type="text"
          innerRef={firstInputRef}
          required={true}
          className="peer w-[24rem]"
          onBlur={() => setHasNameBlured(true)}
          onFocus={() => setHasNameFocused(true)}
        />
        {hasNameFocused && hasNameBlured && (
          <Message error={true} className="hidden peer-invalid:block">
            Category name is required
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
      title="Create Category"
      description="Create a new category for you products"
    />
  );
};

export default ManageCategoryModal;
