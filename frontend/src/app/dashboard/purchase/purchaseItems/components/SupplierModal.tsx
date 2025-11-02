import { useState } from 'react';

interface Supplier {
  id: string;
  company_name: string;
  mobile: string;
  due_amount: number;
}

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSupplierSelect: (supplier: Supplier) => void;
}

export default function SupplierModal({ isOpen, onClose, onSupplierSelect }: SupplierModalProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const searchSuppliers = async (term: string): Promise<void> => {
    if (term.length < 2) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/suppliers/search?q=${term}`);
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error searching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSupplierSelect = (supplier: Supplier): void => {
    onSupplierSelect(supplier);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-auto">
        <h2 className="text-lg font-bold mb-4">Add Supplier</h2>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            searchSuppliers(e.target.value);
          }}
          placeholder="Search suppliers..."
          className="w-full p-2 border rounded mb-4"
        />
        
        {loading && <div className="text-center">Loading...</div>}
        
        <div className="space-y-2">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSupplierSelect(supplier)}
            >
              <div className="font-medium">{supplier.company_name}</div>
              <div className="text-sm text-gray-600">Mobile: {supplier.mobile}</div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}