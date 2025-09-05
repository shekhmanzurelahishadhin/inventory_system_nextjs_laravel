// hooks/usePaginatedData.ts
"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/app/lib/api";
import { useDebounce } from "./useDebounce";

interface UsePaginatedDataOptions<T> {
  apiEndpoint: string;
  searchTerm?: string;
  perPage?: number;
  currentPage?: number;
  extraParams?: Record<string, any>;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  per_page: number;
}

export function usePaginatedData<T>({
  apiEndpoint,
  searchTerm = "",
  perPage = 10,
  currentPage = 1,
  extraParams = {},
}: UsePaginatedDataOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const previousDataRef = useRef<T[]>([]); // Store previous data
  const isInitialLoadRef = useRef(true); // Track initial load

  // Debounced search term
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Create a refetch function that can be called manually
  const fetchData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    // Only store previous data if we already have data (not initial load)
    if (!isInitialLoadRef.current && data.length > 0) {
      previousDataRef.current = data;
    }

    try {
      const res = await api.get<PaginatedResponse<T>>(apiEndpoint, {
        params: {
          search: debouncedSearch,
          page: currentPage,
          per_page: perPage,
          ...extraParams,
        },
        signal: signal,
      });

      setData(res.data.data);
      setTotalRows(res.data.total);
      isInitialLoadRef.current = false; // Mark initial load as complete
    } catch (err: any) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        console.error("Fetch error:", err);
        setError(err.message || "Something went wrong");
        // Restore previous data on error
        setData(previousDataRef.current);
      }
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, debouncedSearch, currentPage, perPage, JSON.stringify(extraParams), data]);

  useEffect(() => {
    const controller = new AbortController();
    
    // Only fetch if it's not the exact same request
    if (!isInitialLoadRef.current || data.length === 0) {
      fetchData(controller.signal);
    }

    // Cancel request on cleanup
    return () => controller.abort();
  }, [apiEndpoint, debouncedSearch, currentPage, perPage, JSON.stringify(extraParams)]);

  // Return the refetch function
  const refetch = useCallback(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    
    return () => controller.abort();
  }, [fetchData]);

  return { data, loading, totalRows, error, refetch };
}