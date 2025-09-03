"use client";

import React from 'react';
import { FaFileExcel, FaFileCsv, FaFilePdf, FaCopy, FaPrint } from 'react-icons/fa';
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

  // Format data for text-based exports (CSV, Copy)
  const formatDataForExport = () => {
    const headers = columns.map(col => col.name || '');
    const rows = data.map(item =>
      columns.map(col => {
        const value = col.selector ? getNestedValue(item, col.selector) : '';
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
      })
    );
    
    return { headers, rows };
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    try {
      if (!data || data.length === 0) throw new Error('No data available to copy');

      const { headers, rows } = formatDataForExport();
      
      // Create tab-separated text
      const textData = [headers, ...rows]
        .map(row => row.join('\t'))
        .join('\n');

      // Use the Clipboard API
      navigator.clipboard.writeText(textData)
        .then(() => {
          // Show success feedback
          const buttons = document.querySelectorAll('.copy-button');
          buttons.forEach(button => {
            button.classList.add('bg-green-100');
            setTimeout(() => {
              button.classList.remove('bg-green-100');
            }, 1000);
          });
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          alert('Failed to copy to clipboard. Please try again.');
        });
    } catch (error: any) {
      console.error('Copy Error:', error);
      alert(`Failed to copy: ${error.message}`);
    }
  };

  // Print data
  const printData = () => {
    try {
      if (!data || data.length === 0) throw new Error('No data available to print');

      const { headers, rows } = formatDataForExport();
      
      // Create a printable HTML table
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Popup blocked. Please allow popups for this site to print.');
        return;
      }

      const tableRows = rows.map(row => 
        `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
      ).join('');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${fileName}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
              @media print {
                body { margin: 0; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <h1>${fileName}</h1>
            <button onclick="window.print()" style="margin-bottom: 20px; padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print
            </button>
            <table>
              <thead>
                <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </body>
        </html>
      `);
      
      printWindow.document.close();
    } catch (error: any) {
      console.error('Print Error:', error);
      alert(`Failed to print: ${error.message}`);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    try {
      if (!data || data.length === 0) throw new Error('No data available to export');

      const { headers, rows } = formatDataForExport();

      const csvContent = [headers, ...rows]
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

      const { headers, rows } = formatDataForExport();

      autoTable(doc, {
        head: [headers],
        body: rows,
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
        onClick={copyToClipboard}
        className="copy-button flex items-center justify-center p-2 text-gray-600 bg-gray-50 rounded-full hover:bg-purple-50 transition-colors duration-200 group relative"
        title="Copy to Clipboard"
      >
        <FaCopy className="text-gray-500 group-hover:text-purple-600" />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Copy
        </span>
      </button>

      <button
        onClick={printData}
        className="flex items-center justify-center p-2 text-gray-600 bg-gray-50 rounded-full hover:bg-yellow-50 transition-colors duration-200 group relative"
        title="Print"
      >
        <FaPrint className="text-gray-500 group-hover:text-yellow-600" />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Print
        </span>
      </button>

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