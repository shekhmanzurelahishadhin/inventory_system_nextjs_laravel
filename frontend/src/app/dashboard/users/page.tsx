"use client";
// pages/admin/posts/index.js
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "../../components/Breadcrumb";
import DataTable from "react-data-table-component";
import ExportButtons from "@/app/components/ExportButton";
import { api } from "@/app/lib/api";
import { toast } from "react-toastify";

const PostManagement = () => {
  // Sample data for demonstration
  const [users, setUsers] = useState([]);
  const [usersSearch, setUsersSearch] = useState([]);
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Getting Started with Next.js",
      slug: "getting-started-with-nextjs",
      category: "Web Development",
      views: 1245,
      status: "Published",
      publishedAt: "2023-06-15",
    },
    {
      id: 2,
      title: "Advanced React Patterns",
      slug: "advanced-react-patterns",
      category: "Programming",
      views: 876,
      status: "Draft",
      publishedAt: "2023-07-22",
    },
    {
      id: 3,
      title: "Tailwind CSS Best Practices",
      slug: "tailwind-css-best-practices",
      category: "CSS",
      views: 1532,
      status: "Published",
      publishedAt: "2023-05-10",
    },
    {
      id: 4,
      title: "State Management in React",
      slug: "state-management-in-react",
      category: "Programming",
      views: 987,
      status: "Published",
      publishedAt: "2023-08-05",
    },
  ]);

    // Fetch categories from Laravel API
    const fetchUsers = async () => {
        try {
            // setIsLoading(true);
            const res = await api.get('/users');
            setUsers(res.data.data);
            setUsersSearch(res.data.data); // <-- store filtered list separately
        } catch (error) {
            toast.error('Failed to fetch categories');
            localStorage.removeItem('auth_token');
        } finally {
            // setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

  const [searchTerm, setSearchTerm] = useState("");

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/admin/dashboard" },
    { label: "Content Management", href: "/admin/content" },
    { label: "Posts", href: "#" },
  ];

  // Filter posts
  const filteredPosts = posts.filter(
  (post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
);

  // Columns for DataTable
  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.title}</div>
          <div className="text-sm text-gray-500">/{row.slug}</div>
        </div>
      ),
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Views",
      selector: (row) => row.views,
      sortable: true,
      style: {
        justifyContent: "flex-end", // aligns right
      },
      cell: (row) => row.views.toLocaleString(),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            row.status === "Published"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Published Date",
      selector: (row) => row.publishedAt,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
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
      ),
    },
  ];

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="flex flex-wrap mb-6">
        <div className="w-full bg-white shadow overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
              User Management
            </h1>
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-8xl mx-auto">
          <div className="bg-white flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Users</h2>
            <button
              // onClick={handleCreate}
              className="mt-2 sm:mt-0 flex items-center px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-1" />
              Add New
            </button>
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
                    fileName="posts"
                    columns={[
                      { name: "Title", selector: "title" },
                      { name: "Slug", selector: "slug" },
                      { name: "Category", selector: "category" },
                      { name: "Views", selector: "views" },
                      { name: "Status", selector: "status" },
                      { name: "Published Date", selector: "publishedAt" },
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
              paginationPerPage={2}
              paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostManagement;
