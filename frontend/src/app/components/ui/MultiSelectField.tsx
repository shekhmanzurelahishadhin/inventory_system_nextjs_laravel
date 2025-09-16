"use client";
import React from "react";
import Select from "react-select";

interface MultiSelectFieldProps {
  value: string[]; // selected values
  options: { label: string; value: string | number }[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  value,
  options,
  onChange,
  placeholder,
}) => {
  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  return (
    <Select
      isMulti
      value={selectedOptions}
      onChange={(selected) => onChange(selected.map((s) => s.value))}
      options={options}
      placeholder={placeholder || "Select..."}
      className="mt-1"
    />
  );
};

export default MultiSelectField;
