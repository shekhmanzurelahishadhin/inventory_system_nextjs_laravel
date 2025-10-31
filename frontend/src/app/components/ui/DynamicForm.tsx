"use client";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FieldConfigArray } from "../common/FieldConfig";
import MultiSelectField from "./MultiSelectField";
import SingleSelectField from "./SingleSelectField";

interface DynamicFormProps {
  data?: Record<string, any> | null;
  fields: FieldConfigArray;
  mode?: "create" | "edit" | "view";
  onChange?: (updated: Record<string, any>) => void;
  onSubmit?: (formData: Record<string, any>) => Promise<void> | void;
  backendErrors?: Record<string, string[]>;
  columns?: 1 | 2 | 3 | 4; // only allowed values to keep tailwind classes static
}

const columnsClassMap: Record<1 | 2 | 3 | 4, string> = {
  // For each allowed columns value we return a concrete responsive class string
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2 lg:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

// Map span values to concrete classes (1..4). Extend if you need >4.
const colSpanClassMap: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
};

const DynamicForm = forwardRef(
  (
    {
      data = {},
      fields,
      mode = "create",
      onChange,
      onSubmit,
      backendErrors = {},
      columns = 1,
    }: DynamicFormProps,
    ref
  ) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
      if (Object.keys(formData).length === 0) {
        const initial: Record<string, any> = {};
        fields.forEach((f) => {
          if (f.type === "file") {
            initial[f.key] = null;
          } else if (f.type === "checkbox") {
            initial[f.key] = data?.[f.key] ?? f.defaultValue ?? false;
          } else {
            initial[f.key] = data?.[f.key] ?? f.defaultValue ?? "";
          }
        });
        setFormData(initial);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, fields]);

    const handleChange = (key: string, value: any) => {
      const updated = { ...formData, [key]: value };
      setFormData(updated);

      const field = fields.find((f) => f.key === key);
      if (field?.watch && onChange) {
        onChange(updated);
      }
      if (field) {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [key]: error || "" }));
      }
    };

    const validateField = (field: any, value: any) => {
      const isRequired =
        typeof field.required === "function"
          ? field.required(formData)
          : field.required;

      if (isRequired && (value === "" || value === null)) {
        return `${field.label} is required`;
      }
      if (field.minLength && value?.length < field.minLength) {
        return `Minimum ${field.minLength} characters required`;
      }
      if (field.maxLength && value?.length > field.maxLength) {
        return `Maximum ${field.maxLength} characters allowed`;
      }
      if (field.pattern && !new RegExp(field.pattern).test(value)) {
        return "Invalid format";
      }
      if (field.validate) {
        return field.validate(value);
      }
      return "";
    };

    const validateAll = () => {
      const newErrors: Record<string, string> = {};
      fields.forEach((field) => {
        if (!shouldShowField(field)) return;
        const error = validateField(field, formData[field.key]);
        if (error) newErrors[field.key] = error;
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        if (validateAll() && onSubmit) {
          onSubmit(formData);
        }
      },
    }));

    const inputClasses = (key: string) =>
      `mt-1 block w-full p-3 rounded-sm border ${
        errors[key] || backendErrors[key] ? "border-red-500" : "border-gray-300"
      } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`;

    const shouldShowField = (field: any) => {
      if (typeof field.hidden === "function") {
        return !field.hidden(formData);
      }
      if (typeof field.hidden === "boolean") {
        return !field.hidden;
      }

      let visible = false;
      const showOn = field.showOn || "both";

      if (showOn === "all") visible = true;
      if (showOn === "both") visible = mode === "create" || mode === "edit";
      if (showOn === "view") visible = mode === "view";
      if (showOn === "create") visible = mode === "create";
      if (showOn === "edit") visible = mode === "edit";

      return visible;
    };

    // Get grid classes safely from map (avoids dynamic tailwind class generation)
    const gridColsClass = columnsClassMap[columns] || columnsClassMap[2];

    return (
      <form
        className={`my-5 grid ${gridColsClass} gap-4`}
        onSubmit={(e) => e.preventDefault()}
      >
        {fields
          .filter((f) => shouldShowField(f))
          .map((field) => {
            const value = formData[field.key] ?? "";
            const isReadOnly = mode === "view" || field.readOnly;

            // Resolve col-span class safely using explicit map
            const rawSpan = Number(field.colSpan || 1);
            const span = Math.max(1, Math.min(rawSpan, 4)); // clamp 1..4
            const colSpanClass = colSpanClassMap[span] || "col-span-1";

            return (
              <div
                key={field.key}
                // include both user className and our static col-span class
                className={`${field.className || ""} ${colSpanClass}`}
              >
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {/* Input rendering (same as before) */}
                {field.type === "textarea" ? (
                  <textarea
                    value={value}
                    placeholder={field.placeholder || `Enter ${field.label}`}
                    onChange={(e) =>
                      !isReadOnly && handleChange(field.key, e.target.value)
                    }
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    className={inputClasses(field.key)}
                  />
                ) : field.type === "select" ? (
                  <select
                    value={value}
                    onChange={(e) =>
                      !isReadOnly && handleChange(field.key, e.target.value)
                    }
                    disabled={isReadOnly}
                    className={inputClasses(field.key)}
                  >
                    <option value="">
                      {field.placeholder || `Select ${field.label}`}
                    </option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "reactselect" ? (
                  <SingleSelectField
                    value={formData[field.key] ?? null}
                    options={field.options || []}
                    onChange={(val) =>
                      !isReadOnly && handleChange(field.key, val)
                    }
                    placeholder={field.placeholder || `Select ${field.label}`}
                    isDisabled={isReadOnly || field.isDisabled}
                    isLoading={field.isLoading}
                    isClearable={field.isClearable}
                    isRtl={field.isRtl}
                    isSearchable={field.isSearchable}
                    name={field.name || field.key}
                  />
                ) : field.type === "multiselect" ? (
                  <MultiSelectField
                    value={formData[field.key] || []}
                    options={field.options || []}
                    onChange={(vals) =>
                      !isReadOnly && handleChange(field.key, vals)
                    }
                    placeholder={field.placeholder || `Select ${field.label}`}
                  />
                ) : field.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={!!value}
                    onChange={(e) =>
                      !isReadOnly && handleChange(field.key, e.target.checked)
                    }
                    disabled={isReadOnly}
                  />
                ) : field.type === "radio" ? (
                  <div className="flex gap-4">
                    {field.options?.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-2 ${opt.className || ""}`}
                      >
                        <input
                          type="radio"
                          name={field.key}
                          value={opt.value}
                          checked={value == opt.value}
                          onChange={(e) =>
                            !isReadOnly &&
                            handleChange(field.key, e.target.value)
                          }
                          disabled={isReadOnly}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                ) : field.type === "file" ? (
                  <div>
                    <input
                      type="file"
                      onChange={(e) =>
                        !isReadOnly &&
                        handleChange(field.key, e.target.files?.[0] || null)
                      }
                      disabled={isReadOnly}
                      className={inputClasses(field.key)}
                      accept={field.accept || "*"}
                    />
                    {mode === "edit" && value instanceof File && (
                      <p className="text-sm text-gray-600 mt-1">
                        Selected: {value.name}
                      </p>
                    )}
                    {mode === "edit" && typeof value === "string" && value && (
                      <p className="text-sm text-gray-600 mt-1">
                        Current: {value.split("/").pop()}
                      </p>
                    )}
                  </div>
                ) : (
                  <input
                    type={
                      field.type === "number" ? "number" : field.type || "text"
                    }
                    step={
                      field.type === "number"
                        ? field.isDecimal
                          ? "any"
                          : "1"
                        : undefined
                    }
                    value={value}
                    placeholder={field.placeholder || `Enter ${field.label}`}
                    onChange={(e) => {
                      if (isReadOnly) return;
                      let newValue: any = e.target.value;
                      if (field.type === "number") {
                        newValue = field.isDecimal
                          ? parseFloat(newValue || 0)
                          : parseInt(newValue || 0);
                      }
                      handleChange(field.key, newValue);
                    }}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    className={inputClasses(field.key)}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                )}

                {(errors[field.key] || backendErrors[field.key]?.[0]) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field.key] || backendErrors[field.key][0]}
                  </p>
                )}
              </div>
            );
          })}
      </form>
    );
  }
);

export default DynamicForm;
