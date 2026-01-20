import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateRole } from "hooks/use-role";
import { createRoleForm, createRoleSchema } from "lib/schemas/role";
import React, { useRef } from "react";
import { Button, Modal, ModalProps } from "react-bootstrap";
import { useForm } from "react-hook-form";

// type ModalProps = React.ComponentPropsWithoutRef<typeof Modal>;
interface CustomModalProps extends ModalProps {
  onDelete?: () => void; // Example of an extra prop
}

const RoleAdd = ({ onHide, ...props }: CustomModalProps) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { mutate: createRole, isPending, isSuccess, error } = useCreateRole();

  const {
    setValue,
    control,
    register,
    handleSubmit,
    formState: { isSubmitted, errors },
  } = useForm<createRoleForm>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      role_name: "",
    },
  });

  return (
    <>
      {/* Add Role */}
      <Modal {...props} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create Role</Modal.Title>
        </Modal.Header>
        <form
          className={`needs-validation`}
          id="add-user"
          onSubmit={handleSubmit(createRole)}
          ref={formRef}
        >
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Role Name</label>
              <input type="text" className="form-control" {...register("role_name")} />
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <label className="switch">
                <input id="status" type="checkbox" checked />
                <span className="slider round" />
              </label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="me-2" variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onHide}>
              Create Role
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      {/* /Add Role */}
    </>
  );
};

export default RoleAdd;
