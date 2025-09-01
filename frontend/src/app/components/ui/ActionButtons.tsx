"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ActionButton {
  icon: IconDefinition;
  onClick: (row: any) => void;
  variant?: 
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning"
    | "info"
    | "ghost"
    | "outline";
  size?: "sm" | "md" | "lg";
  show?: (row: any) => boolean; // condition function
  tooltip?: string; // optional tooltip text
}

interface Props {
  row: any;
  buttons: ActionButton[];
}

const ActionButtons: React.FC<Props> = ({ row, buttons }) => {
  const variantColors: Record<string, string> = {
    primary: "text-blue-600 hover:text-blue-900",
    secondary: "text-indigo-600 hover:text-indigo-900",
    danger: "text-red-600 hover:text-red-700",
    success: "text-green-600 hover:text-green-700",
    warning: "text-yellow-500 hover:text-yellow-600",
    info: "text-blue-400 hover:text-blue-500",
    ghost: "text-gray-600 hover:text-gray-900",
    outline: "text-gray-800 border border-gray-300 hover:bg-gray-100",
  };

  const sizes: Record<string, string> = {
    sm: "p-1 text-sm",
    md: "p-2 text-base",
    lg: "p-3 text-lg",
  };

  return (
    <div className="flex space-x-2">
      {buttons.map((btn, index) => {
        if (btn.show && !btn.show(row)) return null;

        const colorClass = variantColors[btn.variant || "primary"];
        const sizeClass = sizes[btn.size || "md"];

        return (
          <button
            key={index}
            onClick={() => btn.onClick(row)}
            className={`${colorClass} ${sizeClass} rounded-md flex items-center justify-center transition-colors`}
            title={btn.tooltip} // optional tooltip
          >
            <FontAwesomeIcon icon={btn.icon} />
          </button>
        );
      })}
    </div>
  );
};

export default ActionButtons;
