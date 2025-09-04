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
                  console.log(`${modalType} role`, selectedRole);
                  closeModal();
                }}
              >
                {modalType === "create" ? "Create" : "Update"}
              </Button>
            </>
          )
        }
      >
        {modalType === "view" && (
          <div>
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                <tr><td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Name</td><td className="px-6 py-4 whitespace-nowrap">{selectedRole?.name}</td></tr>
                <tr><td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Guard Name</td><td className="px-6 py-4 whitespace-nowrap">{selectedRole?.guard_name}</td></tr>
                <tr><td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Created At</td><td className="px-6 py-4 whitespace-nowrap">{selectedRole?.created_at}</td></tr> 
              </tbody>
            </table>
          </div>
        )}

        {(modalType === "create" || modalType === "edit") && (
          <form className="my-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role Name
              </label>
              <input
                type="text"
                defaultValue={modalType === "edit" ? selectedRole?.name : ""}
                className="mt-1 block w-full p-3 rounded-sm border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
              />
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default Roles;