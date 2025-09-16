"use client";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FieldConfigArray } from "../common/FieldConfig";
import MultiSelectField from "./MultiSelectField";

interface DynamicFormProps {
  data?: Record<string, any> | null;
  fields: FieldConfigArray;
  onChange?: (updated: Record<string, any>) => void;
  onSubmit?: (formData: Record<string, any>) => Promise<void> | void;
  backendErrors?: Record<string, string[]>;
}

const DynamicForm = forwardRef(
  (
    {
      data = {},
      fields,
      onChange,
      onSubmit,
      backendErrors = {},
    }: DynamicFormProps,
    ref
  ) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initialize formData only once or when data changes and form is empty
    useEffect(() => {
      if (Object.keys(formData).length === 0) {
        const initial: Record<string, any> = {};
        fields.forEach((f) => {
          initial[f.key] = data?.[f.key] ?? f.defaultValue ?? (f.type === "checkbox" ? false : "");
        });
        setFormData(initial);
      }
    }, [data, fields]);

    // Handle input change
    const handleChange = (key: string, value: any) => {
      const updated = { ...formData, [key]: value };
      setFormData(updated);
      if (onChange) onChange(updated);

      const field = fields.find((f) => f.key === key);
      if (field) {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [key]: error || "" }));
      }
    };

    // Validate one field
    const validateField = (field: any, value: any) => {
      if (field.required && (value === "" || value === null)) {
        return "This field is required";
      }
      if (field.minLength && value.length < field.minLength) {
        return `Minimum ${field.minLength} characters required`;
      }
      if (field.maxLength && value.length > field.maxLength) {
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

    // Validate all fields
    const validateAll = () => {
      const newErrors: Record<string, string> = {};
      fields.forEach((field) => {
        if (field.showOn === "view" || field.hidden) return;
        const error = validateField(field, formData[field.key]);
        if (error) newErrors[field.key] = error;
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // Expose submit function to parent via ref
    useImperativeHandle(ref, () => ({
      submitForm: () => {
        if (validateAll() && onSubmit) {
          onSubmit(formData);
        }
      },
    }));

    // Common input classes
    const inputClasses = (key: string) =>
      `mt-1 block w-full p-3 rounded-sm border ${
        errors[key] || backendErrors[key] ? "border-red-500" : "border-gray-300"
      } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`;

    return (
      <form className="my-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
        {fields
          .filter((f) => f.showOn !== "view" && !f.hidden)
          .map((field) => {
            const value = formData[field.key] ?? "";

            return (
              <div key={field.key} className={field.className || ""}>
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {/* Textarea */}
                {field.type === "textarea" ? (
                  <textarea
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className={inputClasses(field.key)}
                  />
                ) : field.type === "select" ? (
                  /* Select dropdown */
                  <select
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
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
                ) : field.type === "multiselect" ? (
                  /* Multi select */
                   <MultiSelectField
    value={formData[field.key] || []}
    options={field.options || []}
    onChange={(vals) => handleChange(field.key, vals)}
    placeholder={field.placeholder || `Select ${field.label}`}
  />
                ) : field.type === "checkbox" ? (
                  /* Checkbox */
                  <input
                    type="checkbox"
                    checked={!!value}
                    onChange={(e) => handleChange(field.key, e.target.checked)}
                  />
                ) : field.type === "radio" ? (
                  /* Radio group */
                  <div className="flex gap-4">
                    {field.options?.map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={field.key}
                          value={opt.value}
                          checked={value === opt.value}
                          onChange={(e) =>
                            handleChange(field.key, e.target.value)
                          }
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                ) : field.type === "file" ? (
                  /* File input */
                  <input
                    type="file"
                    onChange={(e) =>
                      handleChange(field.key, e.target.files?.[0] || null)
                    }
                    className={inputClasses(field.key)}
                  />
                ) : (
                  /* Default input */
                  <input
                    type={field.type || "text"}
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className={inputClasses(field.key)}
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
