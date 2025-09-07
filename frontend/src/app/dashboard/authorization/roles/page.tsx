"use client";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faEye,
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

const Roles = () => {
  const [modalType, setModalType] = useState<"create" | "edit" | "view" | null>(
    null
  );
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [backendErrors, setBackendErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add this line
  const {hasPermission} = useAuth();

  const formRef = useRef<any>(null);
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: "User Role", href: "#" },
    { label: "Roles", href: "#" },
  ];
  
  const roleFields = [
    { label: "Name", key: "name", type: "text", required: true, showOn: "both" },
    { label: "Guard Name", key: "guard_name", type: "text", readOnly: true, showOn: "view" },
    { label: "Created At", key: "created_at", type: "date", readOnly: true, showOn: "view" },
  ];
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openModal = (type: "create" | "edit" | "view", role: any = null) => {
    setModalType(type);
    setSelectedRole(role);
    setBackendErrors({}); 
    setIsSubmitting(false);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedRole(null);
    setBackendErrors({});
    setIsSubmitting(false);
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      setBackendErrors({});
      
      if (modalType === "create") {
        await api.post("/roles", formData);
        toast.success("Role saved successfully");
      } else if (modalType === "edit" && selectedRole?.id) {
        await api.put(`/roles/${selectedRole.id}`, formData);
        toast.success("Role updated successfully");
      }
      
      setIsSubmitting(false);
      closeModal();
      
      // Force table to refetch by updating refreshTrigger
      setRefreshTrigger(prev => prev + 1);
      
    } catch (error: any) {
      setIsSubmitting(false);
      if (error.response?.status === 422) {
        setBackendErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data.message || "Failed to save data");
      }
    }
  };

    // Delete role function with SweetAlert2 confirmation
 const handleDeleteRole = async (role: any) => {
  const confirmed = await confirmAction({
    title: "Are you sure?",
    text: `You are about to delete the role "${role.name}".!`,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel"
  });

  if (!confirmed) return;

  try {
    // Show loading
    Swal.fire({
      title: "Deleting...",
      text: `Please wait while we delete the role`,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    // API call
    await api.delete(`/roles/${role.id}`);

    Swal.close(); // close loading

    // Success message
    Swal.fire({
      title: "Deleted!",
      text: `Role "${role.name}" has been deleted successfully.`,
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK"
    });

    // Refresh table
    setRefreshTrigger(prev => prev + 1);
  } catch (error: any) {
    Swal.close();
    Swal.fire({
      title: "Error!",
      text: error.response?.data?.message || "Failed to delete role",
      icon: "error",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK"
    });
  }
};
  // Columns for DataTable
  const columns = [
    {
      name: "#",
      cell: (row, index) => index + 1,
      width: "5%",
      grow: 0,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Guard Name",
      selector: (row) => row.guard_name,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => row.created_at,
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
              onClick: (r) => openModal("view", r),
              variant: "primary",
              size: "sm",
              show: (r) => hasPermission('role.view'),
              tooltip: "View",
            },
            {
              icon: faEdit,
              onClick: (r) => openModal("edit", r),
              variant: "secondary",
              size: "sm",
              show: (r) => !r.name?.includes("Super Admin") && hasPermission('role.edit'),
              tooltip: "Edit",
            },
            {
              icon: faTrash,
              onClick: (r) =>  handleDeleteRole(r),
              variant: "danger",
              size: "sm",
              show: (r) => !r.name?.includes("Super Admin") && hasPermission('role.delete'),
              tooltip: "Delete",
            },
          ]}
        />
      ),
      width: "15%",
      ignoreRowClick: true,
    },
  ];

  if (!isMounted) return <Preloader />;

  return (
    <>
    <AccessRoute requiredPermissions={['role.view', 'role.create', 'role.edit', 'role.delete']}> 
    
      <PageHeader title="Roles Management" breadcrumbItems={breadcrumbItems} />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-8xl mx-auto">
          <div className="bg-white flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Roles List</h2>

            <Button
              variant="primary"
              icon={faPlus}
              size="md"
              className="mt-2 sm:mt-0"
              onClick={() => openModal("create")}
              show={hasPermission('role.create')}
            >
              Add New
            </Button>
          </div>
          
          {/* DataTable */}
          <div className="bg-white shadow overflow-hidden pt-8">
            <DynamicDataTable
              columns={columns}
              apiEndpoint="/roles"
              exportColumns={[
                { name: "Name", selector: "name" },
                { name: "Guard Name", selector: "guard_name" },
                { name: "Created at", selector: "created_at" },
              ]}
              exportFileName="roles"
              paginationRowsPerPageOptions={[10, 20, 50, 100]}
              defaultPerPage={10}
              searchPlaceholder="Search roles..."
              refreshTrigger={refreshTrigger} // Add this prop
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={!!modalType}
        onClose={closeModal}
        size="lg"
        title={modalType === "create" ? "Create Role" : modalType === "edit" ? "Edit Role" : "View Role"}
        footer={
          modalType === "view" ? (
            <Button variant="secondary" onClick={closeModal}>Close</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button
                variant="primary"
                onClick={() => formRef.current?.submitForm()}
                disabled={isSubmitting}
                className={`${isSubmitting ? "opacity-60 cursor-not-allowed" : "opacity-100"}`}
              >
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
        {modalType === "view" && <DynamicViewTable data={selectedRole} fields={roleFields} />}

        {(modalType === "create" || modalType === "edit") && (
          <DynamicForm
            ref={formRef}
            data={modalType === "edit" ? selectedRole : null}
            fields={roleFields}
            onSubmit={handleFormSubmit}
            backendErrors={backendErrors}
          />
        )}
      </Modal>
      </AccessRoute>
    </>
  );
};

export default Roles;