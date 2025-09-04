"use client";
import React, { useEffect, useState } from "react";
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

const Roles = () => {
  const [modalType, setModalType] = useState<"create" | "edit" | "view" | null>(
    null
  );
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "User Role", href: "#" },
    { label: "Roles", href: "#" },
  ];
const roleFields = [
  { label: "Name", key: "name", type: "text", required: true, showOn:"both"  },
  { label: "Guard Name", key: "guard_name", type: "text", readOnly: true, showOn:"view" },
  { label: "Created At", key: "created_at", type: "date", readOnly: true, showOn:"view" },
];
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openModal = (type: "create" | "edit" | "view", role: any = null) => {
    setModalType(type);
    setSelectedRole(role);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedRole(null);
  };

  // Columns for DataTable
  const columns = [
    {
      name: "#", // Serial Number Column
      cell: (row, index, column, id) => index + 1, // Serial starts at 1
      width: "5%", // Optional: Adjust width
      grow: 0, // Optional: Prevent column from growing
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
              tooltip: "View",
            },
            {
              icon: faEdit,
              onClick: (r) => openModal("edit", r),
              variant: "secondary",
              size: "sm",
              tooltip: "Edit",
            },
            {
              icon: faTrash,
              onClick: (r) => console.log("Delete", r),
              variant: "danger",
              size: "sm",
              show: (r) => !r.roles?.includes("Super Admin"),
              tooltip: "Delete",
            },
          ]}
        />
      ),
      width: "15%",
      ignoreRowClick: true,
    },
  ];

  if (!isMounted) return null;

  return (
    <>
      {/* Breadcrumb Section */}
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
      ? "Create Role"
      : modalType === "edit"
      ? "Edit Role"
      : "View Role"
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
          onClick={() => {
            // console.log(`${modalType} role`, selectedRole);
            // closeModal();
          }}
          
        >
          {modalType === "create" ? "Create" : "Update"}
        </Button>
      </>
    )
  }
>
  {modalType === "view" && <DynamicViewTable data={selectedRole} fields={roleFields} />}

  {(modalType === "create" || modalType === "edit") && (
    <DynamicForm
      data={modalType === "edit" ? selectedRole : null}
      fields={roleFields}
      onChange={(data) => setSelectedRole(data)}
    />
  )}
</Modal>
    </>
  );
};

export default Roles;