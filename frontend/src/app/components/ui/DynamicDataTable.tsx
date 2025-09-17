"use client";
import { useState, useEffect } from "react"; // Add useEffect import
import DataTable, { TableColumn } from "react-data-table-component";
import ExportButtons from "./ExportButton";
import { usePaginatedData } from "@/app/hooks/usePaginatedData";
import Preloader from "./Preloader";
import DatatableLoader from "./DatatableLoader";

interface ExportColumn<T> {
  name: string;
  selector: keyof T;
}

interface Props<T> {
  apiEndpoint: string;
  columns: TableColumn<T>[];
  searchPlaceholder?: string;
  exportColumns?: ExportColumn<T>[];
  exportFileName?: string;
  paginationRowsPerPageOptions?: number[];
  defaultPerPage?: number;
  refreshTrigger?: number; 
  onPaginationChange?: (page: number, perPage: number) => void; 
}

const DynamicDataTable = <T extends any>({
  apiEndpoint,
  columns,
  searchPlaceholder = "Search...",
  exportColumns,
  exportFileName = "export",
  paginationRowsPerPageOptions = [5, 10, 25, 50, 100],
  defaultPerPage = 10,
  refreshTrigger = 0, 
  onPaginationChange,
}: Props<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, totalRows, error, refetch } = usePaginatedData<T>({
    apiEndpoint,
    searchTerm,
    perPage,
    currentPage,
  });

  // Add this useEffect to handle refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      // Reset to first page and refetch
      setCurrentPage(1);
      refetch();
    }
  }, [refreshTrigger]);

  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange(currentPage, perPage);
    }
  }, [currentPage, perPage]);

  return (
    <div>
      {error && (
        <div className="mb-2 p-2 text-sm text-red-600 bg-red-100 rounded">
          {error}
        </div>
      )}
      <div className="relative">
        <DataTable
          columns={columns}
          data={data}
          // progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationPerPage={perPage}
          paginationRowsPerPageOptions={paginationRowsPerPageOptions}
          onChangeRowsPerPage={(newPerPage) => {
            setPerPage(newPerPage);
            setCurrentPage(1);
          }}
          onChangePage={(page) => setCurrentPage(page)}
          highlightOnHover
          pointerOnHover
          subHeader
          subHeaderComponent={
            <div className="flex flex-col sm:flex-row justify-between items-center w-full space-y-2 sm:space-y-0">
              {exportColumns && (
                <ExportButtons
                  data={data}
                  fileName={exportFileName}
                  columns={exportColumns}
                />
              )}
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="px-2 py-2 border border-gray-300 rounded-md w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`;"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          }
        />
        {loading && (<DatatableLoader />)}
      </div>
    </div>
  );
};

export default DynamicDataTable;