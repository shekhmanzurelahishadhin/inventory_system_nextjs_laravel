"use client";
import React, { useState, useEffect } from "react";
import { FieldConfigArray } from "../common/FieldConfig";

interface DynamicFormProps {
  data?: Record<string, any> | null;
  fields: FieldConfigArray;
  onChange?: (updated: Record<string, any>) => void;
  onSubmit?: (formData: Record<string, any>) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ data = {}, fields, onChange, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize formData
  useEffect(() => {
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      initial[f.key] = data?.[f.key] ?? f.defaultValue ?? "";
    });
    setFormData(initial);
  }, [data, fields]);

  // Handle input change
  const handleChange = (key: string, value: any) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    if (onChange) onChange(updated);

    // Validate this field
    const field = fields.find((f) => f.key === key);
    if (field) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [key]: error || "" }));
    }
  };

  // Validate single field
  const validateField = (field: any, value: any) => {
    if (field.required && (value === "" || value === null || value === undefined)) {
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

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll() && onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form className="my-5 space-y-4" onSubmit={handleSubmit}>
      {fields
        .filter((f) => f.showOn !== "view" && !f.hidden)
        .map((field) => {
          const isDisabled = field.readOnly || field.pointerEventsNone;
          const value = formData[field.key] ?? "";

          return (
            <div key={field.key} className={`${field.className || ""}`}>
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
                {field.tooltip && (
                  <span className="text-gray-400 text-xs ml-1" title={field.tooltip}>
                    ?
                  </span>
                )}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  value={value}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  required={field.required}
                  readOnly={field.readOnly}
                  tabIndex={field.tabIndex}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  minLength={field.minLength}
                  pattern={field.pattern}
                  className={`mt-1 block w-full p-3 rounded-sm border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 ${
                    errors[field.key] ? "border-red-500" : "border-gray-300"
                  }`}
                />
              ) : field.type === "select" ? (
                <select
                  value={value}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  required={field.required}
                  disabled={isDisabled}
                  tabIndex={field.tabIndex}
                  className={`mt-1 block w-full p-3 rounded-sm border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 ${
                    errors[field.key] ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">{field.placeholder || `Select ${field.label}`}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={!!value}
                  onChange={(e) => handleChange(field.key, e.target.checked)}
                  disabled={isDisabled}
                  tabIndex={field.tabIndex}
                  className="mt-1 rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                />
              ) : (
                <input
                  type={field.type || "text"}
                  value={value}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  required={field.required}
                  readOnly={field.readOnly}
                  disabled={field.pointerEventsNone}
                  tabIndex={field.tabIndex}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  minLength={field.minLength}
                  pattern={field.pattern}
                  step={field.step}
                  min={field.min}
                  max={field.max}
                  className={`mt-1 block w-full p-3 rounded-sm border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 ${
                    errors[field.key] ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}

              {errors[field.key] && <p className="text-red-500 text-xs mt-1">{errors[field.key]}</p>}
            </div>
          );
        })}

      {/* Submit button */}
      {onSubmit && (
        <button
          type="submit"
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Submit
        </button>
      )}
    </form>
  );
};

export default DynamicForm;
