// components/ui/FormSkeleton.tsx
"use client";
import React from "react";

interface FieldConfig {
  label: string;
  key: string;
  type: "text" | "select" | "date";
  required?: boolean;
  readOnly?: boolean;
  showOn: "both" | "view" | "create-edit";
  options?: { value: any; label: string }[];
}

interface Props {
  fields: FieldConfig[];
  mode?: "create" | "edit" | "view";
}

const FormSkeleton: React.FC<Props> = ({ fields, mode = "create" }) => {
  return (
    <div className="space-y-4 p-6 animate-pulse">
      {fields
        .filter(
          (f) =>
            f.showOn === "both" ||
            (mode === "view" && f.showOn === "view") ||
            ((mode === "create" || mode === "edit") && f.showOn === "create-edit")
        )
        .map((field) => (
          <div key={field.key}>
            {/* Label skeleton */}
            <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>

            {/* Input skeleton */}
            {field.type === "select" ? (
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            ) : field.type === "date" ? (
              <div className="h-10 w-40 bg-gray-200 rounded"></div>
            ) : (
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            )}
          </div>
        ))}

      {/* Submit button placeholder */}
      {mode !== "view" && (
        <div className="h-10 w-32 bg-gray-200 rounded"></div>
      )}
    </div>
  );
};

export default FormSkeleton;
