"use client";

import React from "react";
import { FaFileExcel, FaFileCsv, FaFilePdf, FaCopy, FaPrint } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Column<T> = {
  name: string;
  selector?: keyof T | ((row: T) => any);
};

type ExportButtonsProps<T> = {
  data?: T[];
  columns?: Column<T>[];
  fileName?: string;
  fetchAllData?: () => Promise<T[]>; // optional fetch all
};

function ExportButtons<T>({
  data = [],
  columns = [],
  fileName = "data",
  fetchAllData,
}: ExportButtonsProps<T>) {
  const getNestedValue = (obj: T, selector?: keyof T | ((row: T) => any)) => {
    if (!selector) return "";
    if (typeof selector === "function") {
      try {
        return selector(obj);
      } catch {
        return "";
      }
    }
    if (typeof selector === "string") {
      return (obj as any)[selector] ?? "";
    }
    return "";
  };

  const formatData = (exportData: T[]) => {
    const headers = columns.map((col) => col.name || "");
    const rows = exportData.map((item) =>
      columns.map((col) => {
        const value = col.selector ? getNestedValue(item, col.selector) : "";
        if (value === null || value === undefined) return "";
        if (typeof value === "object") return JSON.stringify(value);
        return String(value);
      })
    );
    return { headers, rows };
  };

  const handleExport = async (type: "excel" | "csv" | "pdf" | "copy" | "print", all = false) => {
    let exportData = data;

    if (all && fetchAllData) {
      try {
        exportData = await fetchAllData();
      } catch (err) {
        console.error("Failed to fetch all data", err);
        alert("Failed to fetch all data");
        return;
      }
    }

    if (!exportData || exportData.length === 0) {
      alert("No data available to export");
      return;
    }

    const { headers, rows } = formatData(exportData);

    switch (type) {
      case "excel":
        exportToExcel(exportData);
        break;
      case "csv":
        exportToCSV(headers, rows);
        break;
      case "pdf":
        exportToPDF(headers, rows);
        break;
      case "copy":
        copyToClipboard(headers, rows);
        break;
      case "print":
        printData(headers, rows);
        break;
    }
  };

  const exportToExcel = (exportData: T[]) => {
    const excelData = exportData.map((item) => {
      const row: Record<string, any> = {};
      columns.forEach((col) => {
        const value = col.selector ? getNestedValue(item, col.selector) : "";
        row[col.name || ""] =
          value !== null && value !== undefined
            ? typeof value === "object"
              ? JSON.stringify(value)
              : value
            : "";
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportToCSV = (headers: string[], rows: string[][]) => {
    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field.replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
  };

  const exportToPDF = (headers: string[], rows: string[][]) => {
    const doc = new jsPDF();
    doc.text(`${fileName} List`, 14, 16);
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20,
      styles: { cellPadding: 2, fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
    });
    doc.save(`${fileName}.pdf`);
  };

  const copyToClipboard = (headers: string[], rows: string[][]) => {
    const textData = [headers, ...rows].map((row) => row.join("\t")).join("\n");
    navigator.clipboard.writeText(textData).catch(console.error);
    alert("Copied to clipboard");
  };

  const printData = (headers: string[], rows: string[][]) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const tableRows = rows
      .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>${fileName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>${fileName}</h1>
          <table>
            <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const renderButton = (icon: React.ReactNode, onClick: () => void, title: string, colorClass: string) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center p-2 text-gray-600 bg-gray-50 rounded-full hover:${colorClass} transition-colors duration-200 group relative`}
      title={title}
    >
      {icon}
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {title}
      </span>
    </button>
  );

  return (
    <div className="flex space-x-2 flex-wrap">
      
      {/* All data buttons */}
      {fetchAllData ? (
        <>
          {renderButton(<FaCopy className="text-gray-500 group-hover:text-purple-600" />, () => handleExport("copy", true), "Copy All", "bg-purple-50")}
          {renderButton(<FaPrint className="text-gray-500 group-hover:text-yellow-600" />, () => handleExport("print", true), "Print All", "bg-yellow-50")}
          {renderButton(<FaFileExcel className="text-gray-500 group-hover:text-green-600" />, () => handleExport("excel", true), "Excel All", "bg-green-50")}
          {renderButton(<FaFileCsv className="text-gray-500 group-hover:text-blue-600" />, () => handleExport("csv", true), "CSV All", "bg-blue-50")}
          {renderButton(<FaFilePdf className="text-gray-500 group-hover:text-red-600" />, () => handleExport("pdf", true), "PDF All", "bg-red-50")}
        </>
      ):(
        <>   
        {/* Current page buttons */}
      {renderButton(<FaCopy className="text-gray-500 group-hover:text-purple-600" />, () => handleExport("copy"), "Copy Page", "bg-purple-50")}
      {renderButton(<FaPrint className="text-gray-500 group-hover:text-yellow-600" />, () => handleExport("print"), "Print Page", "bg-yellow-50")}
      {renderButton(<FaFileExcel className="text-gray-500 group-hover:text-green-600" />, () => handleExport("excel"), "Excel Page", "bg-green-50")}
      {renderButton(<FaFileCsv className="text-gray-500 group-hover:text-blue-600" />, () => handleExport("csv"), "CSV Page", "bg-blue-50")}
      {renderButton(<FaFilePdf className="text-gray-500 group-hover:text-red-600" />, () => handleExport("pdf"), "PDF Page", "bg-red-50")}
        </>
      )
      
      }
    </div>
  );
}

export default ExportButtons;
