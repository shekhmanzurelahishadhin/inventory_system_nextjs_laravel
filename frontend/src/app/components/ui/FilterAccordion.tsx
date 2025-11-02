"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faFilter,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import SingleSelectField from "./SingleSelectField";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DatePickerField from "./DatePickerField";

export interface FilterField {
  name: string;
  label: string;
  type: "text" | "select" | "date" | "reactselect";
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
}

interface FilterAccordionProps {
  title?: string;
  fields: FilterField[];
  values: Record<string, string | number>;
  onChange: (name: string, value: string | number) => void;
  filterGridCols?: number; // prop for grid columns
}

const FilterAccordion: React.FC<FilterAccordionProps> = ({
  title = "Advanced Filters",
  fields,
  values,
  onChange,
  filterGridCols = 8, // default to 8 columns
}) => {
  const [open, setOpen] = useState(false);
  // Track open state for each date field separately
  const [datePopovers, setDatePopovers] = useState<Record<string, boolean>>({});

  const toggleDatePopover = (name: string, open: boolean) => {
    setDatePopovers((prev) => ({ ...prev, [name]: open }));
  };
  const gridColClassMap: Record<number, string> = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
    7: "lg:grid-cols-7",
    8: "lg:grid-cols-8",
  };
  const gridClass = `p-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 ${
    gridColClassMap[filterGridCols] || "lg:grid-cols-8"
  } gap-4 text-left`;
  return (
    <div className="w-full border border-gray-200 rounded-lg mt-3 bg-white shadow-sm text-left">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg transition text-left"
      >
        <div className="flex items-center space-x-2 text-gray-700 font-medium">
          <FontAwesomeIcon icon={faFilter} className="text-indigo-600" />
          <span>{title}</span>
        </div>

        <FontAwesomeIcon
          icon={open ? faChevronUp : faChevronDown}
          className="text-gray-500"
        />
      </button>

      {/* Content */}
      {open && (
        <div className={gridClass}>
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col text-left">
              <label className="text-sm text-gray-700 mb-1 font-medium text-left">
                {field.label}
              </label>

              {field.type === "select" ? (
                <select
                  className="w-full border border-gray-300 rounded-md px-2 py-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-left"
                  value={values[field.name] || ""}
                  onChange={(e) => onChange(field.name, e.target.value)}
                >
                  <option value="">Select</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "reactselect" ? (
                <SingleSelectField
                  value={values[field.name] || null}
                  options={field.options || []}
                  onChange={(val) => onChange(field.name, val ?? "")}
                  placeholder={field.placeholder || `Select ${field.label}`}
                  isDisabled={field.isDisabled}
                  isLoading={field.isLoading}
                  isClearable={field.isClearable ?? true}
                  isSearchable={field.isSearchable ?? true}
                  isRtl={false}
                  name={field.name}
                />
              ) : field.type === "date" ? (
                <DatePickerField
                  value={values[field.name]?.toString()}
                  onChange={(val) => onChange(field.name, val)}
                  placeholder="Created At"
                />
              ) : (
                <input
                  type={field.type}
                  className="mt-1 block w-full p-3 rounded-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  value={values[field.name] || ""}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  placeholder={field.placeholder || field.label}
                  onWheel={(e) => e.currentTarget.blur()}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterAccordion;
