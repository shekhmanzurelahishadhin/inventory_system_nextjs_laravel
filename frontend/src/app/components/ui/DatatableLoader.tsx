"use client"
import React, { useState, useEffect } from 'react'

interface LoaderProps {
  duration?: number; // milliseconds
  onHide?: () => void; // optional callback
}

export default function DatatableLoader({ duration = 5000, onHide }: LoaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onHide) onHide();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onHide]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex bg-gray/40 items-center justify-center z-10">
      <div className="flex space-x-2 px-6 py-3 items-center justify-center 
          backdrop-blur-md shadow-lg border border-white/30 rounded-lg bg-white/60">
        <svg
          className="animate-spin -ml-1 mr-3 h-6 w-6 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 
               0 5.373 0 12h4zm2 5.291A7.962 
               7.962 0 014 12H0c0 3.042 1.135 
               5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <h5 className="text-indigo-700 font-medium">Loading data...</h5>
      </div>
    </div>
  )
}
