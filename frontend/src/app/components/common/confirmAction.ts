// utils/confirmAction.ts
import Swal, { SweetAlertIcon } from "sweetalert2";

interface ConfirmOptions {
  title: string;
  text: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  reverseButtons?: boolean;
}

export const confirmAction = async (options: ConfirmOptions) => {
  const result = await Swal.fire({
    title: options.title,
    text: options.text,
    icon: options.icon || "warning",
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || "Confirm",
    cancelButtonText: options.cancelButtonText || "Cancel",
    confirmButtonColor: options.confirmButtonColor || "#d33",
    cancelButtonColor: options.cancelButtonColor || "#3085d6",
    reverseButtons: options.reverseButtons ?? true,
    customClass: {
      confirmButton: 'px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700',
      cancelButton: 'px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 mr-3'
    }
  });

  return result.isConfirmed;
};
