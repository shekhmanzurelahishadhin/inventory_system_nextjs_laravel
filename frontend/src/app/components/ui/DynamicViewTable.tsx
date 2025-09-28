"use client";
import React from "react";


interface DynamicViewTableProps {
  data: Record<string, any> | null;
  fields: FieldConfigArray;
}

const DynamicViewTable: React.FC<DynamicViewTableProps> = ({ data, fields }) => {
  if (!data) return null;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const renderValue = (field: any) => {
  const value = data[field.key];

  // Use a custom render function if provided
  if (field.render) return field.render(value, data);

  // Handle select fields with options
  if (field.type === "select" && field.options) {
    const option = field.options.find((opt: any) => opt.value === value);
    return option ? option.label : "-";
  }

  // Handle checkbox
  if (field.type === "checkbox") return value ? "Yes" : "No";

  // Handle date formatting
  if (field.type === "date" && value) {
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toLocaleDateString();
  }

  // 🖼️ Handle image fields
  if (field.type === "image" && value) {
    return (
      <img
        src={`${API_BASE_URL}/storage/${value}`}  // backend should return full URL for logo
        alt={field.label}
        style={{
              display: "block",
              maxWidth: "100%",
              height: "auto", // 👈 keeps the aspect ratio
              objectFit: "contain", // or "cover" if you want to fill the container
              borderRadius: "4px",
            }}
      />
    );
  }

  // Handle number / currency formatting
  if (field.type === "currency" && typeof value === "number") {
    return `${field.prefix || "$"}${value}${field.suffix || ""}`;
  }

  // Prefix / Suffix
  if (field.prefix || field.suffix)
    return `${field.prefix || ""}${value}${field.suffix || ""}`;

  // Default
  return value ?? "-";
};


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="bg-white divide-y divide-gray-200">
          {fields
            .filter((f) => f.showOn === "view" || f.showOn === "all") // showOn logic
            .filter((f) => !f.hidden)
            .map((field) => (
              <tr key={field.key}>
                <td
                  className="px-6 py-4 whitespace-nowrap font-medium text-gray-900"
                  title={field.tooltip || ""}
                >
                  {field.label}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{renderValue(field)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicViewTable;
