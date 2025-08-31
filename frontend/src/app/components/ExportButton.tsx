"use client";

import React from 'react';
import { FaFileExcel, FaFileCsv, FaFilePdf } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type Column<T> = {
  name: string;
  selector?: keyof T | ((row: T) => any);
};

type ExportButtonsProps<T> = {
  data?: T[];
  fileName?: string;
  columns?: Column<T>[];
};

function ExportButtons<T>({ data = [], fileName = 'data', columns = [] }: ExportButtonsProps<T>) {
  // Helper function to safely get nested values
  const getNestedValue = (obj: T, selector?: keyof T | ((row: T) => any)) => {
    if (!selector) return '';

    if (typeof selector === 'function') {
      try {
        return selector(obj);
      } catch {
        return '';
      }
    }

    if (typeof selector === 'string') {
      return (obj as any)[selector] ?? '';
    }

    return '';
  };

  // Export to CSV
  const exportToCSV = () => {
    try {
      if (!data || data.length === 0) throw new Error('No data available to export');

      const headers = columns.map(col => col.name || '');
      const csvData = data.map(item =>
        columns.map(col => {
          const value = col.selector ? getNestedValue(item, col.selector) : '';
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value);
        })
      );

      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.csv`;
      link.click();
    } catch (error: any) {
      console.error('CSV Export Error:', error);
      alert(`Failed to export CSV: ${error.message}`);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    try {
      if (!data || data.length === 0) throw new Error('No data available to export');

      const excelData = data.map(item => {
        const row: Record<string, any> = {};
        columns.forEach(col => {
          const value = col.selector ? getNestedValue(item, col.selector) : '';
          row[col.name || ''] = value !== null && value !== undefined
            ? (typeof value === 'object' ? JSON.stringify(value) : value)
            : '';
        });
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch (error: any) {
      console.error('Excel Export Error:', error);
      alert(`Failed to export Excel: ${error.message}`);
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      if (!data || data.length === 0) throw new Error('No data available to export');

      const doc = new jsPDF();
      doc.text(`${fileName} List`, 14, 16);

      const headers = columns.map(col => col.name || '');
      const pdfData = data.map(item =>
        columns.map(col => {
          const value = col.selector ? getNestedValue(item, col.selector) : '';
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value);
        })
      );

      autoTable(doc, {
        head: [headers],
        body: pdfData,
        startY: 20,
        styles: {
          cellPadding: 2,
          fontSize: 10,
          valign: 'middle',
          halign: 'left',
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
      });

      doc.save(`${fileName}.pdf`);
    } catch (error: any) {
      console.error('PDF Export Error:', error);
      alert(`Failed to export PDF: ${error.message}`);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={exportToExcel}
        className="flex items-center justify-center p-2 text-gray-600 bg-gray-50 rounded-full hover:bg-green-50 transition-colors duration-200 group relative"
        title="Export to Excel"
      >
        <FaFileExcel className="text-gray-500 group-hover:text-green-600" />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Excel
        </span>
      </button>

      <button
        onClick={exportToCSV}
        className="flex items-center justify-center p-2 text-gray-600 bg-gray-50 rounded-full hover:bg-blue-50 transition-colors duration-200 group relative"
        title="Export to CSV"
      >
        <FaFileCsv className="text-gray-500 group-hover:text-blue-600" />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          CSV
        </span>
      </button>

      <button
        onClick={exportToPDF}
        className="flex items-center justify-center p-2 text-gray-600 bg-gray-50 rounded-full hover:bg-red-50 transition-colors duration-200 group relative"
        title="Export to PDF"
      >
        <FaFilePdf className="text-gray-500 group-hover:text-red-600" />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          PDF
        </span>
      </button>
    </div>
  );
}

export default ExportButtons;
