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
  faArrowLeft,
  faCheckSquare,
  faSquare,
  faFilter,
  faCheckCircle,
  faLayerGroup,
  faBars,
  faFolderTree,
  faCheck,
  faChevronDown,
  faUserShield
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import AccessRoute from "@/app/routes/AccessRoute";

const UserPermissionsPage = () => {
  const { userId } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { hasPermission,refreshUser, user:currentUser } = useAuth();
  
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
    { label: "Users", href: "/dashboard/users" },
    { label: "Assign Permissions", href: "#" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, permissionsRes] = await Promise.all([
          api.get(`/users/${userId}/permissions`),
          api.get("/permissions"),
        ]);
        setUser(userRes.data.user);
        setSelectedPermissions(userRes.data.permissions || []);
        
        // Organize permissions and extract options
        processPermissions(permissionsRes.data.data || []);
      } catch (error: any) {
        toast.error("Failed to load user or permissions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

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
      await api.post(`/users/${userId}/permissions`, {
        permissions: selectedPermissions,
      });
      toast.success("Permissions updated successfully");
       if (currentUser && currentUser.id === parseInt(userId)) {
      console.log("Refreshing current user permissions...");
      await refreshUser(); // Refresh the user's permissions in context
    }
      router.push("/dashboard/users");
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
      <AccessRoute>
        <PageHeader
          title={`Assign Permissions to ${user?.name}`}
          breadcrumbItems={breadcrumbItems}
        />
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-8xl mx-auto">
            {/* Header Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <FontAwesomeIcon icon={faUserShield} className="mr-3 text-blue-500" />
                    Assign Direct Permissions
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm">
                    Manage direct permissions for {user?.name} ({user?.email})
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    Note: Direct permissions will override role-based permissions
                  </p>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0">
                  <Button
                    variant="primary"
                    onClick={selectAllPermissions}
                    size="sm"
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                  >
                    Select All
                  </Button>
                  <Button
                    variant="danger"
                    onClick={deselectAllPermissions}
                    size="sm"
                    className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                  >
                    Deselect All
                  </Button>
                  <Link href="/dashboard/users">
                    <Button
                      variant="secondary"
                      icon={faArrowLeft}
                      size="md"
                    >
                      Back
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Filter Section */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <FontAwesomeIcon icon={faFilter} className="mr-2 text-blue-500" />
                    <h3 className="text-lg font-medium text-gray-800">Filter Permissions</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FontAwesomeIcon icon={faLayerGroup} className="mr-2 text-blue-500 text-xs" />
                        Module
                      </label>
                      <div className="relative">
                        <select
                          value={selectedModule}
                          onChange={(e) => setSelectedModule(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                          {moduleOptions.map(module => (
                            <option key={module} value={module}>
                              {module}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FontAwesomeIcon icon={faBars} className="mr-2 text-blue-500 text-xs" />
                        Menu
                      </label>
                      <div className="relative">
                        <select
                          value={selectedMenu}
                          onChange={(e) => setSelectedMenu(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                          disabled={!selectedModule}
                        >
                          {menuOptions.map(menu => (
                            <option key={menu} value={menu}>
                              {menu}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FontAwesomeIcon icon={faFolderTree} className="mr-2 text-blue-500 text-xs" />
                        Sub Menu
                      </label>
                      <div className="relative">
                        <select
                          value={selectedSubMenu}
                          onChange={(e) => setSelectedSubMenu(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                          disabled={!selectedMenu}
                        >
                          <option value="">All Submenus</option>
                          {subMenuOptions.map(submenu => (
                            <option key={submenu} value={submenu}>
                              {submenu === "Default" ? "General" : submenu}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-800">Filtered Permissions</span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {filteredPermissions.length}
                      </span>
                    </div>
                    <div className="flex space-x-10 mt-3">
                      <Button
                        variant="primary"
                        onClick={selectAllFiltered}
                        size="md"
                        className="w-70 text-center justify-center"
                      >
                        Select All
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={deselectAllFiltered}
                        size="md"
                        className="w-70 text-center justify-center"
                      >
                        Deselect All
                      </Button>
                    </div>
                    <div className="flex items-center justify-center mt-3">
                      <FontAwesomeIcon 
                        icon={areAllFilteredSelected() ? faCheckCircle : faSquare} 
                        className={areAllFilteredSelected() ? "text-green-500" : "text-gray-400"}
                      />
                      <span className="text-xs text-gray-600 ml-2">
                        {areAllFilteredSelected() ? "All selected" : "Not all selected"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions List */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-800 flex items-center">
                      <FontAwesomeIcon icon={faCheckSquare} className="mr-2 text-blue-500" />
                      Available Permissions
                    </h3>
                  </div>
                  
                  {filteredPermissions.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="text-gray-300 text-4xl mb-4">
                        <FontAwesomeIcon icon={faFilter} />
                      </div>
                      <p className="text-gray-500">No permissions match your selection</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredPermissions.map(perm => (
                        <div
                          key={perm.name}
                          className={`flex items-center p-3 rounded-md border cursor-pointer transition-all ${
                            selectedPermissions.includes(perm.name)
                              ? "bg-blue-50 border-blue-200"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          }`}
                          onClick={() => togglePermission(perm.name)}
                        >
                          <div className={`flex items-center justify-center h-5 w-5 rounded border mr-3 ${
                            selectedPermissions.includes(perm.name)
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "bg-white border-gray-300"
                          }`}>
                            {selectedPermissions.includes(perm.name) && (
                              <FontAwesomeIcon icon={faCheck} className="text-xs" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-800 truncate">{perm.name}</span>
                            <div className="flex items-center mt-1">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2 truncate">
                                {perm.module_name || "Other"}
                              </span>
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded truncate">
                                {perm.menu_name || "General"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Permissions */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-800 flex items-center">
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-500" />
                      Selected Permissions
                      <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {selectedPermissions.length}
                      </span>
                    </h3>
                  </div>
                  
                  {selectedPermissions.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-md">
                      <div className="text-gray-300 text-4xl mb-3">
                        <FontAwesomeIcon icon={faCheckSquare} />
                      </div>
                      <p className="text-gray-500">No permissions selected yet</p>
                      <p className="text-gray-400 text-sm mt-1">Select permissions using the checkboxes</p>
                    </div>
                  ) : (
                    <div className="border rounded-md p-4 bg-gray-50 max-h-80 overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedPermissions.map(permName => {
                          const perm = permissions.find(p => p.name === permName);
                          return (
                            <div key={permName} className="bg-white p-3 rounded-md border border-gray-200 flex items-center">
                              <div className="flex items-center justify-center h-5 w-5 rounded bg-green-100 border border-green-300 text-green-600 mr-3">
                                <FontAwesomeIcon icon={faCheck} className="text-xs" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium text-gray-800 truncate">{permName}</span>
                                {perm && (
                                  <div className="flex items-center mt-1">
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2 truncate">
                                      {perm.module_name || "Other"}
                                    </span>
                                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded truncate">
                                      {perm.menu_name || "General"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-end space-x-4">
                    <Button 
                      variant="secondary" 
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleSave} 
                      disabled={saving}
                      icon={saving ? undefined : faCheck}
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AccessRoute>
    </>
  );
};

export default UserPermissionsPage;