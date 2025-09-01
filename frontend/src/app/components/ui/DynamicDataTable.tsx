"use client";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import ExportButtons from "./ExportButton";
import { api } from "@/app/lib/api";

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
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(apiEndpoint, {
        params: {
          search: searchTerm,
          page: currentPage,
          per_page: perPage,
        },
      });

      // Update data
      setData(res.data.data);
      setTotalRows(res.data.total);

      // Update perPage dynamically from API
      if (res.data.per_page && res.data.per_page !== perPage) {
        setPerPage(res.data.per_page);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, currentPage, perPage]);

  return (
    <DataTable
      columns={columns}
      data={data}
      progressPending={loading}
      pagination
      paginationServer={true}
      paginationTotalRows={totalRows}
      paginationPerPage={perPage}
      paginationRowsPerPageOptions={paginationRowsPerPageOptions}
      onChangeRowsPerPage={(newPerPage) => {
        setPerPage(newPerPage);
        setCurrentPage(1); // reset to first page
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
              setCurrentPage(1); // reset to first page on search
            }}
          />
        </div>
      }
    />
  );
};

export default DynamicDataTable;
