"use client";

import React from "react";

import { Modal, ModalProps } from "react-bootstrap";
// import { Form } from "react-bootstrap";

interface CustomModalProps extends ModalProps {
  onDelete?: () => void; // Example of an extra prop
}

const RoleDelete = ({ onDelete, ...props }: CustomModalProps) => {
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body>
        <div className="success-wrap text-center">
          <form>
            <div className="icon-success bg-danger-transparent text-danger mb-2">
              <i className="ti ti-trash" />
            </div>
            <h3 className="mb-2">Delete Role</h3>
            <p className="fs-16 mb-3">Are you sure you want to delete role?</p>
            <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-md btn-secondary"
                data-bs-dismiss="modal"
              >
                No, Cancel
              </button>
              <button
                onClick={onDelete}
                type="button"
                className="btn btn-md btn-primary"
              >
                Yes, Delete
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RoleDelete;
