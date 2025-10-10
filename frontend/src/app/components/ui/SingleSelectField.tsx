"use client";
import React from "react";
import Select from "react-select";

interface Option {
  value: string | number;
  label: string;
}

interface SingleSelectFieldProps {
  value: string | number | null;
  options: Option[];
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isRtl?: boolean;
  isSearchable?: boolean;
  name?: string;
}

const SingleSelectField: React.FC<SingleSelectFieldProps> = ({
  value,
  options,
  onChange,
  placeholder,
  isDisabled = false,
  isLoading = false,
  isClearable = true,
  isRtl = false,
  isSearchable = true,
  name = "select",
}) => {
  return (
    <Select
      className="basic-single"
      classNamePrefix="select"
      value={options.find((opt) => opt.value === value) || null}
      onChange={(selected: any) => onChange(selected ? selected.value : null)}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      isRtl={isRtl}
      isSearchable={isSearchable}
      name={name}
      options={options}
      placeholder={placeholder}
      styles={{
        control: (provided) => ({
          ...provided,
          padding: "3px 4px",
          marginTop: "4px",
          minHeight: "50px",
        }),
      }}
    />
  );
};

export default SingleSelectField;
