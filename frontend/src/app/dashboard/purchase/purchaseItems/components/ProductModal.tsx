import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  code: string;
  sell_price: string;
  purchase_price: string;
  weight: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect: (product: Product) => void;
}

export default function ProductModal({ isOpen, onClose, onProductSelect }: ProductModalProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const searchProducts = async (term: string): Promise<void> => {
    if (term.length < 2) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/products/search?q=${term}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product: Product): void => {
    onProductSelect(product);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-auto">
        <h2 className="text-lg font-bold mb-4">Add Product</h2>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            searchProducts(e.target.value);
          }}
          placeholder="Search products..."
          className="w-full p-2 border rounded mb-4"
        />
        
        {loading && <div className="text-center">Loading...</div>}
        
        <div className="space-y-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => handleProductSelect(product)}
            >
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-gray-600">Code: {product.code}</div>
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