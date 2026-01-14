"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginForm } from "@/lib/schemas/auth";
import { useLogin } from "@/hooks/auth/use-auth";

export default function Signin() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  const { register, handleSubmit, control } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // const { mutate: login, isLoading, isError, error } = useLogin();
  const { mutate: login, isError, error } = useLogin();

  const onSubmit = async (data: LoginForm) => {
    try {
      console.log(data);
      login(data);
      //   await login.mutateAsync({
      //     username: data.username,
      //     password: data.password,
      //   });
      //   toast.success('Login successful! Welcome back.');
    } catch (error) {
      // Error is handled by the mutation hook and displayed in UI
      console.error("Login error:", error);

      // Check if it's an SDK initialization error
      if ((error as any)?.message?.includes("Auth client not initialized")) {
        // toast.error('System not properly configured. Please check API key configuration.');
      } else {
        // toast.error(
        //   (error as any)?.response?.data?.error?.message ||
        //     (error as any)?.response?.data?.message ||
        //     'Login failed. Please try again.',
        // );
      }
    }
  };
  return (
    <>
      {/* Main Wrapper */}
      <div className="main-wrapper">
        <div className="account-content">
          <div className="login-wrapper login-new">
            <div className="row w-100">
              <div className="col-lg-3 mx-auto">
                <div className="login-content user-login">
                  <div className="login-logo">
                    <img src="assets/img/logo.png" alt="img" />
                    <Link
                      href={"/admin-dashboard"}
                      className="login-logo logo-white"
                    >
                      <img src="assets/img/logo-white.png" alt="Img" />
                    </Link>
                  </div>
                  {/* <Form control={control}> */}
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card">
                      <div className="card-body p-5">
                        <div className="login-userheading">
                          <h3>Sign In</h3>
                          <h4>
                            Access the Dreamspos panel using your email and
                            passcode.
                          </h4>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Email <span className="text-danger"> *</span>
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              defaultValue=""
                              //   name={username}
                              className="form-control border-end-0"
                              //   control={form.control}
                              {...register("username")}
                            />
                            <span className="input-group-text border-start-0">
                              <i className="ti ti-mail" />
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Password <span className="text-danger"> *</span>
                          </label>
                          <div className="pass-group">
                            <input
                              type={isPasswordVisible ? "text" : "password"}
                              className="pass-input form-control"
                              {...register("password")}
                            />
                            <span
                              className={`ti toggle-password ${
                                isPasswordVisible ? "ti-eye" : "ti-eye-off"
                              }`}
                              onClick={togglePasswordVisibility}
                            ></span>
                          </div>
                        </div>
                        <div className="form-login authentication-check">
                          <div className="row">
                            <div className="col-12 d-flex align-items-center justify-content-between">
                              <div className="custom-control custom-checkbox">
                                <label className="checkboxs ps-4 mb-0 pb-0 line-height-1 fs-16 text-gray-6">
                                  <input
                                    type="checkbox"
                                    className="form-control"
                                  />
                                  <span className="checkmarks" />
                                  Remember me
                                </label>
                              </div>
                              <div className="text-end">
                                <Link
                                  className="text-orange fs-16 fw-medium"
                                  href={"/forgot-password"}
                                >
                                  Forgot Password?
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-login">
                          <button
                            type="submit"
                            className="btn btn-primary w-100"
                          >
                            Sign In
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  {/* </Form> */}
                </div>
                <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                  <p>Copyright © 2025 DreamsPOS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Main Wrapper */}
    </>
  );
}
