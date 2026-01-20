"use client";
import CollapesIcon from "core/common/tooltip-content/collapes";
import RefreshIcon from "core/common/tooltip-content/refresh";
import TooltipIcons from "core/common/tooltip-content/tooltipIcons";
import { all_routes } from "data/all_routes";

import Table from "core/common/pagination/datatable";
import Link from "next/link";
import { PlusCircle } from "react-feather";
import { useListRoles } from "hooks/use-role";
import RoleDelete from "core/_modals/usermanagement/roledelete";
import { useState } from "react";
import RoleAdd from "core/_modals/usermanagement/roleadd";

export default function RolesPermissions() {
  const route = all_routes;
  const { data: roleList, isLoading, isError, error } = useListRoles();
  const columns = [
    {
      title: "Role Name",
      dataIndex: "role_name_th",
      sorter: (a: any, b: any) => a.role_name_th.length - b.role_name_th.length,
    },
    {
      title: "Role Name En",
      dataIndex: "role_name_en",
      sorter: (a: any, b: any) => a.role_name_en.length - b.role_name_en.length,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      sorter: (a: any, b: any) => a.createdon.length - b.createdon.length,
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: () => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link className="me-2 p-2" href={route.permissions}>
              <i
                data-feather="sheild"
                className="feather feather-shield shield"
              ></i>
            </Link>
            <Link
              className="me-2 p-2"
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#edit_role"
            >
              <i data-feather="edit" className="feather-edit"></i>
            </Link>

            <Link
              className="confirm-text p-2"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsDeleteModal(true);
              }}
            >
              <i data-feather="trash-2" className="feather-trash-2"></i>
            </Link>
          </div>
        </div>
      ),
    },
  ];
  const [isCreateModal, setIsCreateModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Roles & Permission</h4>
                <h6>Manage your roles</h6>
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
                className="btn btn-primary"
                onClick={(event) => {
                  event.preventDefault();
                  setIsCreateModal(true)
                }}
              >
                <PlusCircle className=" feather me-2" />
                Add Role
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
                {roleList ? (
                  <Table
                    columns={columns}
                    dataSource={roleList?.data}
                    isLoading={isLoading}
                  />
                ) : null}
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      {/* <AddRole /> */}
      <RoleAdd show={isCreateModal} onHide={() => setIsCreateModal(false)} />
      {/*<EditRole /> */}
      <>
        {/* Delete Role */}
        <RoleDelete
          show={isDeleteModal}
          onHide={() => setIsDeleteModal(false)}
        />
      </>
    </div>
  );
}
