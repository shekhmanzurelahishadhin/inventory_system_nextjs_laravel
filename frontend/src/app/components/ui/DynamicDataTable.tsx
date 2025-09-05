"use client";
import { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import ExportButtons from "./ExportButton";
import { usePaginatedData } from "@/app/hooks/usePaginatedData";

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
  onDataLoaded?: (data: T[], totalRows: number) => void; // New prop
  externalData?: T[]; // New prop for external data
  externalTotalRows?: number; // New prop for external total rows
}

const DynamicDataTable = <T extends any>({
  apiEndpoint,
  columns,
  searchPlaceholder = "Search...",
  exportColumns,
  exportFileName = "export",
  paginationRowsPerPageOptions = [5, 10, 25, 50, 100],
  defaultPerPage = 10,
  onDataLoaded, // Destructure new prop
  externalData, // Destructure new prop
  externalTotalRows, // Destructure new prop
}: Props<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [useExternalData, setUseExternalData] = useState(false);

  const { data, loading, totalRows, error } = usePaginatedData<T>({
    apiEndpoint,
    searchTerm,
    perPage,
    currentPage,
  });

  // Determine which data to use
  const displayData = useExternalData && externalData ? externalData : data;
  const displayTotalRows = useExternalData && externalTotalRows !== undefined ? externalTotalRows : totalRows;

  // Notify parent when data is loaded (only for API data)
  useEffect(() => {
    if (onDataLoaded && !useExternalData && data.length > 0) {
      onDataLoaded(data, totalRows);
    }
  }, [data, totalRows, onDataLoaded, useExternalData]);

  // Switch to external data when it's provided
  useEffect(() => {
    if (externalData && externalData.length > 0) {
      setUseExternalData(true);
    } else {
      setUseExternalData(false);
    }
  }, [externalData]);

  return (
    <div>
      {error && (
        <div className="mb-2 p-2 text-sm text-red-600 bg-red-100 rounded">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={displayData}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={displayTotalRows}
        paginationPerPage={perPage}
        paginationRowsPerPageOptions={paginationRowsPerPageOptions}
        onChangeRowsPerPage={(newPerPage) => {
          setPerPage(newPerPage);
          setCurrentPage(1);
          setUseExternalData(false); // Switch back to API data when changing pages
        }}
        onChangePage={(page) => {
          setCurrentPage(page);
          setUseExternalData(false); // Switch back to API data when changing pages
        }}
        highlightOnHover
        pointerOnHover
        subHeader
        subHeaderComponent={
          <div className="flex flex-col sm:flex-row justify-between items-center w-full space-y-2 sm:space-y-0">
            {exportColumns && (
              <ExportButtons
                data={displayData}
                fileName={exportFileName}
                columns={exportColumns}
              />
            )}
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="px-2 py-1 border rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
                setUseExternalData(false); // Switch back to API data when searching
              }}
            />
          </div>
        }
      />
    </div>
  );
};

export default DynamicDataTable;