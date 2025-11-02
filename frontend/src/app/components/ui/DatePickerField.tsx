"use client";
import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

interface DatePickerFieldProps {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
  // dynamic styles
  padding?: string;
  marginTop?: string | number;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  className = "",
  padding = "12px", // default = py-3 px-3
  marginTop = "4px",
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={`flex items-center justify-between w-full border border-gray-300 rounded-sm text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
          style={{
            padding,
            marginTop,
          }}
        >
          <span className={!value ? "text-gray-400" : ""}>
            {value
              ? new Date(value).toLocaleDateString()
              : placeholder}
          </span>
          <FontAwesomeIcon
            icon={faCalendarAlt}
            className="ml-2 text-gray-500"
          />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => {
            onChange(date ? date.toISOString() : null);
            setOpen(false);
          }}
          initialFocus
          captionLayout="dropdown"
        />

        {value && (
          <button
            type="button"
            className="mt-2 w-full text-sm text-red-600 hover:text-red-800"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            Clear
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerField;
