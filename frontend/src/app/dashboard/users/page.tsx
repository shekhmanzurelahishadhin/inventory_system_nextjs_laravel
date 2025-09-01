"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "../../components/ui/Breadcrumb";
import DataTable from "react-data-table-component";
import ExportButtons from "@/app/components/ui/ExportButton";
import { api } from "@/app/lib/api";
import { toast } from "react-toastify";
import Button from "@/app/components/ui/Button";
import PageHeader from "@/app/components/layouts/PageHeader";

const UserManagement = () => {
  // Sample data for demonstration
  const [users, setUsers] = useState([]);
  const [usersSearch, setUsersSearch] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Users from Laravel API
  const fetchUsers = async () => {
    try {
      // setIsLoading(true);
      const res = await api.get("/users");
      console.log(res.data);
      setUsers(res.data.data);
      setUsersSearch(res.data.data); // <-- store filtered list separately
    } catch (error) {
      toast.error("Failed to fetch Users");
      localStorage.removeItem("auth_token");
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setUsersSearch(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsersSearch(filtered);
    }
  }, [searchTerm, users]);
  // Breadcrumb items
  const breadcrumbItems = [
    { label: "User Role", href: "#" },
    { label: "User", href: "#" },
    { label: "Manage User", href: "#" },
  ];

  // Filter posts
  const filteredPosts = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        row.roles?.includes("Super Admin") ? null : (  // checks inside comma-separated string
          <div className="flex space-x-2">
            <button className="text-blue-600 hover:text-blue-900">
              <FontAwesomeIcon icon={faEye} />
            </button>
            <button className="text-indigo-600 hover:text-indigo-900">
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button className="text-red-600 hover:text-red-900">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )
      ),
      width: "15%",
      ignoreRowClick: true,
    },
  ];

  return (
    <>
      {/* Breadcrumb Section */}
      {/* <div className="flex flex-wrap mb-6">
        <div className="w-full bg-white shadow overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
              User Management
            </h1>
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
      </div> */}
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
              className="mt-2 sm:mt-0"
              onClick={() => console.log("Add New clicked")}
            >
              Add New
            </Button>
          </div>
          {/* DataTable */}
          <div className="bg-white shadow overflow-hidden pt-8">
            <DataTable
              // title="Posts"
              columns={columns}
              data={filteredPosts}
              pagination
              highlightOnHover
              pointerOnHover
              subHeader
              subHeaderComponent={
                <div className="flex flex-col sm:flex-row justify-between items-center w-full space-y-2 sm:space-y-0">
                  {/* Export Buttons */}
                  <ExportButtons
                    data={filteredPosts}
                    fileName="users"
                    columns={[
                      { name: "Name", selector: "name" },
                      { name: "Email", selector: "email" }
                    ]}
                  />

                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="px-2 py-1 border rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              }
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
