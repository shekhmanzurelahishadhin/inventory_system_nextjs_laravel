interface Product {
  id: number;
  model_id: string;
  model_name?: string;
  code: string;
  order_qty: string;
  purchase_price: string;
  weight_unit_price: string;
  sell_price: string;
  weight_unit_qty: string;
  total_product_unit_price: string;
  total_product_price: string;
  total_weight: string;
  total_weight_amount: string;
  total_purchase_price: string;
  location_name?: string;
  unit?: string;
}

interface AddedProductsTableProps {
  products: Product[];
  onRemoveProduct: (id: number) => void;
  isMobile: boolean;
}

export default function AddedProductsTable({ products, onRemoveProduct, isMobile }: AddedProductsTableProps) {
  if (isMobile) {
    return (
      <fieldset className="border p-3 md:p-4 rounded-lg">
        <legend className="font-bold text-sm md:text-base px-2">
          ADDED PRODUCTS ({products.length})
        </legend>

        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No products added yet
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product, index) => (
              <div key={product.id} className="border rounded-lg p-3 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm">#{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveProduct(product.id)}
                    className="p-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                    title="Remove"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Product:</span>
                      <div className="text-gray-600 truncate">{product.model_name || '-'}</div>
                    </div>
                    <div>
                      <span className="font-medium">Part No:</span>
                      <div className="text-gray-600">{product.code || '-'}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Qty:</span>
                      <div className="text-gray-600">{product.order_qty} {product.unit || ''}</div>
                    </div>
                    <div>
                      <span className="font-medium">Unit Price:</span>
                      <div className="text-gray-600">{parseFloat(product.purchase_price || '0').toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">PER KG:</span>
                      <div className="text-gray-600">{parseFloat(product.weight_unit_price || '0').toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="font-medium">SP:</span>
                      <div className="text-gray-600">{parseFloat(product.sell_price || '0').toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-medium text-green-600">Total Price:</span>
                        <div className="text-green-600 font-bold">
                          {parseFloat(product.total_purchase_price || '0').toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Location:</span>
                        <div className="text-gray-600">{product.location_name || '-'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </fieldset>
    );
  }

  return (
    <fieldset className="border p-3 md:p-4 rounded-lg">
      <legend className="font-bold text-sm md:text-base px-2">
        ADDED PRODUCTS ({products.length})
      </legend>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px] md:text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-1 md:p-2 border w-[3%]">SL</th>
              <th className="p-1 md:p-2 border w-[6%]">Location</th>
              <th className="p-1 md:p-2 border w-[10%]">Product Name</th>
              <th className="p-1 md:p-2 border w-[6%]">Part Number</th>
              <th className="p-1 md:p-2 border w-[6%]">Unit</th>
              <th className="p-1 md:p-2 border w-[6%]">Qty</th>
              <th className="p-1 md:p-2 border w-[6%]">Unit Price</th>
              <th className="p-1 md:p-2 border w-[6%]">PER KG</th>
              <th className="p-1 md:p-2 border w-[6%]">SP</th>
              <th className="p-1 md:p-2 border w-[7%]">Total Unit Price</th>
              <th className="p-1 md:p-2 border w-[7%]">Total Product Price</th>
              <th className="p-1 md:p-2 border w-[7%]">Weight Unit</th>
              <th className="p-1 md:p-2 border w-[7%]">Total Weight</th>
              <th className="p-1 md:p-2 border w-[7%]">Total Weight Amount</th>
              <th className="p-1 md:p-2 border w-[7%]">Total Purchase Price</th>
              <th className="p-1 md:p-2 border w-[6%]">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-1 md:p-2 border text-center">{index + 1}</td>
                <td className="p-1 md:p-2 border">{product.location_name || '-'}</td>
                <td className="p-1 md:p-2 border">{product.model_name || '-'}</td>
                <td className="p-1 md:p-2 border">{product.code || '-'}</td>
                <td className="p-1 md:p-2 border text-center">{product.unit || '-'}</td>
                <td className="p-1 md:p-2 border text-center">{product.order_qty}</td>
                <td className="p-1 md:p-2 border text-right">{parseFloat(product.purchase_price || '0').toFixed(2)}</td>
                <td className="p-1 md:p-2 border text-right">{parseFloat(product.weight_unit_price || '0').toFixed(2)}</td>
                <td className="p-1 md:p-2 border text-right">{parseFloat(product.sell_price || '0').toFixed(2)}</td>
                <td className="p-1 md:p-2 border text-right bg-gray-100">{parseFloat(product.total_product_unit_price || '0').toFixed(2)}</td>
                <td className="p-1 md:p-2 border text-right bg-gray-100">{parseFloat(product.total_product_price || '0').toFixed(2)}</td>
                <td className="p-1 md:p-2 border text-right">{parseFloat(product.weight_unit_qty || '0').toFixed(2)}</td>
                <td className="p-1 md:p-2 border text-right">{parseFloat(product.total_weight || '0').toFixed(2)}</td>
                <td className="p-1 md:p-2 border text-right bg-gray-100">{parseFloat(product.total_weight_amount || '0').toFixed(2)}</td>
                <td className="p-1 md:p-2 border text-right bg-gray-100 font-medium text-green-600">
                  {parseFloat(product.total_purchase_price || '0').toFixed(2)}
                </td>
                <td className="p-1 md:p-2 border text-center">
                  <button
                    type="button"
                    onClick={() => onRemoveProduct(product.id)}
                    className="p-1 bg-red-500 text-white rounded text-[10px] md:text-xs hover:bg-red-600"
                    title="Remove"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={16} className="p-4 text-center text-gray-500 text-sm">
                  No products added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </fieldset>
  );
}