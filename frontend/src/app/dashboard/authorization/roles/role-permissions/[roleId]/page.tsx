"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { toast } from "react-toastify";
import Button from "@/app/components/ui/Button";
import PageHeader from "@/app/components/layouts/PageHeader";
import Preloader from "@/app/components/ui/Preloader";

const RolePermissionsPage = () => {
  const { roleId } = useParams(); // role id
  const router = useRouter();

  const [role, setRole] = useState<any>(null);
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        setAllPermissions(permissionsRes.data.data || []);
      } catch (error: any) {
        toast.error("Failed to load role or permissions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roleId]);

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSave = async () => {
    try {
      console.log("Saving permissions:", selectedPermissions);
      setSaving(true);
      await api.post(`/roles/${roleId}/permissions`, {
        permissions: selectedPermissions,
      });
      toast.success("Permissions updated successfully");
      router.push("/dashboard/authorization/roles"); // go back
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
          </div>

          {/* DataTable */}
          <div className="bg-white shadow overflow-hidden py-8 px-6">
            <div className="grroleId grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allPermissions.map((perm) => (
                <label
                  key={perm?.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm?.name)}
                    onChange={() => togglePermission(perm?.name)}
                    className="h-4 w-4"
                  />
                  <span>
                    {/* {perm.module_name || "No Module"}
                {perm.menu_name || "No Menu"}
                {perm.sub_menu_name || ""} */}
                    {perm.name}
                  </span>
                </label>
              ))}
            </div>

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
