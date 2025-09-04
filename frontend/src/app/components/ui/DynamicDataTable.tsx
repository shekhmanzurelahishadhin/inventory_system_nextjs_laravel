// components/ui/DynamicDataTable.tsx
"use client";
import { useState } from "react";
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
}

const DynamicDataTable = <T extends any>({
  apiEndpoint,
  columns,
  searchPlaceholder = "Search...",
  exportColumns,
  exportFileName = "export",
  paginationRowsPerPageOptions = [5, 10, 25, 50, 100],
  defaultPerPage = 10,
}: Props<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, totalRows, error } = usePaginatedData<T>({
    apiEndpoint,
    searchTerm,
    perPage,
    currentPage,
  });

  return (
    <div>
      {error && (
        <div className="mb-2 p-2 text-sm text-red-600 bg-red-100 rounded">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
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
              className="px-2 py-1 border rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        }
      />
    </div>
  );
};

export default DynamicDataTable;
