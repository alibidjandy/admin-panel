import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUser, useDispatch, useState } from "../context";
import { redirect, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const fixedInputClass =
  "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm";

export default function Login() {
  const navigate = useNavigate();
  const schema = yup
    .object({
      email: yup.string().email().required(),
      password: yup.string().min(5).max(10).required(),
    })
    .required();
  type FormData = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const dispatch = useDispatch();
  const States = useState();

  const submitForm = async ({ email, password }: FormData) => {
    // debugger;
    try {
      await loginUser(dispatch, { email, password });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (States?.token) {
      navigate("/grid");
    }
  }, [States?.token]);

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(submitForm)}>
      <div className="-space-y-px">
        <div className="my-5">
          <label htmlFor={"email"} className="sr-only">
            {"Email address"}
          </label>
          <input
            key={"email"}
            id={"email"}
            autoComplete="email"
            className={fixedInputClass}
            placeholder={"Email address"}
            style={{ border: errors.email ? "1px solid red" : "" }}
            {...register("email")}
          />
          {errors.email && (
            <div role={"alert"} className="text-red-500 error">
              {errors.email.message}
            </div>
          )}
        </div>
        <div className="my-5">
          <label htmlFor={"password"} className="sr-only">
            {"Password"}
          </label>
          <input
            key={"password"}
            id={"password"}
            className={fixedInputClass}
            placeholder={"Password"}
            style={{
              border: errors.password ? "1px solid red" : "",
            }}
            {...register("password")}
          />
          {errors.password && (
            <div role={"alert"} className="text-red-500 error">
              {errors.password.message}
            </div>
          )}
        </div>
      </div>
      <input
        type="submit"
        className="relative flex justify-center w-full px-4 py-2 mt-10 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md group hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      />
    </form>
  );
}
