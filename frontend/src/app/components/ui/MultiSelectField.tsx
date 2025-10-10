import React from "react";
import Select from "react-select";
import makeAnimated from 'react-select/animated';

interface Option {
  value: string | number;
  label: string;
}

interface MultiSelectFieldProps {
  value: any[];
  options: Option[];
  onChange: (values: any[]) => void;
  placeholder?: string;
  padding?: string; // optional padding prop
  // disabled?: boolean;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  value,
  options,
  onChange,
  placeholder,
  padding = "0.5rem", // default padding
  // disabled = false,
}) => {
  const animatedComponents = makeAnimated();
  return (
    <Select
      isMulti // enable multi-select
      components={animatedComponents} // use animated components
      value={options.filter((opt) => value.includes(opt.value))}
      onChange={(selected) =>
        onChange(selected.map((s: any) => s.value))
      }
      options={options}
      // isDisabled={disabled}
      placeholder={placeholder}
      styles={{
        control: (provided) => ({
          ...provided,
          padding: padding, // apply padding
        }),
        multiValue: (provided) => ({
          ...provided,
          padding: "2px 4px", // optional for selected items
        }),
        input: (provided) => ({
          ...provided,
          margin: "0px",
        }),
      }}
    />
  );
};

export default MultiSelectField;
