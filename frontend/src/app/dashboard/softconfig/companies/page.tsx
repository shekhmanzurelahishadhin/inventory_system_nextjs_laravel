"use client";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faUserTag,
} from "@fortawesome/free-solid-svg-icons";

import Button from "@/app/components/ui/Button";
import PageHeader from "@/app/components/layouts/PageHeader";
import ActionButtons from "@/app/components/ui/ActionButtons";
import DynamicDataTable from "@/app/components/ui/DynamicDataTable";
import Modal from "@/app/components/ui/Modal";
import DynamicViewTable from "@/app/components/ui/DynamicViewTable";
import DynamicForm from "@/app/components/ui/DynamicForm";
import { api } from "@/app/lib/api";
import Preloader from "@/app/components/ui/Preloader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { confirmAction } from "@/app/components/common/confirmAction";
import AccessRoute from "@/app/routes/AccessRoute";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const Users = () => {
  const [modalType, setModalType] = useState<"create" | "edit" | "view" | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<any>(null); // Selected user for view/edit
  const [isMounted, setIsMounted] = useState(false); // To ensure client-side rendering
  const [backendErrors, setBackendErrors] = useState<Record<string, string[]>>(
    {}
  ); // Backend validation errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // refresh trigger for DataTable
 const [perPage, setPerPage] = useState(10);
    const [pagination, setPagination] = useState({
      page: 1,
      perPage: 10
    });

  const { hasPermission } = useAuth(); // Access control

  const formRef = useRef<any>(null); // Ref for DynamicForm
  const router = useRouter(); // Next.js router

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "User Role", href: "#" },
    { label: "User", href: "#" },
  ];

  useEffect(() => {
    const fetchRoles = async () => {
      const res = await api.get("/roles");
      setRoles(
        res.data.data.map((role: any) => ({ value: role.id, label: role.name }))
      );
    };
    fetchRoles();
  }, []);

  const userFields = [
    {
      label: "Name",
      key: "name",
      type: "text",
      required: true,
      showOn: "all", // both create/edit and view
    },
    {
      label: "Email",
      key: "email",
      type: "email",
      required: true,
      showOn: "all", // both create/edit and view
    },
    {
      label: "Password",
      key: "password",
      type: "password",
      required: true,
      showOn: "both", // create and edit only
    },
    {
      label: "Confirm Password",
      key: "password_confirmation",
      type: "password",
      required: true,
      showOn: "both", // create and edit only
    },
    {
      label: "Roles",
      key: "roles",
      type: "multiselect",
      required: true,
      showOn: "both",
      options: roles,
    },
        {
      label: "Roles",
      key: "rolesName",
      type: "multiselect",
      required: true,
      showOn: "view", // view only
      options: roles,
    },
    { label: "Created At", key: "created_at", type: "date", showOn: "view" },
    { label: "Updated At", key: "updated_at", type: "date", showOn: "view" },
  ];
  // Fields for DynamicForm and DynamicViewTable

  // Ensure component is mounted (for client-side rendering)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Open modal function
  const openModal = (type: "create" | "edit" | "view", user: any = null) => {
    setModalType(type);
    setSelectedUser(user);
    setBackendErrors({});
    setIsSubmitting(false);
  };

  // Close modal function
  const closeModal = () => {
    setModalType(null);
    setSelectedUser(null);
    setBackendErrors({});
    setIsSubmitting(false);
  };

  // Handle form submission for create/edit
  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      setBackendErrors({});

      if (modalType === "create") {
        await api.post("/users", formData);
        toast.success("User saved successfully");
      } else if (modalType === "edit" && selectedUser?.id) {
        await api.put(`/users/${selectedUser.id}`, formData);
        toast.success("User updated successfully");
      }

      setIsSubmitting(false);
      closeModal();

      // Force table to refetch by updating refreshTrigger
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      setIsSubmitting(false);
      if (error.response?.status === 422) {
        setBackendErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data.message || "Failed to save data");
      }
    }
  };

  // Delete user function with SweetAlert2 confirmation
  const handleDeleteUser = async (user: any) => {
    const confirmed = await confirmAction({
      title: "Are you sure?",
      text: `You are about to delete the user "${user.name}".!`,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmed) return;

    try {
      // Show loading
      Swal.fire({
        title: "Deleting...",
        text: `Please wait while we delete the user`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // API call
      await api.delete(`/users/${user.id}`);

      Swal.close(); // close loading

      // Success message
      Swal.fire({
        title: "Deleted!",
        text: `User "${user.name}" has been deleted successfully.`,
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });

      // Refresh table
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to delete user",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  };
  // Columns for DataTable
  const columns = [
        {
      name: "#",
      cell: (row, index) => (pagination.page - 1) * pagination.perPage + index + 1,
      width: "5%",
      grow: 0,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Roles",
      selector: (row) => row.rolesName,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <ActionButtons
          row={row}
          buttons={[
            {
              icon: faEye,
              onClick: (user) => openModal("view", user),
              variant: "primary",
              size: "sm",
              show: (user) => hasPermission("user.view"),
              tooltip: "View",
            },
            {
              icon: faUserTag,
              onClick: (user) =>
                router.push(`/dashboard/users/role-permissions/${user.id}`),
              variant: "info",
              size: "sm",
              show: (user) =>
                !user.rolesName?.includes("Super Admin") &&
                hasPermission("user.assign-permissions"),
              tooltip: "Assign Permissions",
            },
            {
              icon: faEdit,
              onClick: (user) => openModal("edit", user),
              variant: "secondary",
              size: "sm",
              show: (user) =>
                !user.rolesName?.includes("Super Admin") &&
                hasPermission("user.edit"),
              tooltip: "Edit",
            },
            {
              icon: faTrash,
              onClick: (user) => handleDeleteUser(user),
              variant: "danger",
              size: "sm",
              show: (user) =>
                !user.rolesName?.includes("Super Admin") &&
                hasPermission("user.delete"),
              tooltip: "Delete",
            },
          ]}
        />
      ),
      width: "15%",
      ignoreRowClick: true,
    },
  ];

  return (
    <>
      <AccessRoute
        requiredPermissions={[
          "user.view",
          "user.create",
          "user.edit",
          "user.delete",
        ]}
      >
        <PageHeader title="User Management" breadcrumbItems={breadcrumbItems} />

        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-8xl mx-auto">
            <div className="bg-white flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">User List</h2>

              <Button
                variant="primary"
                icon={faPlus}
                size="md"
                className="mt-2 sm:mt-0"
                onClick={() => openModal("create")}
                show={hasPermission("user.create")}
              >
                Add New
              </Button>
            </div>

            {/* DataTable */}
            <div className="bg-white shadow overflow-hidden pt-8">
              <DynamicDataTable
                columns={columns}
                apiEndpoint="/users"
                exportColumns={[
                  { name: "Name", selector: "name" },
                  { name: "Email", selector: "email" },
                  { name: "Roles", selector: "rolesName" },
                ]}
                exportFileName="users"
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                defaultPerPage={perPage}
                searchPlaceholder="Search users..."
                refreshTrigger={refreshTrigger}
                onPaginationChange={(page, perPage) => setPagination({ page, perPage })}
              />
            </div>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={!!modalType}
          onClose={closeModal}
          size="lg"
          title={
            modalType === "create"
              ? "Create User"
              : modalType === "edit"
              ? "Edit User"
              : "View User"
          }
          footer={
            modalType === "view" ? (
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => formRef.current?.submitForm()}
                  disabled={isSubmitting}
                  className={`${
                    isSubmitting
                      ? "opacity-60 cursor-not-allowed"
                      : "opacity-100"
                  }`}
                >
                  {isSubmitting ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    ""
                  )}
                  {isSubmitting
                    ? modalType === "create"
                      ? "Creating..."
                      : "Updating..."
                    : modalType === "create"
                    ? "Create"
                    : "Update"}
                </Button>
              </>
            )
          }
        >
          {modalType === "view" && (
            <DynamicViewTable data={selectedUser} fields={userFields} />
          )}

          {(modalType === "create" || modalType === "edit") && (
            <DynamicForm
              ref={formRef}
              data={modalType === "edit" ? selectedUser : null}
              fields={userFields}
              onSubmit={handleFormSubmit}
              backendErrors={backendErrors}
              mode={modalType}
            />
          )}
        </Modal>
      </AccessRoute>
    </>
  );
};

export default Users;
