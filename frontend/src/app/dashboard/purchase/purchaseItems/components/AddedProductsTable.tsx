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
}

export default function AddedProductsTable({ products, onRemoveProduct }: AddedProductsTableProps) {
  return (
    <fieldset className="border p-4 mt-4 max-h-96 overflow-auto">
      <legend className="font-bold">Added List</legend>
      <table className="w-full text-sm border-collapse border">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 border w-[3%]">SL</th>
            <th className="p-2 border w-[6%]">Location</th>
            <th className="p-2 border w-[10%]">Product Name</th>
            <th className="p-2 border w-[6%]">Part Number</th>
            <th className="p-2 border w-[6%]">Unit</th>
            <th className="p-2 border w-[6%]">Qty</th>
            <th className="p-2 border w-[6%]">Unit Price</th>
            <th className="p-2 border w-[6%]">PER KG</th>
            <th className="p-2 border w-[6%]">Sell Price</th>
            <th className="p-2 border w-[7%]">Total Unit Price</th>
            <th className="p-2 border w-[7%]">Total Product Price</th>
            <th className="p-2 border w-[7%]">Weight Unit</th>
            <th className="p-2 border w-[7%]">Total Weight</th>
            <th className="p-2 border w-[7%]">Total Weight Amount</th>
            <th className="p-2 border w-[7%]">Total Purchase Price</th>
            <th className="p-2 border w-[6%]">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id} className="cartList">
              <td className="p-2 border text-center">{index + 1}</td>
              <td className="p-2 border">{product.location_name}</td>
              <td className="p-2 border">{product.model_name}</td>
              <td className="p-2 border">{product.code}</td>
              <td className="p-2 border text-center">{product.unit}</td>
              <td className="p-2 border text-center">{product.order_qty}</td>
              <td className="p-2 border text-right">{parseFloat(product.purchase_price).toFixed(2)}</td>
              <td className="p-2 border text-right">{parseFloat(product.weight_unit_price).toFixed(2)}</td>
              <td className="p-2 border text-right">{parseFloat(product.sell_price).toFixed(2)}</td>
              <td className="p-2 border text-right bg-gray-100">{parseFloat(product.total_product_unit_price).toFixed(2)}</td>
              <td className="p-2 border text-right bg-gray-100">{parseFloat(product.total_product_price).toFixed(2)}</td>
              <td className="p-2 border text-right">{parseFloat(product.weight_unit_qty).toFixed(2)}</td>
              <td className="p-2 border text-right">{parseFloat(product.total_weight).toFixed(2)}</td>
              <td className="p-2 border text-right bg-gray-100">{parseFloat(product.total_weight_amount).toFixed(2)}</td>
              <td className="p-2 border text-right bg-gray-100">{parseFloat(product.total_purchase_price).toFixed(2)}</td>
              <td className="p-2 border text-center">
                <button
                  type="button"
                  onClick={() => onRemoveProduct(product.id)}
                  className="p-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  title="Remove"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={16} className="p-4 text-center text-gray-500">
                No products added yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </fieldset>
  );
}