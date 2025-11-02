import { useState, useEffect } from 'react';

interface ShipMethod {
  id: string;
  ship_by: string;
}

interface ShipByModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShipBySelect: (shipMethod: ShipMethod) => void;
}

export default function ShipByModal({ isOpen, onClose, onShipBySelect }: ShipByModalProps) {
  const [shipMethods, setShipMethods] = useState<ShipMethod[]>([]);
  const [newShipMethod, setNewShipMethod] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadShipMethods();
    }
  }, [isOpen]);

  const loadShipMethods = async (): Promise<void> => {
    try {
      const response = await fetch('/api/ship-by');
      const data = await response.json();
      setShipMethods(data);
    } catch (error) {
      console.error('Error loading ship methods:', error);
    }
  };

  const addShipMethod = async (): Promise<void> => {
    if (!newShipMethod.trim()) return;
    
    try {
      const response = await fetch('/api/ship-by', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ship_by: newShipMethod }),
      });
      
      if (response.ok) {
        const newMethod = await response.json();
        onShipBySelect(newMethod);
        onClose();
      }
    } catch (error) {
      console.error('Error adding ship method:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Add Ship By</h2>
        
        <div className="mb-4">
          <input
            type="text"
            value={newShipMethod}
            onChange={(e) => setNewShipMethod(e.target.value)}
            placeholder="Enter shipping method"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={addShipMethod}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        
        <div className="flex justify-end">
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