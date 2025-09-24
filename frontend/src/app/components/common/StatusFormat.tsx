// utils/statusFormat.tsx
interface StatusBadgeProps {
  status?: boolean | number; // true/false or 1/0
  deletedAt?: string | null; // soft deleted timestamp
}

export const formatStatusBadge = ({
  status,
  deletedAt,
}: StatusBadgeProps): JSX.Element => {
  // Trashed
  if (deletedAt) {
    return (
      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-red-200 text-gray-800 hover:bg-gray-300 transition duration-200">
        Trashed
      </span>
    );
  }

  // Active
  if (status === true || status === 1) {
    return (
      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition duration-200">
        Active
      </span>
    );
  }

  // Inactive
  if (status === false || status === 0) {
    return (
      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800 hover:bg-red-200 transition duration-200">
        Inactive
      </span>
    );
  }

  // fallback
  return (
    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
      Unknown
    </span>
  );
};
