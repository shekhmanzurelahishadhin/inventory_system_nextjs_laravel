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
import FormSkeleton from "@/app/components/ui/FormSkeleton";
import DatatableLoader from "@/app/components/ui/DatatableLoader";
import { formatDateTime } from "@/app/components/common/DateFormat";

const SubCategories = () => {
  const [modalType, setModalType] = useState<"create" | "edit" | "view" | null>(
    null
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [backendErrors, setBackendErrors] = useState<Record<string, string[]>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add this line
  const { hasPermission } = useAuth();
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  const formRef = useRef<any>(null);

  const [categories, setCategories] = useState<any[]>([]);


  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get("/configure/categories");
      setCategories(res.data.data.map((c: any) => ({ value: c.id, label: c.name })));
    };
    fetchCategories();
  }, []);



  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Configure", href: "#" },
    { label: "Sub Categories", href: "#" },
  ];

  const subCategoryFields = [
     {
      label: "Category",
      key: "category_id",
      type: "select",
      required: true,
      showOn: "both",
      options: categories,
    },
    {
      label: "Name",
      key: "name",
      type: "text",
      required: true,
      showOn: "both",
    },
    {
      label: "Category",
      key: "category_name",
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

  const openModal = (
    type: "create" | "edit" | "view",
    subCategory: any = null
  ) => {
    setModalType(type);
    setSelectedSubCategory(subCategory);
    setBackendErrors({});
    setIsSubmitting(false);

    // if (type === "edit" && subCategory) {
    //   setLoadingDropdowns(true);
    //   (async () => {
    //     try {
    //       const [catRes] = await Promise.all([
    //         api.get("/configure/categories"),
    //       ]);

    //       setCategories(
    //         catRes.data.data.map((c: any) => ({ value: c.id, label: c.name }))
    //       );
    //     } finally {
    //       setLoadingDropdowns(false);
    //     }
    //   })();
    // }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedSubCategory(null);
    setBackendErrors({});
    setIsSubmitting(false);
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      setBackendErrors({});

      if (modalType === "create") {
        await api.post("/sub-categories", formData);
        toast.success("Sub Category saved successfully");
      } else if (modalType === "edit" && selectedSubCategory?.id) {
        await api.put(`/sub-categories/${selectedSubCategory.id}`, formData);
        toast.success("Sub Category updated successfully");
      }

      setIsSubmitting(false);
      closeModal();

      // Force table to refetch by updating refreshTrigger
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      setIsSubmitting(false);
      if (error.response?.status === 422) {
        setBackendErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data.message || "Failed to save data");
      }
    }
  };

  // Delete Sub Category function with SweetAlert2 confirmation
  const handleDelete = async (subCategory: any) => {
    const confirmed = await confirmAction({
      title: "Are you sure?",
      text: `You are about to delete the Sub Category "${subCategory.name}".!`,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmed) return;

    try {
      // Show loading
      Swal.fire({
        title: "Deleting...",
        text: `Please wait while we delete the Sub Category`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // API call
      await api.delete(`/sub-categories/${subCategory.id}`);

      Swal.close(); // close loading

      // Success message
      Swal.fire({
        title: "Deleted!",
        text: `Sub Categories "${subCategory.name}" has been deleted successfully.`,
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });

      // Refresh table
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to delete Sub Category",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  };
  // Columns for DataTable
  const columns = [
      {
      name: "#",
      cell: (row, index) => (pagination.page - 1) * pagination.perPage + index + 1,
      width: "5%",
      grow: 0,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Category Name",
      selector: (row) => row.category_name,
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
              show: (r) => hasPermission("sub-category.view"),
            },
            {
              icon: faEdit,
              onClick: (r) => openModal("edit", r),
              variant: "secondary",
              size: "sm",
              tooltip: "Edit",
              show: (r) => hasPermission("sub-category.edit"),
            },
            {
              icon: faTrash,
              onClick: (r) => handleDelete(r),
              variant: "danger",
              size: "sm",
              tooltip: "Delete",
              show: (r) => hasPermission("sub-category.delete"),
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
          "sub-category.view",
          "sub-category.create",
          "sub-category.edit",
          "sub-category.delete",
        ]}
      >
        <PageHeader
          title="Sub Categories Management"
          breadcrumbItems={breadcrumbItems}
        />

        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-8xl mx-auto">
            <div className="bg-white flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Sub Categories List
              </h2>

              <Button
                variant="primary"
                icon={faPlus}
                size="md"
                className="mt-2 sm:mt-0"
                onClick={() => openModal("create")}
                show={hasPermission("sub-category.create")}
              >
                Add New
              </Button>
            </div>

            {/* DataTable */}
            <div className="bg-white shadow overflow-hidden pt-8">
              <DynamicDataTable
                columns={columns}
                apiEndpoint="/sub-categories"
                exportColumns={[
                  { name: "Name", selector: "name" },
                  { name: "Category Name", selector: "category_name" },
                  { name: "Created at", selector: "created_at" },
                ]}
                exportFileName="SubCategories"
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                defaultPerPage={perPage}
                searchPlaceholder="Search permission..."
                refreshTrigger={refreshTrigger} // Add this prop
                onPaginationChange={(page, perPage) => setPagination({ page, perPage })}
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
              ? "Create Sub Category"
              : modalType === "edit"
              ? "Edit Sub Category"
              : "View Sub Category"
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
            <DynamicViewTable
              data={selectedSubCategory}
              fields={subCategoryFields}
            />
          )}

          {(modalType === "create" || modalType === "edit") && (
            <>
              {loadingDropdowns ? (
                <div className="p-6 text-center">
                  {/* <FormSkeleton fields={subCategoryFields} mode={modalType} /> */}
                  <DatatableLoader/>
                </div>
              ) : (
                <DynamicForm
                  ref={formRef}
                  data={modalType === "edit" ? selectedSubCategory : null}
                  fields={subCategoryFields}
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

export default SubCategories;
