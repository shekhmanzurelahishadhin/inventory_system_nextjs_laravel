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

const Models = () => {
  const [modalType, setModalType] = useState<"create" | "edit" | "view" | null>(
    null
  );
  const [selectedModel, setSelectedModel] = useState<any>(null);
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

  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });
  const { handleSoftDelete, handleForceDelete, handleRestore } =
    useActionConfirmAlert(() => setRefreshTrigger((prev) => prev + 1));
  const fetchDatas = async () => {
    const res = await api.get("/configure/categories", {
      params: { status: 1 }, // only status = active categories
    });
    const brandRes = await api.get("/configure/brands", {
      params: { status: 1 }, // only status = active brands
    });
    setCategories(
      res.data.data.map((c: any) => ({ value: c.id, label: c.name }))
    );
    setBrands(
      brandRes.data.data.map((b: any) => ({ value: b.id, label: b.name }))
    );
  };
  useEffect(() => {
    fetchDatas();
  }, []);

  // When form changes
  const handleFormChange = async (updated: Record<string, any>) => {
    // Category selected → fetch sub-categories
    if (updated.category_id) {
      setLoadingDropdowns(true); // start loader
      try {
        const res = await api.get(
          `/configure/sub-categories?category_id=${updated.category_id}`,
          {
            params: { status: 1 }, // only status = active sub-categories
          }
        );
        setSubCategories(
          res.data.data.map((m: any) => ({ value: m.id, label: m.name }))
        );
      } catch (error) {
        console.error("Failed to fetch sub-categories", error);
        setSubCategories([]);
      } finally {
        setLoadingDropdowns(false); // stop loader after fetch finishes
      }
    } else {
      setSubCategories([]); // clear sub-categories if no category selected
      setLoadingDropdowns(false); // stop loader immediately
    }
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
    fetchLookups();
  }, []);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Configure", href: "#" },
    { label: "Model", href: "#" },
  ];

  const modelFields = [
    {
      label: "Category",
      key: "category_id",
      type: "reactselect",
      required: true,
      showOn: "both",
      options: categories,
      watch: true, // watch this field for changes
    },
    {
      label: "Sub Category",
      key: "sub_category_id",
      type: "reactselect",
      required: true,
      showOn: "both",
      options: subCategories,
      isLoading: loadingDropdowns,
    },
    {
      label: "Brand",
      key: "brand_id",
      type: "reactselect",
      required: true,
      showOn: "both",
      options: brands,
    },
    {
      label: "Name",
      key: "name",
      type: "text",
      required: true,
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
      label: "Category Name",
      key: "category_name",
      type: "text",
      readOnly: true,
      showOn: "view",
    },
    {
      label: "Sub Category",
      key: "sub_category_name",
      type: "text",
      readOnly: true,
      showOn: "view",
    },
    {
      label: "Brand",
      key: "brand_name",
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

  const openModal = (type: "create" | "edit" | "view", model: any = null) => {
    setModalType(type);
    setSelectedModel(model);
    setBackendErrors({});
    setIsSubmitting(false);
    fetchDatas();
    if (type === "edit" && model) {
      setLoadingDropdowns(true);
      (async () => {
        try {
          const [res] = await Promise.all([
            api.get(
              `/configure/sub-categories?category_id=${model.category_id}`,
              {
                params: { status: 1 }, // only status = active sub-categories
              }
            ),
          ]);
          setSubCategories(
            res.data.data.map((m: any) => ({ value: m.id, label: m.name }))
          );
        } finally {
          setLoadingDropdowns(false);
        }
      })();
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedModel(null);
    setBackendErrors({});
    setIsSubmitting(false);
    setSubCategories([]);
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
        await api.post("/configure/models", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category saved successfully");
      } else if (modalType === "edit" && selectedModel?.id) {
        // Edit: Use POST + _method=PUT for Laravel multipart/form-data
        submitData.append("_method", "PUT");
        console.log(formData);

        await api.post(`/configure/models/${selectedModel.id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Category updated successfully");
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
      name: "Category",
      selector: (row) => row.category_name,
      sortable: true,
    },
    {
      name: "Sub Category",
      selector: (row) => row.sub_category_name,
      sortable: true,
    },
    {
      name: "Brand",
      selector: (row) => row.brand_name,
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
              show: (r) => hasPermission("model.view"),
            },
            {
              icon: faEdit,
              onClick: (r) => openModal("edit", r),
              variant: "secondary",
              size: "sm",
              tooltip: "Edit",
              show: (r) => hasPermission("model.edit") && !r.deleted_at,
            },
            {
              icon: row.deleted_at ? faTrashRestore : faTrash,
              onClick: (r) =>
                r.deleted_at
                  ? handleForceDelete(r, "/configure/models", "model")
                  : handleSoftDelete(r, "/configure/models", "model"),
              variant: "danger",
              size: "sm",
              show: (r) => hasPermission("model.delete"),
              tooltip: row.deleted_at ? "Delete Permanently" : "Move to Trash",
            },
            {
              icon: faUndo,
              onClick: (r) => handleRestore(r, "/configure/models", "model"),
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
    { name: "Category", selector: "category_name" },
    { name: "Sub Category", selector: "sub_category_name" },
    { name: "Brand", selector: "brand_name" },
    {
      name: "Status",
      selector: (row) =>
        row.deleted_at ? "Trash" : row.status === 1 ? "Active" : "Inactive",
    },
    { name: "Created by", selector: "created_by" },
    { name: "Created at", selector: "created_at" },
  ];

  const filterFields = [
    { name: "name", label: "Name", type: "text" },
    { name: "category_name", label: "Category", type: "text" },
    { name: "sub_category_name", label: "Sub Category", type: "text" },
    { name: "brand_name", label: "Brand", type: "text" },
    {
      name: "status",
      label: "Status",
      type: "reactselect",
      options: [
        { value: "trash", label: "Trashed" },
        { value: "1", label: "Active" },
        { value: "0", label: "Inactive" },
      ],
    },
    { name: "created_by", label: "Created By", type: "text" },
    { name: "created_at", label: "Created At", type: "date" },
  ];

  return (
    <>
      <AccessRoute
        requiredPermissions={[
          "model.view",
          "model.create",
          "model.edit",
          "model.delete",
        ]}
      >
        <PageHeader
          title="Model Management"
          breadcrumbItems={breadcrumbItems}
        />

        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-8xl mx-auto">
            <div className="bg-white flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Model List
              </h2>

              <Button
                variant="primary"
                icon={faPlus}
                size="md"
                className="mt-2 sm:mt-0"
                onClick={() => openModal("create")}
                show={hasPermission("model.create")}
              >
                Add New
              </Button>
            </div>

            {/* DataTable */}
            <div className="bg-white shadow pt-8">
              <DynamicDataTable
                columns={columns}
                apiEndpoint="/configure/models"
                exportColumns={exportColumns}
                filterFields={filterFields}
                filterGridCols={7}
                exportFileName="Models"
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                defaultPerPage={perPage}
                searchPlaceholder="Search models..."
                refreshTrigger={refreshTrigger} // Add this prop
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
              ? "Create Model"
              : modalType === "edit"
                ? "Edit Model"
                : "View Model"
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
                  disabled={isSubmitting || loadingDropdowns}
                  className={`${isSubmitting || loadingDropdowns
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
            <DynamicViewTable data={selectedModel} fields={modelFields} />
          )}

          {(modalType === "create" || modalType === "edit") && (
            <>
              {
                <DynamicForm
                  ref={formRef}
                  data={modalType === "edit" ? selectedModel : null}
                  fields={modelFields}
                  onSubmit={handleFormSubmit}
                  onChange={handleFormChange}
                  backendErrors={backendErrors}
                  mode={modalType}
                />
              }
            </>
          )}
        </Modal>
      </AccessRoute>
    </>
  );
};

export default Models;
