import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { api } from "@/app/lib/api";
import { confirmAction } from "@/app/components/common/confirmAction";

export const useActionConfirmAlert = (refresh: () => void) => {
  // 🔹 Generic Soft Delete
  const handleSoftDelete = async (entity: any, module: string, label = "item") => {
    const confirmed = await confirmAction({
      title: "Move to Trash?",
      text: `You are about to move the ${label} "${entity.name}" to trash.`,
      confirmButtonText: "Yes, trash!",
      cancelButtonText: "Cancel",
    });

    if (!confirmed) return;

    try {
      Swal.fire({
        title: "Moving to Trash...",
        text: "Please wait a moment.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await api.post(`/configure/${module}/trash/${entity.id}`);

      Swal.close();
      refresh();

      toast.success(`"${entity.name}" moved to trash.`, {
        autoClose: 1000,
      });
    } catch (error: any) {
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || `Failed to move ${label} to trash`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // 🔹 Generic Force Delete
  const handleForceDelete = async (entity: any, module: string, label = "item") => {
    const confirmed = await confirmAction({
      title: "Delete Permanently?",
      text: `You are about to permanently delete the ${label} "${entity.name}". This cannot be undone!`,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    });

    if (!confirmed) return;

    try {
      Swal.fire({
        title: "Deleting permanently...",
        text: `Please wait while we delete the ${label}.`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await api.delete(`/configure/${module}/${entity.id}`);

      Swal.close();
      refresh();

      toast.success(`"${entity.name}" deleted permanently.`, {
        autoClose: 1000,
      });
    } catch (error: any) {
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || `Failed to delete ${label}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // 🔹 Generic Restore
  const handleRestore = async (entity: any, module: string, label = "item") => {
    const confirmed = await confirmAction({
      title: "Restore?",
      text: `You are about to restore the ${label} "${entity.name}".`,
      confirmButtonText: "Yes, restore!",
      cancelButtonText: "Cancel",
    });

    if (!confirmed) return;

    try {
      Swal.fire({
        title: "Restoring...",
        text: `Please wait while we restore the ${label}.`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await api.post(`/configure/${module}/restore/${entity.id}`);

      Swal.close();
      refresh();

      toast.success(`"${entity.name}" restored successfully.`, {
        autoClose: 1000,
      });
    } catch (error: any) {
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || `Failed to restore ${label}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return {
    handleSoftDelete,
    handleForceDelete,
    handleRestore,
  };
};
