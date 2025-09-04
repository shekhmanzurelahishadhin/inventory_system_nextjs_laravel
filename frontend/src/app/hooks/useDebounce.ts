// hooks/useDebounce.ts
"use client";
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler); // cleanup on value change
  }, [value, delay]);

  return debounced;
}
