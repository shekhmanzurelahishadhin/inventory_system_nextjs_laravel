"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { toast } from "react-toastify";
import Button from "@/app/components/ui/Button";
import PageHeader from "@/app/components/layouts/PageHeader";
import Preloader from "@/app/components/ui/Preloader";
import { useAuth } from "@/app/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowLeft,
  faCheckSquare,
  faSquare
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const RolePermissionsPage = () => {
  const { roleId } = useParams();
  const router = useRouter();

  const [role, setRole] = useState<any>(null);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { hasRole, hasPermission, refreshUser } = useAuth();
  
  // State for dropdown selections
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [selectedSubMenu, setSelectedSubMenu] = useState<string>("");
  
  // Options for dropdowns
  const [moduleOptions, setModuleOptions] = useState<string[]>([]);
  const [menuOptions, setMenuOptions] = useState<string[]>([]);
  const [subMenuOptions, setSubMenuOptions] = useState<string[]>([]);
  
  // Filtered permissions based on selections
  const [filteredPermissions, setFilteredPermissions] = useState<any[]>([]);
  
  const breadcrumbItems = [
    { label: "Roles", href: "/dashboard/authorization/roles" },
    { label: "Assign Permissions", href: "#" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roleRes, permissionsRes] = await Promise.all([
          api.get(`/roles/${roleId}/permissions`),
          api.get("/permissions"),
        ]);
        setRole(roleRes.data.role);
        setSelectedPermissions(roleRes.data.permissions || []);
        
        // Organize permissions and extract options
        processPermissions(permissionsRes.data.data || []);
      } catch (error: any) {
        toast.error("Failed to load role or permissions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roleId]);

  // Process permissions and extract dropdown options
  const processPermissions = (perms: any[]) => {
    setPermissions(perms);
    
    // Extract unique modules
    const modules = [...new Set(perms.map(p => p.module_name || "Other"))];
    setModuleOptions(modules);
    
    // Set default module selection if available
    if (modules.length > 0 && !selectedModule) {
      setSelectedModule(modules[0]);
    }
  };

  // Update menu options when module changes
  useEffect(() => {
    if (!selectedModule) return;
    
    const menus = [
      ...new Set(
        permissions
          .filter(p => (p.module_name || "Other") === selectedModule)
          .map(p => p.menu_name || "General")
      )
    ];
    setMenuOptions(menus);
    
    // Reset menu and submenu selections
    setSelectedMenu(menus.length > 0 ? menus[0] : "");
    setSelectedSubMenu("");
  }, [selectedModule, permissions]);

  // Update submenu options when menu changes
  useEffect(() => {
    if (!selectedModule || !selectedMenu) return;
    
    const submenus = [
      ...new Set(
        permissions
          .filter(p => 
            (p.module_name || "Other") === selectedModule && 
            (p.menu_name || "General") === selectedMenu
          )
          .map(p => p.sub_menu_name || "Default")
      )
    ];
    setSubMenuOptions(submenus);
    
    // Reset submenu selection
    setSelectedSubMenu(submenus.length > 0 ? submenus[0] : "");
  }, [selectedModule, selectedMenu, permissions]);

  // Update filtered permissions when any selection changes
  useEffect(() => {
    if (!selectedModule) {
      setFilteredPermissions([]);
      return;
    }
    
    let filtered = permissions.filter(p => 
      (p.module_name || "Other") === selectedModule
    );
    
    if (selectedMenu) {
      filtered = filtered.filter(p => 
        (p.menu_name || "General") === selectedMenu
      );
    }
    
    if (selectedSubMenu) {
      filtered = filtered.filter(p => 
        (p.sub_menu_name || "Default") === selectedSubMenu
      );
    }
    
    setFilteredPermissions(filtered);
  }, [selectedModule, selectedMenu, selectedSubMenu, permissions]);

  const togglePermission = (permissionName: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionName)
        ? prev.filter(p => p !== permissionName)
        : [...prev, permissionName]
    );
  };

  // Select all currently filtered permissions
  const selectAllFiltered = () => {
    const newPermissions = [...selectedPermissions];
    filteredPermissions.forEach(perm => {
      if (!newPermissions.includes(perm.name)) {
        newPermissions.push(perm.name);
      }
    });
    setSelectedPermissions(newPermissions);
  };

  // Deselect all currently filtered permissions
  const deselectAllFiltered = () => {
    const filteredPermNames = filteredPermissions.map(p => p.name);
    setSelectedPermissions(prev => 
      prev.filter(perm => !filteredPermNames.includes(perm))
    );
  };

  // Check if all filtered permissions are selected
  const areAllFilteredSelected = () => {
    if (filteredPermissions.length === 0) return false;
    return filteredPermissions.every(perm => 
      selectedPermissions.includes(perm.name)
    );
  };

  // Select all permissions in the entire system
  const selectAllPermissions = () => {
    const allPerms = permissions.map(p => p.name);
    setSelectedPermissions(allPerms);
  };

  // Deselect all permissions in the entire system
  const deselectAllPermissions = () => {
    setSelectedPermissions([]);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.post(`/roles/${roleId}/permissions`, {
        permissions: selectedPermissions,
      });
      toast.success("Permissions updated successfully");
      
      // If current user's role was updated, refresh their permissions
      if (hasRole(role?.name)) {
        await refreshUser();
      }
      
      router.push("/dashboard/authorization/roles");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update permissions"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Preloader />;

  return (
    <>
      <PageHeader
        title={`Assign Permissions to ${role?.name}`}
        breadcrumbItems={breadcrumbItems}
      />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-8xl mx-auto">
          <div className="bg-white flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Select Permissions
            </h2>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <Button
                variant="secondary"
                onClick={selectAllPermissions}
                size="sm"
              >
                Select All
              </Button>
              <Button
                variant="secondary"
                onClick={deselectAllPermissions}
                size="sm"
              >
                Deselect All
              </Button>
              <Link href="/dashboard/authorization/roles">
                <Button
                  variant="danger"
                  icon={faArrowLeft}
                  size="md"
                  show={hasPermission("role.view")||hasPermission("role.edit")||hasPermission("role.delete")||hasPermission("role.create")}
                >
                  Back
                </Button>
              </Link>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white shadow overflow-hidden p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Module
                </label>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {moduleOptions.map(module => (
                    <option key={module} value={module}>
                      {module}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Menu
                </label>
                <select
                  value={selectedMenu}
                  onChange={(e) => setSelectedMenu(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={!selectedModule}
                >
                  {menuOptions.map(menu => (
                    <option key={menu} value={menu}>
                      {menu}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Menu
                </label>
                <select
                  value={selectedSubMenu}
                  onChange={(e) => setSelectedSubMenu(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={!selectedMenu}
                >
                  <option value="">All Submenus</option>
                  {subMenuOptions.map(submenu => (
                    <option key={submenu} value={submenu}>
                      {submenu === "Default" ? "General" : submenu}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Permissions ({filteredPermissions.length})
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={selectAllFiltered}
                  className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1 border border-blue-200 rounded"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAllFiltered}
                  className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1 border border-blue-200 rounded"
                >
                  Deselect All
                </button>
                <div className="flex items-center ml-2">
                  <FontAwesomeIcon 
                    icon={areAllFilteredSelected() ? faCheckSquare : faSquare} 
                    className={areAllFilteredSelected() ? "text-blue-600" : "text-gray-400"}
                  />
                </div>
              </div>
            </div>
            
            {filteredPermissions.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No permissions match your selection
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 border-t pt-4">
                {filteredPermissions.map(perm => (
                  <label
                    key={perm.name}
                    className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(perm.name)}
                      onChange={() => togglePermission(perm.name)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm">{perm.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white shadow overflow-hidden p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Selected Permissions: {selectedPermissions.length}
              </h3>
            </div>
            
            {selectedPermissions.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No permissions selected yet
              </p>
            ) : (
              <div className="border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {selectedPermissions.map(permName => {
                    const perm = permissions.find(p => p.name === permName);
                    return (
                      <div key={permName} className="flex items-center bg-white p-2 rounded border">
                        <span className="text-sm">{permName}</span>
                        {perm && (
                          <span className="ml-2 text-xs text-gray-500">
                            ({perm.module_name || "Other"} → {perm.menu_name || "General"})
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="secondary" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RolePermissionsPage;