"use client";
import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  showCloseButton = true,
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Size classes
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with fade-in animation */}
      <div
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        className={`fixed inset-0 bg-opacity-50 duration-300  ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal container with slide-in animation */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        } max-h-[90vh] overflow-hidden flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between py-3 px-5 border-b border-gray-100 sticky top-0 bg-gray z-10">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-gray-900 font-sans"
          >
            {title}
          </h2>
          
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="sticky bottom-0 bg-white border-t border-gray-100 py-3 px-5">
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              {footer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;