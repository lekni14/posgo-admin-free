"use client";

import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { Modal } from "antd";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createUserForm, createUserSchema } from "@/lib/schemas/user";
import { useListRoles } from "@/hooks/use-role";
import ProfilePicUpload from "@/core/common/profilepicupload";
// import { Form } from "react-bootstrap";

interface ModalProp {
  open: boolean;
  setOpen: (arg: boolean) => void;
}
interface EncodedFile {
  name: string;
  size: number;
  encoded: string; // base64 encoded content
  progress: number;
}

const AddUsers = ({ open, setOpen }: ModalProp) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { data: RoleListResponse, isLoading, isError, error } = useListRoles();
  const [encodedFiles, setEncodedFiles] = useState<EncodedFile[]>([]);
  const [selectedCover, setSelectedCover] = useState<number>(0);

  // useEffect(() => {
  //   const fetchUnitData = async () => {
  //     await authService
  //       .getRoleList()
  //       .then((response) => {
  //         setRoleList(response.data);
  //       })
  //       // .then((response) => setBrandLists(response.data))
  //       .catch((err) => console.log(err));
  //   };
  //   fetchUnitData();
  // }, []);

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const handleToggleConfirmPassword = () => {
    setConfirmPassword((prevShowPassword) => !prevShowPassword);
  };

  //   const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const showLoading = () => {
    if (open) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };
  useEffect(() => {
    showLoading();
  }, [open]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitted, errors },
  } = useForm<createUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async (data: createUserForm) => {
    try {
      console.log(data);
      // login(data);

      //   toast.success('Login successful! Welcome back.');
    } catch (error) {
      // Error is handled by the mutation hook and displayed in UI
      console.error("Login error:", error);
    }
  };
  console.log(errors);
  return (
    <Modal
      title={<h4>Add User</h4>}
      footer={
        <>
          <button className="btn btn-cancel" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button
            className="btn btn-submit ms-2"
            // type="submit"
            onClick={() => {
              if (inputRef) {
                inputRef?.current?.click();
              }
            }}
            // onClick={() => console.log("ss")}
            // form="add-user"
          >
            Submit
          </button>
        </>
      }
      loading={loading}
      open={open}
      onCancel={() => setOpen(false)}
    >
      <form
        className={`needs-validation`}
        id="add-user"
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
      >
        <input type="submit" ref={inputRef} className="d-none" />
        <div className="row">
          <div className="col-lg-12">
            <div className="new-employee-field mb-2">
              <span>Avatar</span>
              <ProfilePicUpload
                setEncodedFiles={setEncodedFiles}
                encodedFiles={encodedFiles}
                selectedCover={0}
                isValidation={false}
                setSelectedCover={setSelectedCover}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="input-blocks">
              <label>ชื่อ</label>
              <input
                type="text"
                {...register("first_name")}
                className={`form-control ${
                  errors.first_name ? "is-invalid" : ""
                }`}
              />
              {errors.first_name && (
                <div className="invalid-feedback">
                  {errors.first_name.message}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="input-blocks">
              <label>นามสกุล</label>
              <input
                type="text"
                {...register("last_name")}
                className={`form-control ${
                  errors.last_name ? "is-invalid" : ""
                }`}
              />
              {errors.last_name && (
                <div className="invalid-feedback">
                  {errors.last_name.message}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="input-blocks">
              <label>อีเมล์</label>
              <input
                type="text"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                {...register("email")}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="input-blocks">
              <label>เบอร์ติดต่อ</label>
              <input
                type="text"
                className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                {...register("mobile")}
              />
              {errors.mobile && (
                <div className="invalid-feedback">{errors.mobile.message}</div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="input-blocks">
              <label>ชื่่อผู้ใช้งาน</label>
              <input
                type="text"
                {...register("username")}
                className={`form-control ${
                  errors.username ? "is-invalid" : ""
                }`}
              />
              {errors.username && (
                <div className="invalid-feedback">
                  {errors.username.message}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="input-blocks">
              <label>Role</label>
              <Select
                classNamePrefix="react-select"
                // {...register("role")}
                options={
                  RoleListResponse
                    ? RoleListResponse.data?.map((v: any) => {
                        return {
                          id: v.id,
                          value: v.id,
                          label: v.role_name_th,
                        };
                      })
                    : []
                }
                placeholder="Choose Status"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="input-blocks">
              <label>Password</label>
              <div className="pass-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("newPassword")}
                  className={`form-control pass-input ${
                    errors.newPassword ? "is-invalid" : ""
                  }`}
                />
                <span
                  className={`ti toggle-password ${
                    showPassword ? "ti-eye" : "ti-eye-off"
                  }`}
                  onClick={handleTogglePassword}
                />
              </div>
              {errors.newPassword && (
                <div className="invalid-feedback">
                  {errors.newPassword.message}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="input-blocks">
              <label>Confirm Passworrd</label>
              <div className="pass-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("newPassword")}
                  className={`form-control pass-input ${
                    errors.newPassword ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your password"
                />
                <span
                  className={`ti   toggle-password  ${
                    showConfirmPassword ? "ti-eye" : "ti-eye-off"
                  }`}
                  onClick={handleToggleConfirmPassword}
                />
              </div>
              {errors.confirmNewPassword && (
                <div className="invalid-feedback">
                  {errors.confirmNewPassword.message}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* <div className="modal-footer-btn">
          <button
            type="button"
            className="btn btn-cancel me-2"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <Link href="#" className="btn btn-submit">
            Submit
          </Link>
        </div> */}
      </form>
    </Modal>
  );
  //   return (
  //     <div>
  //       {/* Add User */}
  //       <div className="modal fade" id="add-units">
  //         <div className="modal-dialog modal-dialog-centered custom-modal-two">
  //           <div className="modal-content">
  //             <div className="page-wrapper-new p-0">
  //               <div className="content">
  //                 <div className="modal-header border-0 custom-modal-header">
  //                   <div className="page-title">
  //                     <h4>Add User</h4>
  //                   </div>
  //                   <button
  //                     type="button"
  //                     className="close"
  //                     data-bs-dismiss="modal"
  //                     aria-label="Close"
  //                   >
  //                     <span aria-hidden="true">×</span>
  //                   </button>
  //                 </div>
  //                 <div className="modal-body custom-modal-body">
  // <form>
  //   <div className="row">
  //     <div className="col-lg-12">
  //       <div className="new-employee-field">
  //         <span>Avatar</span>
  //         <div className="profile-pic-upload mb-2">
  //           <div className="profile-pic">
  //             <span>
  //               <PlusCircle className="plus-down-add" />
  //               Profile Photo
  //             </span>
  //           </div>
  //           <div className="input-blocks mb-0">
  //             <div className="image-upload mb-0">
  //               <input type="file" />
  //               <div className="image-uploads">
  //                 <h4>Change Image</h4>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="col-lg-6">
  //       <div className="input-blocks">
  //         <label>User Name</label>
  //         <input type="text" className="form-control" />
  //       </div>
  //     </div>
  //     <div className="col-lg-6">
  //       <div className="input-blocks">
  //         <label>Phone</label>
  //         <input type="text" className="form-control" />
  //       </div>
  //     </div>
  //     <div className="col-lg-6">
  //       <div className="input-blocks">
  //         <label>Email</label>
  //         <input type="email" className="form-control" />
  //       </div>
  //     </div>
  //     <div className="col-lg-6">
  //       <div className="input-blocks">
  //         <label>Role</label>

  //         <Select
  //           classNamePrefix="react-select"
  //           options={status}
  //           placeholder="Choose Status"
  //         />
  //       </div>
  //     </div>
  //     <div className="col-lg-6">
  //       <div className="input-blocks">
  //         <label>Password</label>
  //         <div className="pass-group">
  //           <input
  //             type={showPassword ? "text" : "password"}
  //             className="pass-input form-control"
  //             placeholder="Enter your password"
  //           />
  //           <span
  //             className={`ti toggle-password ${
  //               showPassword ? "ti-eye" : "ti-eye-off"
  //             }`}
  //             onClick={handleTogglePassword}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //     <div className="col-lg-6">
  //       <div className="input-blocks">
  //         <label>Confirm Passworrd</label>
  //         <div className="pass-group">
  //           <input
  //             type={showConfirmPassword ? "text" : "password"}
  //             className="pass-input form-control"
  //             placeholder="Enter your password"
  //           />
  //           <span
  //             className={`ti   toggle-password  ${
  //               showConfirmPassword ? "ti-eye" : "ti-eye-off"
  //             }`}
  //             onClick={handleToggleConfirmPassword}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //     <div className="col-lg-12">
  //       <div className="mb-0 input-blocks">
  //         <label className="form-label">Descriptions</label>
  //         <textarea
  //           className="form-control mb-1"
  //           defaultValue={"Type Message"}
  //         />
  //         <p>Maximum 600 Characters</p>
  //       </div>
  //     </div>
  //   </div>
  //   <div className="modal-footer-btn">
  //     <button
  //       type="button"
  //       className="btn btn-cancel me-2"
  //       data-bs-dismiss="modal"
  //     >
  //       Cancel
  //     </button>
  //     <Link href="#" className="btn btn-submit">
  //       Submit
  //     </Link>
  //   </div>
  // </form>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       {/* /Add User */}
  //     </div>
  //   );
};

export default AddUsers;
