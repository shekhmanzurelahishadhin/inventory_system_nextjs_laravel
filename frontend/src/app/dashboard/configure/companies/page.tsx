"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faKey,
  faTrashRestore,
  faUndo,
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
import { formatStatusBadge } from "@/app/components/common/StatusFormat";
import { formatDateTime } from "@/app/components/common/DateFormat";
import { useActionConfirmAlert } from "@/app/hooks/useActionConfirmAlert";

const Companies = () => {
  const [modalType, setModalType] = useState<"create" | "edit" | "view" | null>(
    null
  );
  const [selectedCompany, setSelectedCompany] = useState<any>(null); // Selected company for view/edit
  const [isMounted, setIsMounted] = useState(false); // To ensure client-side rendering
  const [backendErrors, setBackendErrors] = useState<Record<string, string[]>>(
    {}
  ); // Backend validation errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // refresh trigger for DataTable
  const { hasPermission } = useAuth(); // Access control

  const formRef = useRef<any>(null); // Ref for DynamicForm
  const router = useRouter(); // Next.js router
  const [perPage, setPerPage] = useState(10);
  const [status, setStatus] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });
  const { handleSoftDelete, handleForceDelete, handleRestore }= useActionConfirmAlert(() => setRefreshTrigger((prev) => prev + 1));
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Configure", href: "#" },
    { label: "Company", href: "#" },
  ];

  const companyFields = [
    {
      label: "Company Name",
      key: "name",
      type: "text",
      required: true,
      showOn: "all", // visible in create/edit/view
    },
    {
      label: "Email",
      key: "email",
      type: "email",
      required: true,
      showOn: "all",
    },
    {
      label: "Phone",
      key: "phone",
      type: "text",
      required: false,
      showOn: "all",
    },
    {
      label: "Address",
      key: "address",
      type: "textarea",
      required: false,
      showOn: "all",
    },
    {
      label: "Logo",
      key: "logo",
      type: "file", // because backend expects UploadedFile
      required: false,
      showOn: "both", // show only on create/edit
    },
    {
      label: "Status",
      key: "status",
      type: "radio",
      required: true,
      options: status,
      showOn: "edit", // edit only
    },
    {
      label: "Created At",
      key: "created_at",
      type: "date",
      readOnly: true,
      showOn: "view",
    },
    {
      label: "Updated At",
      key: "updated_at",
      type: "date",
      readOnly: true,
      showOn: "view",
    },
  ];
  const viewFields = [
    {
      label: "Company Name",
      key: "name",
      type: "text",
      required: true,
      showOn: "all", // visible in create/edit/view
    },
    {
      label: "Email",
      key: "email",
      type: "email",
      required: true,
      showOn: "all",
    },
    {
      label: "Phone",
      key: "phone",
      type: "text",
      required: false,
      showOn: "all",
    },
    {
      label: "Address",
      key: "address",
      type: "textarea",
      required: false,
      showOn: "all",
    },
    {
      label: "Logo",
      key: "logo",
      type: "image", // view only
      required: false,
      showOn: "view", // show only on view
    },
    {
      label: "Status",
      key: "status",
      type: "radio",
      required: true,
      options: status.map(opt => ({
      ...opt,
      className:
        opt.value === "1"
          ? "px-2 py-1 bg-green-100 text-green-700 rounded"
          : "px-2 py-1 bg-red-100 text-red-700 rounded",
    })),
      showOn: "view",
    },
       {
      label: "Created By",
      key: "created_by",
      type: "text",
      readOnly: true,
      showOn: "view",
    },
    {
      label: "Created At",
      key: "created_at",
      type: "date",
      readOnly: true,
      showOn: "view",
    },
    {
      label: "Updated At",
      key: "updated_at",
      type: "date",
      readOnly: true,
      showOn: "view",
    },
  ];

  // Ensure component is mounted (for client-side rendering)
  useEffect(() => {
    setIsMounted(true);
  }, []);
const fetchLookups = async () => {
    try {
      const type = "active_status";
      const res = await api.get(`/configure/get-lookup-list/${type}`);
      setStatus(
        res.data.map((m: any) => ({ value: m.value, label: m.label }))
      );
    } catch (error) {
      console.error("Failed to fetch lookups", error);
    }
  };
  useEffect(() => {
    fetchLookups();
  }, []);
  // Open modal function
  const openModal = (type: "create" | "edit" | "view", company: any = null) => {
    setModalType(type);
    setSelectedCompany(company);
    setBackendErrors({});
    setIsSubmitting(false);
  };

  // Close modal function
  const closeModal = () => {
    setModalType(null);
    setSelectedCompany(null);
    setBackendErrors({});
    setIsSubmitting(false);
  };

  // Handle form submission for create/edit
  const handleFormSubmit = async (formData: Record<string, any>) => {
    console.log("Form Data Submitted:", formData);

    try {
      setIsSubmitting(true);
      setBackendErrors({});

      // Prepare FormData
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        const value = formData[key];

        if (value instanceof File) {
          // Only append if user selected a new file
          submitData.append(key, value);
        } else if (value !== null && value !== undefined) {
          // Convert booleans to 1/0 strings, everything else to string
          if (typeof value === "boolean") {
            submitData.append(key, value ? "1" : "0");
          } else {
            submitData.append(key, String(value));
          }
        }
      });

      if (modalType === "create") {
        // Create
        await api.post("/configure/companies", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Company saved successfully");
      } else if (modalType === "edit" && selectedCompany?.id) {
        // Edit: Use POST + _method=PUT for Laravel multipart/form-data
        submitData.append("_method", "PUT");
        console.log(formData);

        await api.post(
          `/configure/companies/${selectedCompany.id}`,
          submitData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        toast.success("Company updated successfully");
      }

      setIsSubmitting(false);
      closeModal();
      setRefreshTrigger((prev) => prev + 1); // refresh table
    } catch (error: any) {
      setIsSubmitting(false);

      if (error.response?.status === 422) {
        // Laravel validation errors
        setBackendErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data.message || "Failed to save data");
      }
    }
  };

  // Columns for DataTable
  const columns = [
    {
      name: "#",
      cell: (row, index) =>
        (pagination.page - 1) * pagination.perPage + index + 1,
      width: "5%",
      grow: 0,
    },
    {
      name: "Logo",
      cell: (row) =>
        row.logo ? (
          <img
            src={`${API_BASE_URL}/storage/${row.logo}`}
            alt={row.name}
            style={{
              display: "block",
              maxWidth: "100%",
              height: "auto", // 👈 keeps the aspect ratio
              objectFit: "contain", // or "cover" if you want to fill the container
              borderRadius: "4px",
            }}
          />
        ) : (
          <span className="text-gray-400">No Logo</span>
        ),
      width: "10%", // optional width
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
      name: "Code",
      selector: (row) => row.code,
      sortable: true,
    },

    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        formatStatusBadge({ status: row.status, deletedAt: row.deleted_at }),
      sortable: true,
    },
     {
      name: "Created By",
      selector: (row) => row.created_by,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => formatDateTime(row.created_at),
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
              show: (r) => hasPermission("company.view"),
              tooltip: "View",
            },
            {
              icon: faEdit,
              onClick: (r) => openModal("edit", r),
              variant: "secondary",
              size: "sm",
              show: (r) => hasPermission("company.edit") && !r.deleted_at,
              tooltip: "Edit",
            },
            {
              icon: row.deleted_at ? faTrashRestore : faTrash,
              onClick: (r) =>
                r.deleted_at ? handleForceDelete(r, "/configure/companies", "company") : handleSoftDelete(r, "/configure/companies", "company"),
              variant: "danger",
              size: "sm",
              show: (r) => hasPermission("company.delete"),
              tooltip: row.deleted_at ? "Delete Permanently" : "Move to Trash",
            },
            {
              icon: faUndo,
              onClick: (r) => handleRestore(r, "/configure/companies", "company"),
              variant: "success",
              size: "sm",
              show: (r) => r.deleted_at,
              tooltip: "Restore",
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
          "company.view",
          "company.create",
          "company.edit",
          "company.delete",
        ]}
      >
        <PageHeader
          title="Company Management"
          breadcrumbItems={breadcrumbItems}
        />

        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-8xl mx-auto">
            <div className="bg-white flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Company List
              </h2>

              <Button
                variant="primary"
                icon={faPlus}
                size="md"
                className="mt-2 sm:mt-0"
                onClick={() => openModal("create")}
                show={hasPermission("company.create")}
              >
                Add New
              </Button>
            </div>

            {/* DataTable */}
            <div className="bg-white shadow pt-8">
              <DynamicDataTable
                columns={columns}
                apiEndpoint="/configure/companies"
                exportColumns={[
                  { name: "Name", selector: "name" },
                  { name: "Email", selector: "email" },
                  { name: "Code", selector: "code" },
                  { name: "address", selector: "address" },
                  {
                    name: "Status",
                    selector: (row) =>
                      row.deleted_at ? 'Trash' : ( row.status === 1 ? "Active" : "Inactive"),
                  },
                  { name: "Created at", selector: "created_at" },
                ]}
                exportFileName="companies"
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                defaultPerPage={perPage}
                searchPlaceholder="Search companys..."
                refreshTrigger={refreshTrigger}
                onPaginationChange={(page, perPage) =>
                  setPagination({ page, perPage })
                }
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
              ? "Create Company"
              : modalType === "edit"
              ? "Edit Company"
              : "View Company"
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
            <DynamicViewTable data={selectedCompany} fields={viewFields} />
          )}

          {(modalType === "create" || modalType === "edit") && (
            <DynamicForm
              ref={formRef}
              data={modalType === "edit" ? selectedCompany : null}
              fields={companyFields}
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

export default Companies;
