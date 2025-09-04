// hooks/usePaginatedData.ts
"use client";
import { useEffect, useState } from "react";
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

  // Debounced search term
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get<PaginatedResponse<T>>(apiEndpoint, {
          params: {
            search: debouncedSearch,
            page: currentPage,
            per_page: perPage,
            ...extraParams,
          },
          signal: controller.signal,
        });

        setData(res.data.data);
        setTotalRows(res.data.total);
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Fetch error:", err);
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cancel request on cleanup
    return () => controller.abort();
  }, [apiEndpoint, debouncedSearch, currentPage, perPage, JSON.stringify(extraParams)]);

  return { data, loading, totalRows, error };
}
