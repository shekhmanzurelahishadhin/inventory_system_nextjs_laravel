// components/ui/Button.tsx
"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  icon?: IconDefinition;
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "ghost"
    | "success"
    | "warning"
    | "info"
    | "outline";
  size?: "sm" | "md" | "lg";
}

const Button: React.FC<ButtonProps> = ({
  children,
  icon,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles = "flex items-center justify-center rounded-md font-medium transition-colors";

  const variants: Record<string, string> = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-gray-600 hover:text-gray-900",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    info: "bg-blue-400 text-white hover:bg-blue-500",
    outline: "bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100",
  };

  const sizes: Record<string, string> = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
      {children}
    </button>
  );
};

export default Button;
