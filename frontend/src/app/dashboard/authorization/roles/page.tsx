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

const Roles = () => {
 
  // Breadcrumb items
  const breadcrumbItems = [
    { label: "User Role", href: "#" },
    { label: "Roles", href: "#" },
  ];


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
              onClick: (r) => console.log("View", r),
              variant: "primary",
              size: "sm",
              show: (r) => !r.roles?.includes("Super Admin"),
              tooltip: "View",
            },
            {
              icon: faEdit,
              onClick: (r) => console.log("Edit", r),
              variant: "secondary",
              size: "sm",
              show: (r) => !r.roles?.includes("Super Admin"),
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
    }
  ];

  return (
    <>
      {/* Breadcrumb Section */}
      <PageHeader
        title="Roles Management"
        breadcrumbItems={breadcrumbItems}
        onAdd={() => console.log("Add New")}
      />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-8xl mx-auto">
          <div className="bg-white flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Roles List</h2>

            <Button
              variant="primary"
              icon={faPlus}
              size="md"
              className="mt-2 sm:mt-0"
              onClick={() => console.log("Add New clicked")}
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
              exportFileName="roles_list"
              paginationRowsPerPageOptions={[10, 20, 50, 100]}
              defaultPerPage={10}
              searchPlaceholder="Search roles..."
            />

          </div>
        </div>
      </div>
    </>
  );
};

export default Roles;
