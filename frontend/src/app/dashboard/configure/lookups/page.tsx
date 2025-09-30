"use client";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faKey,
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
import { formatDateTime } from "@/app/components/common/DateFormat";
import { formatStatusBadge } from "@/app/components/common/StatusFormat";

const Lookups = () => {
  const [modalType, setModalType] = useState<"create" | "edit" | "view" | null>(
    null
  );
  const [selectedLookup, setSelectedLookup] = useState<any>(null); // Selected lookup for view/edit
  const [isMounted, setIsMounted] = useState(false); // To ensure client-side rendering
  const [backendErrors, setBackendErrors] = useState<Record<string, string[]>>(
    {}
  ); // Backend validation errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // refresh trigger for DataTable
  const { hasPermission } = useAuth(); // Access control

  const formRef = useRef<any>(null); // Ref for DynamicForm
  const router = useRouter(); // Next.js router
  const [perPage, setPerPage] = useState(10); // Default rows per page
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });
  const [lookups, setLookups] = useState<any[]>([]);
  useEffect(() => {
    const fetchLookups = async () => {
      const res = await api.get("/configure/get-lookup/lists");
      setLookups(res.data.map((m: any) => ({ value: m.value, label: m.label })));
    };
    fetchLookups();
  }, []);
  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Configure", href: "#" },
    { label: "Lookups", href: "#" },
  ];
  console.log(lookups);

  const lookupFields = [
    { name: "name", label: "Name", type: "text", required: true, key: "name" },
    {
      name: "is_new",
      label: "Is New Type",
      type: "select",
      key: "is_new",
      options: [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" },
      ],
      required: true,
    },
    {
      name: "type_write",
      label: "Type",
      type: "text",
      key: "type_write",
      required: (formData) => formData.is_new === "1", // 👈 condition
      hidden: (formData) => formData.is_new !== "1", // dynamic hidden false to show when is_new=1 1!==1 => false => show
    },
    {
      name: "type_select",
      label: "Type",
      type: "select",
      key: "type_select",
      options: lookups,
      required: (formData) => formData.is_new === "0", // 👈 condition
      hidden: (formData) => formData.is_new !== "0", // dynamic hidden false to show when is_new=0 0!==0 => false => show
    },
  ];

  // Ensure component is mounted (for client-side rendering)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Open modal function
  const openModal = (type: "create" | "edit" | "view", lookup: any = null) => {
    setModalType(type);
    setSelectedLookup(lookup);
    setBackendErrors({});
    setIsSubmitting(false);
  };

  // Close modal function
  const closeModal = () => {
    setModalType(null);
    setSelectedLookup(null);
    setBackendErrors({});
    setIsSubmitting(false);
  };

  // Handle form submission for create/edit
  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      setBackendErrors({});

      if (modalType === "create") {
        await api.post("/configure/lookups", formData);
        toast.success("Lookup saved successfully");
      } else if (modalType === "edit" && selectedLookup?.id) {
        await api.put(`/configure/lookups/${selectedLookup.id}`, formData);
        toast.success("Lookup updated successfully");
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

  // Delete lookup function with SweetAlert2 confirmation
  const handleDeleteLookup = async (lookup: any) => {
    const confirmed = await confirmAction({
      title: "Are you sure?",
      text: `You are about to delete the lookup "${lookup.name}".!`,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmed) return;

    try {
      // Show loading
      Swal.fire({
        title: "Deleting...",
        text: `Please wait while we delete the lookup`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // API call
      await api.delete(`/configure/lookups/${lookup.id}`);

      Swal.close(); // close loading

      // Success message
      Swal.fire({
        title: "Deleted!",
        text: `Lookup "${lookup.name}" has been deleted successfully.`,
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
        text: error.response?.data?.message || "Failed to delete lookup",
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
      cell: (row, index) =>
        (pagination.page - 1) * pagination.perPage + index + 1,
      width: "5%",
    },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Type", selector: (row) => row.type, sortable: true },
    { name: "Code", selector: (row) => row.code, sortable: true },

    {
      name: "Status",
      cell: (row) =>
        formatStatusBadge({ status: row.status, deletedAt: row.deleted_at }), // or statusMap[row.status]
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
              show: () => hasPermission("lookup.view"),
              tooltip: "View",
            },
            {
              icon: faEdit,
              onClick: (r) => openModal("edit", r),
              variant: "secondary",
              size: "sm",
              show: () => hasPermission("lookup.edit"),
              tooltip: "Edit",
            },
            {
              icon: faTrash,
              onClick: (r) => handleDeleteLookup(r),
              variant: "danger",
              size: "sm",
              show: () => hasPermission("lookup.delete"),
              tooltip: "Delete",
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
          "lookup.view",
          "lookup.create",
          "lookup.edit",
          "lookup.delete",
        ]}
      >
        <PageHeader
          title="Lookups Management"
          breadcrumbItems={breadcrumbItems}
        />

        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-8xl mx-auto">
            <div className="bg-white flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Lookups List
              </h2>

              <Button
                variant="primary"
                icon={faPlus}
                size="md"
                className="mt-2 sm:mt-0"
                onClick={() => openModal("create")}
                show={hasPermission("lookup.create")}
              >
                Add New
              </Button>
            </div>

            {/* DataTable */}
            <div className="bg-white shadow overflow-hidden pt-8">
              <DynamicDataTable
                columns={columns}
                apiEndpoint="/configure/lookups"
                exportColumns={[
                  { name: "Name", selector: "name" },
                  { name: "Type", selector: "type" },
                  { name: "Code", selector: "code" },
                  {
                    name: "Status",
                    selector: (row) =>
                      row.status === 1 ? "Active" : "Inactive",
                  },
                  { name: "Created at", selector: "created_at" },
                ]}
                exportFileName="lookups"
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                defaultPerPage={perPage}
                searchPlaceholder="Search lookups..."
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
              ? "Create Lookup"
              : modalType === "edit"
              ? "Edit Lookup"
              : "View Lookup"
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
            <DynamicViewTable data={selectedLookup} fields={lookupFields} />
          )}

          {(modalType === "create" || modalType === "edit") && (
            <DynamicForm
              ref={formRef}
              data={modalType === "edit" ? selectedLookup : null}
              fields={lookupFields}
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

export default Lookups;
