"use client";

import CollapesIcon from "core/common/tooltip-content/collapes";
import RefreshIcon from "core/common/tooltip-content/refresh";
import TooltipIcons from "core/common/tooltip-content/tooltipIcons";
import AddUsers from "core/_modals/usermanagement/useradd";
import EditUser from "core/modals/usermanagement/edituser";
import Link from "next/link";
import { IconUser } from "@tabler/icons-react";
import Table from "core/common/pagination/datatable";
import { useSearchUsers } from "hooks/use-user";
import { useState } from "react";

export default function Users() {
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(20);

  // เรียก API เมื่อมี search query
  const {
    data: searchResult,
    isLoading,
    error,
  } = useSearchUsers({
    keyword: "",
    page: 1,
    limit: pageSize, // เพิ่ม limit เพื่อให้แสดงผลได้มากขึ้น
  });
  const columns = [
    {
      title: "User Name",
      dataIndex: "username",
      className: "py-1 px-2",
      render: (text: any, record: any) => (
        <span className="userimgname">
          <Link href="#" className="avatar avatar-md me-2">
            <>
              {record.img ? (
                <img alt="" src={record.img} />
              ) : (
                <div className="px-1 py-1.5 bg-body-secondary text-center rounded">
                  <IconUser />
                </div>
              )}
            </>
          </Link>
          <div>
            <Link href="#">{record.first_name + " " + record.last_name}</Link>
            <p>{text}</p>
          </div>
        </span>
      ),
      sorter: (a: any, b: any) => a.username.length - b.username.length,
    },

    {
      title: "Mobile",
      dataIndex: "mobile",
      sorter: (a: any, b: any) => a.phone.length - b.phone.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a: any, b: any) => a.email.length - b.email.length,
    },
    {
      title: "role_name",
      dataIndex: "role_name",
      render: (text: any, record: any) => (
        <div>
          <Link href="#">{text.role_name}</Link>
        </div>
      ),
      sorter: (a: any, b: any) => a.role.length - b.role.length,
    },
    {
      title: "Created On",
      dataIndex: "created_at",
      sorter: (a: any, b: any) => a.createdon.length - b.createdon.length,
    },
    {
      title: "Status",
      dataIndex: "active",
      render: (text: boolean) => (
        <div>
          {text === true && (
            <span className="d-inline-flex align-items-center p-1 pe-2 rounded-1 text-white bg-success fs-10">
              {" "}
              <i className="ti ti-point-filled me-1 fs-11"></i>
              Active
            </span>
          )}
          {text === false && (
            <span className="d-inline-flex align-items-center p-1 pe-2 rounded-1 text-white bg-danger fs-10">
              {" "}
              <i className="ti ti-point-filled me-1 fs-11"></i>
              Inactive
            </span>
          )}
        </div>
      ),
      sorter: (a: any, b: any) => a.status.length - b.status.length,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: () => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link className="me-2 p-2" href="#">
              <i
                data-feather="eye"
                className="feather feather-eye action-eye"
              ></i>
            </Link>
            <Link
              className="me-2 p-2"
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#edit-units"
            >
              <i data-feather="edit" className="feather-edit"></i>
            </Link>
            <Link className="confirm-text p-2" href="#">
              <i
                data-feather="trash-2"
                className="feather-trash-2"
                data-bs-toggle="modal"
                data-bs-target="#delete-modal"
              ></i>
            </Link>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>รายชื่อผู้ใช้งาน</h4>
                <h6>Manage Your Users</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <TooltipIcons />
              <RefreshIcon />
              <CollapesIcon />
            </ul>
            <div className="page-btn">
              <Link
                href="#"
                className="btn btn-added"
                // data-bs-toggle="modal"
                // data-bs-target="#add-units"
                onClick={(e) => {
                  e.preventDefault();
                  setIsCreateOpen(true);
                }}
              >
                <i className="ti ti-circle-plus me-1"></i>
                Add New User
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <div className="search-set"></div>
              <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                <div className="dropdown me-2">
                  <Link
                    href="#"
                    className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    Status
                  </Link>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <Link href="#" className="dropdown-item rounded-1">
                        Active
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="dropdown-item rounded-1">
                        Inactive
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                {searchResult ? (
                  <Table columns={columns} dataSource={searchResult?.data} PageSize={pageSize} />
                ) : null} 
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      <AddUsers open={isCreateOpen} setOpen={setIsCreateOpen}  />
      {/* <EditUser /> */}
      {/* <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content p-5 px-3 text-center">
                <span className="rounded-circle d-inline-flex p-2 bg-danger-transparent mb-2">
                  <i className="ti ti-trash fs-24 text-danger" />
                </span>
                <h4 className="fs-20 fw-bold mb-2 mt-1">Delete User</h4>
                <p className="mb-0 fs-16">
                  Are you sure you want to delete user?
                </p>
                <div className="modal-footer-btn mt-3 d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary fs-13 fw-medium p-2 px-3"
                  >
                    Yes Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
