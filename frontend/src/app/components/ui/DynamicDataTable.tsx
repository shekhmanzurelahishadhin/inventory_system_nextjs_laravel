"use client";
import { useState, useEffect } from "react"; // Add useEffect import
import DataTable, { TableColumn } from "react-data-table-component";
import ExportButtons from "./ExportButton";
import { usePaginatedData } from "@/app/hooks/usePaginatedData";
import Preloader from "./Preloader";
import DatatableLoader from "./DatatableLoader";
import { api } from "@/app/lib/api";
import FilterAccordion from "./FilterAccordion";

interface ExportColumn<T> {
  name: string;
  selector: keyof T;
}
interface FilterField {
  name: string;
  label: string;
  type: "text" | "select" | "date";
  options?: { value: string | number; label: string }[];
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
   allowExportAll?: boolean; //allow export all data
   filterFields?: FilterField[]; // New prop for filter fields
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
  allowExportAll = false,
  filterFields = [],
}: Props<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data, loading, totalRows, error, refetch } = usePaginatedData<T>({
    apiEndpoint,
    searchTerm,
    perPage,
    currentPage,
    filters,
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
    refetch();
  }, [filters]);

  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange(currentPage, perPage);
    }
  }, [currentPage, perPage]);

 const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };
  
// inside DynamicDataTable component
const fetchAllData = async (): Promise<T[]> => {
  try {
    // no params sent at all (backend returns all)
    const response = await api.get(apiEndpoint);
    // handle both paginate & non-paginate responses
    return response.data.data ?? response.data;
  } catch (error) {
    console.error("Failed to fetch all data", error);
    return [];
  }
};

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#8371f5ff", // light gray
      color: "#ffffffff", // dark text
      fontWeight: "600",
      fontSize: "14px",
      marginTop: "20px",
      padding: "15px",
    },
  },
  header: {
    style: {
      backgroundColor: "#8371f5ff", // optional for overall header area
    },
  },
};


  return (
    <div>
      {error && (
        <div className="mb-2 p-2 text-sm text-red-600 bg-red-100 rounded">
          {error}
        </div>
      )}
      <div className="relative">
         {(data.length === 0 && !loading) && <DatatableLoader />}
        <DataTable
          columns={columns}
          data={data}
          // progressPending={loading}
           customStyles={customStyles}
          pagination // Enable pagination
          paginationServer // Server-side pagination
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
            <div className="flex flex-col w-full space-y-2">
              <div className="flex flex-col sm:flex-row justify-between items-center w-full space-y-2 sm:space-y-0">
                {exportColumns && (
                  <ExportButtons
                    data={data}
                    fileName={exportFileName}
                    columns={exportColumns}
                    fetchAllData={allowExportAll ? fetchAllData : undefined}
                  />
                )}
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="px-2 py-2 border border-gray-300 rounded-md w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* ✅ Accordion Filters */}
              {filterFields.length > 0 && (
                <FilterAccordion
                  fields={filterFields}
                  values={filters}
                  onChange={handleFilterChange}
                />
              )}
            </div>
          }
        />
        {loading && (<DatatableLoader />)}
      </div>
    </div>
  );
};

export default DynamicDataTable;