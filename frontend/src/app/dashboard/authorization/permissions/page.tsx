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
import { permission } from "process";
import AccessRoute from "@/app/routes/AccessRoute";
import { useAuth } from "@/app/context/AuthContext";

const Permissions = () => {
  const [modalType, setModalType] = useState<"create" | "edit" | "view" | null>(
    null
  );
  const [selectedPermission, setSelectedPermission] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [backendErrors, setBackendErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add this line
  const {hasPermission} = useAuth();

  const formRef = useRef<any>(null);

  const [modules, setModules] = useState<any[]>([]);
const [menus, setMenus] = useState<any[]>([]);
const [subMenus, setSubMenus] = useState<any[]>([]);

useEffect(() => {
  const fetchModules = async () => {
    const res = await api.get("/modules");
    setModules(res.data.map((m: any) => ({ value: m.id, label: m.name })));
  };
  fetchModules();
  console.log('Modules fetched');
}, []);

// When form changes
const handleFormChange = async (updated: Record<string, any>) => {
  // Module selected → fetch menus
  if (updated.module_id) {
    const res = await api.get(`/menus?module_id=${updated.module_id}`);
    setMenus(res.data.map((m: any) => ({ value: m.id, label: m.name })));
    setSubMenus([]); // reset sub menus
  }

  // Menu selected → fetch sub menus
  if (updated.menu_id) {
    const res = await api.get(`/sub-menus?menu_id=${updated.menu_id}`);
    setSubMenus(res.data.map((s: any) => ({ value: s.id, label: s.name })));
  }
};

  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: "User Role", href: "#" },
    { label: "Permissions", href: "#" },
  ];
  
const permissionFields = [
  { label: "Name", key: "name", type: "text", required: true, showOn: "both" },
  { label: "Module", key: "module_name", type: "text", readOnly: true, showOn: "view" },
  { label: "Module", key: "module_id", type: "select", required: true, showOn: "create-edit", options: modules },
  { label: "Menu", key: "menu_name", type: "text", readOnly: true, showOn: "view" },
  { label: "Menu", key: "menu_id", type: "select", required: true, showOn: "create-edit", options: menus },
  { label: "Sub Menu", key: "sub_menu_name", type: "text", readOnly: true, showOn: "view" },
  { label: "Sub Menu", key: "sub_menu_id", type: "select", showOn: "create-edit", options: subMenus },
  { label: "Created At", key: "created_at", type: "date", readOnly: true, showOn: "view" },
];
  

  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openModal = (type: "create" | "edit" | "view", permission: any = null) => {
    setModalType(type);
    setSelectedPermission(permission);
    setBackendErrors({}); 
    setIsSubmitting(false);    
    if (type === "edit" && permission) {
      // Pre-fetch modules, menus, sub-menus for edit
      (async () => {
        const modRes = await api.get("/modules");
        const mods = modRes.data.map((m: any) => ({ value: m.id, label: m.name })));
        setModules(mods);     
        const menuRes = await api.get(`/menus?module_id=${permission.module_id}`);
        const mns = menuRes.data.map((m: any) => ({ value: m.id, label: m.name })));
        setMenus(mns);     
        const subMenuRes = await api.get(`/sub-menus?menu_id=${permission.menu_id}`);
        const subs = subMenuRes.data.map((s: any) => ({ value: s.id, label: s.name })));
        setSubMenus(subs);     
      })();
    } else {
      setMenus([]);
      setSubMenus([]);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedPermission(null);
    setBackendErrors({});
    setIsSubmitting(false);
    setMenus([]);
    setSubMenus([]);  
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      setBackendErrors({});
      
      if (modalType === "create") {
        await api.post("/permissions", formData);
        toast.success("Permission saved successfully");
      } else if (modalType === "edit" && selectedPermission?.id) {
        await api.put(`/permissions/${selectedPermission.id}`, formData);
        toast.success("Permission updated successfully");
      }
      
      setIsSubmitting(false);
      closeModal();
      
      // Force table to refetch by updating refreshTrigger
      setRefreshTrigger(prev => prev + 1);
      
    } catch (error: any) {
      setIsSubmitting(false);
      if (error.response?.status === 422) {
        setBackendErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data.message || "Failed to save data");
      }
    }
  };

    // Delete Permission function with SweetAlert2 confirmation
 const handleDelete = async (permission: any) => {
  const confirmed = await confirmAction({
    title: "Are you sure?",
    text: `You are about to delete the permission "${permission.name}".!`,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel"
  });

  if (!confirmed) return;

  try {
    // Show loading
    Swal.fire({
      title: "Deleting...",
      text: `Please wait while we delete the Permission`,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    // API call
    await api.delete(`/permissions/${permission.id}`);

    Swal.close(); // close loading

    // Success message
    Swal.fire({
      title: "Deleted!",
      text: `Pemission "${permission.name}" has been deleted successfully.`,
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK"
    });

    // Refresh table
    setRefreshTrigger(prev => prev + 1);
  } catch (error: any) {
    Swal.close();
    Swal.fire({
      title: "Error!",
      text: error.response?.data?.message || "Failed to delete Permission",
      icon: "error",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK"
    });
  }
};
  // Columns for DataTable
  const columns = [
    {
      name: "#",
      cell: (row, index) => index + 1,
      width: "5%",
      grow: 0,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Module Name",
      selector: (row) => row.module_name,
      sortable: true,
    },
    
    {
      name: "Menu Name",
      selector: (row) => row.menu_name,
      sortable: true,
    },

    {
      name: "Sub Menu Name",
      selector: (row) => row.sub_menu_name,
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
              show: (r) => hasPermission('permission.view'),
            },
            {
              icon: faEdit,
              onClick: (r) => openModal("edit", r),
              variant: "secondary",
              size: "sm",
              tooltip: "Edit",
              show: (r) => hasPermission('permission.edit'),
            },
            {
              icon: faTrash,
              onClick: (r) =>  handleDelete(r),
              variant: "danger",
              size: "sm",
              tooltip: "Delete",
              show: (r) => hasPermission('permission.delete'),
            },
          ]}
        />
      ),
      width: "15%",
      ignoreRowClick: true,
    },
  ];

  if (!isMounted) return <Preloader />;

  return (
    <>
    {/* <AccessRoute requiredPermissions={['permission.view', 'permission.create', 'permission.edit', 'permission.delete']}>  */}
      <PageHeader title="Permissions Management" breadcrumbItems={breadcrumbItems} />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-8xl mx-auto">
          <div className="bg-white flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Permissions List</h2>

            <Button
              variant="primary"
              icon={faPlus}
              size="md"
              className="mt-2 sm:mt-0"
              onClick={() => openModal("create")}
              show={hasPermission('permission.create')}
            >
              Add New
            </Button>
          </div>
          
          {/* DataTable */}
          <div className="bg-white shadow overflow-hidden pt-8">
            <DynamicDataTable
              columns={columns}
              apiEndpoint="/permissions"
              exportColumns={[
                { name: "Name", selector: "name" },
                { name: "Module Name", selector: "module_name" },
                { name: "Menu Name", selector: "menu_name" },
                { name: "Sub Menu Name", selector: "sub_menu_name" },
                { name: "Created at", selector: "created_at" },
              ]}
              exportFileName="Permissions"
              paginationRowsPerPageOptions={[10, 20, 50, 100]}
              defaultPerPage={10}
              searchPlaceholder="Search permission..."
              refreshTrigger={refreshTrigger} // Add this prop
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={!!modalType}
        onClose={closeModal}
        size="lg"
        title={modalType === "create" ? "Create Permission" : modalType === "edit" ? "Edit Permission" : "View Permission"}
        footer={
          modalType === "view" ? (
            <Button variant="secondary" onClick={closeModal}>Close</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button
                variant="primary"
                onClick={() => formRef.current?.submitForm()}
                disabled={isSubmitting}
                className={`${isSubmitting ? "opacity-60 cursor-not-allowed" : "opacity-100"}`}
              >
                 {isSubmitting ?
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg> : ''
                  }
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
        {modalType === "view" && <DynamicViewTable data={selectedPermission} fields={permissionFields} />}

        {(modalType === "create" || modalType === "edit") && (
          console.log('Rendering form with menus:', selectedPermission),
          <DynamicForm
            ref={formRef}
            data={modalType === "edit" ? selectedPermission : null}
            fields={permissionFields}
            onSubmit={handleFormSubmit}
             onChange={handleFormChange}
            backendErrors={backendErrors}
          />
        )}
      </Modal>
      {/* </AccessRoute> */}
    </>
  );
};

export default Permissions;