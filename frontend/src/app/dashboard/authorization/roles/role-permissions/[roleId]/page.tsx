// app/roles/permissions/[roleId]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import Button from "@/app/components/ui/Button";
import PageHeader from "@/app/components/layouts/PageHeader";
import Preloader from "@/app/components/ui/Preloader";
import { api } from "@/app/lib/api";
import { toast } from "react-toastify";
import AccessRoute from "@/app/routes/AccessRoute";
import { useAuth } from "@/app/context/AuthContext";

interface Permission {
  id: number;
  name: string;
  guard_name: string;
  module_id?: string;
  menu_id?: string;
  is_assigned: boolean;
}

const RolePermissionsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { hasPermission } = useAuth();
  const roleId = params.roleId as string;

  const [role, setRole] = useState<any>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (roleId) {
      fetchRoleAndPermissions();
    }
  }, [roleId]);

  const fetchRoleAndPermissions = async () => {
    try {
      setLoading(true);
      
      // Fetch role details
      const roleResponse = await api.get(`/roles/${roleId}`);
      setRole(roleResponse.data);

      // Fetch permissions with assignment status
      const permissionsResponse = await api.get(`/roles/${roleId}/permissions`);
      setPermissions(permissionsResponse.data.permissions);
      
      // Set initially selected permissions
      const assignedPermissions = permissionsResponse.data.permissions
        .filter((p: Permission) => p.is_assigned)
        .map((p: Permission) => p.id);
      setSelectedPermissions(assignedPermissions);

    } catch (error) {
      toast.error("Failed to load data");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = (moduleId: string) => {
    const modulePermissions = permissions.filter(p => p.module_id === moduleId);
    const allSelected = modulePermissions.every(p => selectedPermissions.includes(p.id));
    
    if (allSelected) {
      setSelectedPermissions(prev => 
        prev.filter(id => !modulePermissions.some(p => p.id === id))
      );
    } else {
      const newSelected = [...selectedPermissions];
      modulePermissions.forEach(p => {
        if (!newSelected.includes(p.id)) {
          newSelected.push(p.id);
        }
      });
      setSelectedPermissions(newSelected);
    }
  };

  const handleSelectAllGlobal = () => {
    const allSelected = permissions.every(p => selectedPermissions.includes(p.id));
    
    if (allSelected) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(permissions.map(p => p.id));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.post(`/roles/${roleId}/permissions`, {
        permission_ids: selectedPermissions
      });
      
      toast.success("Permissions updated successfully");
      router.push("/roles");
    } catch (error) {
      toast.error("Failed to update permissions");
    } finally {
      setSaving(false);
    }
  };

  // Filter permissions by search term
  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.guard_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group permissions by module
  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    const module = permission.module_id || 'other';
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (loading) return <Preloader />;

  if (!role) return <div>Role not found</div>;

  const breadcrumbItems = [
    { label: "User Role", href: "/roles" },
    { label: "Roles", href: "/roles" },
    { label: `Permissions - ${role.name}`, href: "#" },
  ];

  return (
    <>
     {/* <AccessRoute requiredPermissions={['role.assign-permissions']}> */}
      <PageHeader title={`Assign Permissions - ${role.name}`} breadcrumbItems={breadcrumbItems} />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-8xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <Button
                variant="secondary"
                icon={faArrowLeft}
                onClick={() => router.back()}
              >
                Back to Roles
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleSelectAllGlobal}
                >
                  {permissions.every(p => selectedPermissions.includes(p.id))
                    ? "Deselect All"
                    : "Select All"}
                </Button>
                
                <Button
                  variant="primary"
                  icon={faSave}
                  onClick={handleSave}
                  disabled={saving}
                  loading={saving}
                >
                  {saving ? "Saving..." : "Save Permissions"}
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Permissions Grid */}
            <div className="max-h-96 overflow-y-auto">
              {Object.entries(groupedPermissions).map(([moduleId, modulePermissions]) => (
                <div key={moduleId} className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Module: {moduleId}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectAll(moduleId)}
                    >
                      {modulePermissions.every(p => selectedPermissions.includes(p.id))
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {modulePermissions.map(permission => (
                      <label
                        key={permission.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedPermissions.includes(permission.id)
                            ? "bg-blue-50 border-blue-200"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => handlePermissionToggle(permission.id)}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-gray-700">
                            {permission.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {permission.guard_name}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              
              {filteredPermissions.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  {searchTerm ? "No permissions match your search" : "No permissions available"}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-800">
                  Selected: {selectedPermissions.length} of {permissions.length} permissions
                </span>
                <Button
                  variant="primary"
                  icon={faSave}
                  onClick={handleSave}
                  disabled={saving}
                  loading={saving}
                  size="sm"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/* </AccessRoute> */}
    </>
  );
};

export default RolePermissionsPage;