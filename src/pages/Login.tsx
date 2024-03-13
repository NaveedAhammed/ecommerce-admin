import { useEffect, useRef, useState } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";

import Button from "../components/Button";
import Input from "../components/Input";
import Label from "../components/Label";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { privateAxios } from "../utils/axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import useAdminContext from "../hooks/useAdminContext";
import { AdminContextType } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { AdminType } from "../types";

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasUsernameOrEmailFocused, setHasUsernameOrEmailFocused] =
    useState<boolean>(false);
  const [hasUsernameOrEmailBlured, setHasUsernameOrEmailBlured] =
    useState<boolean>(false);
  const [hasPasswordFocused, setHasPasswordFocused] = useState<boolean>(false);
  const [hasPasswordBlured, setHasPasswordBlured] = useState<boolean>(false);

  const usernameOrEmailRef = useRef<HTMLInputElement>(null);

  const { setAdmin, adminState } = useAdminContext() as AdminContextType;

  const navigate = useNavigate();

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
        const res = (await privateAxios.post("/login", formData)).data;
        if (!res.success) {
          return toast.error("Login failed, Please try again");
        }
        const { user, accessToken } = res.data;
        const admin: AdminType = {
          username: user.username,
          accessToken,
          id: user.id,
          avatar: user?.avatar,
        };
        setAdmin(admin);
      } catch (err: unknown) {
        console.log(err);
        const error = err as AxiosError;
        console.log(error);
        if (!error?.response) {
          toast.error("Something went wrong");
        } else {
          toast.error(error.response?.data?.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (usernameOrEmailRef.current) {
      usernameOrEmailRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (adminState) navigate(-1);
  }, [adminState, navigate]);

  return (
    <div className="h-full min-h-[100vh] flex items-center justify-center w-full">
      <div className="w-[28rem] p-8 rounded-md shadow-2xl">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="mb-8">to continue to Ecommerce Admin</p>
        <form className="w-full" onSubmit={handleOnSubmit} noValidate>
          <div className="flex flex-col items-start gap-1 mb-4">
            <Label htmlFor="usernameOrEmail">Username or Email</Label>
            <Input
              autoComplete="off"
              id="usernameOrEmail"
              name="usernameOrEmail"
              type="text"
              placeholder="Admin"
              innerRef={usernameOrEmailRef}
              required={true}
              className="peer"
              onFocus={() => setHasUsernameOrEmailFocused(true)}
              disabled={isLoading}
              onBlur={() => setHasUsernameOrEmailBlured(true)}
            />
            {hasUsernameOrEmailFocused && hasUsernameOrEmailBlured && (
              <Message error={true} className="hidden peer-invalid:block">
                Username or Email is required
              </Message>
            )}
          </div>
          <div className="flex flex-col items-start gap-1 mb-4">
            <Label htmlFor="password">Password</Label>
            <div className="flex items-center w-full relative peer">
              <Input
                autoComplete="off"
                id="password"
                name="password"
                type={`${isPasswordVisible ? "text" : "password"}`}
                placeholder="*******"
                required={true}
                className="peer"
                onFocus={() => setHasPasswordFocused(true)}
                disabled={isLoading}
                onBlur={() => setHasPasswordBlured(true)}
              />
              {isPasswordVisible ? (
                <GoEye
                  className="absolute right-0 top-[50%] translate-y-[-50%] w-9 py-3 px-2 h-full cursor-pointer"
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                />
              ) : (
                <GoEyeClosed
                  className="absolute right-0 top-[50%] translate-y-[-50%] w-9 py-3 px-2 h-full cursor-pointer"
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                />
              )}
            </div>
            {hasPasswordFocused && hasPasswordBlured && (
              <Message
                error={true}
                className="hidden peer-has-[:invalid]:block"
              >
                Password is required
              </Message>
            )}
          </div>
          <Button
            varient="default"
            size="default"
            className="w-full gap-2"
            disabled={isLoading}
            type="submit"
          >
            {isLoading && <Loader width="1rem" height="1rem" color="white" />}
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
