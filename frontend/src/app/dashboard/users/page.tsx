"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
// import Breadcrumb from "../../components/ui/Breadcrumb";
// import DataTable from "react-data-table-component";
// import ExportButtons from "@/app/components/ui/ExportButton";
// import { api } from "@/app/lib/api";
// import { toast } from "react-toastify";
import Button from "@/app/components/ui/Button";
import PageHeader from "@/app/components/layouts/PageHeader";
import ActionButtons from "@/app/components/ui/ActionButtons";
import DynamicDataTable from "@/app/components/ui/DynamicDataTable";
import { useAuth } from "@/app/context/AuthContext";
import AccessRoute from "@/app/routes/AccessRoute";

const UserManagement = () => {
    const { hasPermission } = useAuth();
  // Sample data for demonstration
  // const [users, setUsers] = useState([]);
  // const [usersSearch, setUsersSearch] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");

  // Fetch Users from Laravel API
  // const fetchUsers = async () => {
  //   try {
  //     // setIsLoading(true);
  //     const res = await api.get("/users");
  //     console.log(res.data);
  //     setUsers(res.data.data);
  //     setUsersSearch(res.data.data); // <-- store filtered list separately
  //   } catch (error) {
  //     toast.error("Failed to fetch Users");
  //     localStorage.removeItem("auth_token");
  //   } finally {
  //     // setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "User Role", href: "#" },
    { label: "User", href: "#" },
    { label: "Manage User", href: "#" },
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
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Roles",
      selector: (row) => row.roles,
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
              show: (r) => !r.roles?.includes("Super Admin") && hasPermission("user.view"),
              tooltip: "View",
            },
            {
              icon: faEdit,
              onClick: (r) => console.log("Edit", r),
              variant: "secondary",
              size: "sm",
              show: (r) => !r.roles?.includes("Super Admin") && hasPermission("user.edit"),
              tooltip: "Edit",
            },
            {
              icon: faTrash,
              onClick: (r) => console.log("Delete", r),
              variant: "danger",
              size: "sm",
              show: (r) => !r.roles?.includes("Super Admin") && hasPermission("user.delete"),
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
    <AccessRoute
            requiredPermissions={[
              "user.view",
              "user.create",
              "user.edit",
              "user.delete",
            ]}
          >
      {/* Breadcrumb Section */}
      <PageHeader
        title="User Management"
        breadcrumbItems={breadcrumbItems}
        onAdd={() => console.log("Add New")}
      />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-8xl mx-auto">
          <div className="bg-white flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Users List</h2>

            <Button
              variant="primary"
              icon={faPlus}
              size="md"
              className="mt-2 sm:mt-0"
              show={hasPermission("user.create")}
              onClick={() => console.log("Add New clicked")}
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
                { name: "Roles", selector: "roles" },
              ]}
              exportFileName="Users"
              paginationRowsPerPageOptions={[10, 20, 50, 100]}
              defaultPerPage={2}
              searchPlaceholder="Search users..."
            />

          </div>
        </div>
      </div>
      </AccessRoute>
    </>
  );
};

export default UserManagement;
