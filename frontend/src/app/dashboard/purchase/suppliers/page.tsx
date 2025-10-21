"use client";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faEye,
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
import FormSkeleton from "@/app/components/ui/FormSkeleton";
import DatatableLoader from "@/app/components/ui/DatatableLoader";
import { formatDateTime } from "@/app/components/common/DateFormat";
import { formatStatusBadge } from "@/app/components/common/StatusFormat";
import { useActionConfirmAlert } from "@/app/hooks/useActionConfirmAlert";

const Suppliers = () => {
  const [modalType, setModalType] = useState<"create" | "edit" | "view" | null>(
    null
  );
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [backendErrors, setBackendErrors] = useState<Record<string, string[]>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add this line
  const { hasPermission } = useAuth();
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [status, setStatus] = useState<any[]>([]);

  const formRef = useRef<any>(null);

  const [companies, setCompanies] = useState<any[]>([]);

  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });
  const { handleSoftDelete, handleForceDelete, handleRestore } = useActionConfirmAlert(() =>
    setRefreshTrigger((prev) => prev + 1)
  );
  const fetchCompanies = async () => {
    const res = await api.get("/configure/companies", {
      params: { status: 1 }, // only status = active companies
    });
    setCompanies(
      res.data.data.map((c: any) => ({ value: c.id, label: c.name }))
    );
  };

  const fetchLookups = async () => {
    try {
      const type = "active_status";
      const res = await api.get(`/configure/get-lookup-list/${type}`);
      setStatus(res.data.map((m: any) => ({ value: m.value, label: m.label })));
    } catch (error) {
      console.error("Failed to fetch lookups", error);
    }
  };
  useEffect(() => {
    fetchCompanies();
    fetchLookups();
  }, []);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Purchase", href: "#" },
    { label: "Suppliers", href: "#" },
  ];

  const supplierFields = [
    {
      label: "Company",
      key: "company_id",
      type: "reactselect",
      required: true,
      showOn: "both",
      options: companies,
    },
    {
      label: "Supplier Name",
      key: "name",
      type: "text",
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
      label: "Email",
      key: "email",
      type: "email",
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
      label: "Status",
      key: "status",
      type: "radio",
      required: true,
      options: status,
      showOn: "edit", // edit only
    },
    {
      label: "Company Name",
      key: "company_name",
      type: "text",
      readOnly: true,
      showOn: "view",
    },
    {
      label: "Status",
      key: "status",
      type: "radio",
      required: true,
      options: status.map((opt) => ({
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
  ];
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openModal = (type: "create" | "edit" | "view", supplier: any = null) => {
    setModalType(type);
    setSelectedSupplier(supplier);
    setBackendErrors({});
    setIsSubmitting(false);
    fetchCompanies();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedSupplier(null);
    setBackendErrors({});
    setIsSubmitting(false);
  };

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
        await api.post("/purchase/suppliers", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Supplier saved successfully");
      } else if (modalType === "edit" && selectedSupplier?.id) {
        // Edit: Use POST + _method=PUT for Laravel multipart/form-data
        submitData.append("_method", "PUT");
        console.log(formData);

        await api.post(`/purchase/suppliers/${selectedSupplier.id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Supplier updated successfully");
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
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Company Name",
      selector: (row) => row.company_name,
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
              tooltip: "View",
              show: (r) => hasPermission("supplier.view"),
            },
            {
              icon: faEdit,
              onClick: (r) => openModal("edit", r),
              variant: "secondary",
              size: "sm",
              tooltip: "Edit",
              show: (r) => hasPermission("supplier.edit") && !r.deleted_at,
            },
            {
              icon: row.deleted_at ? faTrashRestore : faTrash,
              onClick: (r) =>
                r.deleted_at ? handleForceDelete(r, "/purchase/suppliers", "supplier") : handleSoftDelete(r, "/purchase/suppliers", "supplier"),
              variant: "danger",
              size: "sm",
              show: (r) => hasPermission("supplier.delete"),
              tooltip: row.deleted_at ? "Delete Permanently" : "Move to Trash",
            },
            {
              icon: faUndo,
              onClick: (r) => handleRestore(r, "/purchase/suppliers", "supplier"),
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

  const exportColumns = [
    { name: "Name", selector: "name" },
    { name: "Company Name", selector: "company_name" },
    { name: "Code", selector: "code" },
    { name: "Address", selector: "address" },
    {
      name: "Status",
      selector: (row) =>
        row.deleted_at ? 'Trash' : (row.status === 1 ? "Active" : "Inactive"),
    },
    { name: "Created by", selector: "created_by" },
    { name: "Created at", selector: "created_at" },
  ];
  const filterFields = [
    { 'name': 'name', 'label': 'Supplier Name', 'type': 'text' },
    { 'name': 'company_name', 'label': 'Company Name', 'type': 'text' },
    { 'name': 'code', 'label': 'Code', 'type': 'text' },
    { 'name': 'phone', 'label': 'Phone', 'type': 'text' },
    { 'name': 'email', 'label': 'Email', 'type': 'email' },
    { 'name': 'address', 'label': 'Address', 'type': 'text' },
    {
      name: "status", label: "Status", type: "reactselect", options: [
        { value: "trash", label: "Trashed" },
        { value: "1", label: "Active" },
        { value: "0", label: "Inactive" },
      ]
    },
    { 'name': 'created_by', 'label': 'Created By', 'type': 'text' },
    { 'name': 'created_at', 'label': 'Created At', 'type': 'date' },
  ];

  return (
    <>
      <AccessRoute
        requiredPermissions={[
          "supplier.view",
          "supplier.create",
          "supplier.edit",
          "supplier.delete",
        ]}
      >
        <PageHeader
          title="Suppliers Management"
          breadcrumbItems={breadcrumbItems}
        />

        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-8xl mx-auto">
            <div className="bg-white flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Suppliers List
              </h2>

              <Button
                variant="primary"
                icon={faPlus}
                size="md"
                className="mt-2 sm:mt-0"
                onClick={() => openModal("create")}
                show={hasPermission("supplier.create")}
              >
                Add New
              </Button>
            </div>

            {/* DataTable */}
            <div className="bg-white shadow pt-8">
              <DynamicDataTable
                columns={columns}
                apiEndpoint="/purchase/suppliers"
                exportColumns={exportColumns}
                filterFields={filterFields}
                exportFileName="Suppliers"
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                defaultPerPage={perPage}
                searchPlaceholder="Search suppliers..."
                refreshTrigger={refreshTrigger} // Add this prop
                filterGridCols={7}
                onPaginationChange={(page, perPage) =>
                  setPagination({ page, perPage })
                }
                allowExportAll={true} // allow export all data
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
              ? "Create Supplier"
              : modalType === "edit"
                ? "Edit Supplier"
                : "View Supplier"
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
                  className={`${isSubmitting
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
            <DynamicViewTable data={selectedSupplier} fields={supplierFields} />
          )}

          {(modalType === "create" || modalType === "edit") && (
            <>
              {loadingDropdowns ? (
                <div className="p-6 text-center">
                  {/* <FormSkeleton fields={supplierFields} mode={modalType} /> */}
                  <DatatableLoader />
                </div>
              ) : (
                <DynamicForm
                  ref={formRef}
                  data={modalType === "edit" ? selectedSupplier : null}
                  fields={supplierFields}
                  onSubmit={handleFormSubmit}
                  backendErrors={backendErrors}
                  mode={modalType}
                />
              )}
            </>
          )}
        </Modal>
      </AccessRoute>
    </>
  );
};

export default Suppliers;
