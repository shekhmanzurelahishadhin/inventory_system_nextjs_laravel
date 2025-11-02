import { useEffect } from 'react';

interface FormData {
  po_no: string;
  issue_date: string;
  cash_due: string;
  local_import: string;
  store_id: string;
  location_id: string;
  unit_id: string;
  ship_by: string;
  supplier_id: string;
  payment_type: string;
  payment_amount: string;
  ref_no: string;
  grand_total: number;
  company_id: string;
}

interface CurrentProduct {
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
}

interface ProductInformationProps {
  currentProduct: CurrentProduct;
  formData: FormData;
  onProductChange: (field: keyof CurrentProduct, value: string) => void;
  onInputChange: (field: keyof FormData, value: string) => void;
  onAddProduct: () => void;
  onOpenModal: (modal: string) => void;
}

export default function ProductInformation({ 
  currentProduct, 
  formData, 
  onProductChange, 
  onInputChange, 
  onAddProduct, 
  onOpenModal 
}: ProductInformationProps) {
  
  useEffect(() => {
    calculateProductTotals();
  }, [currentProduct.order_qty, currentProduct.purchase_price, currentProduct.weight_unit_price, currentProduct.weight_unit_qty]);

  const calculateProductTotals = (): void => {
    const order_qty = parseFloat(currentProduct.order_qty) || 0;
    const purchase_price = parseFloat(currentProduct.purchase_price) || 0;
    const weight_unit_qty = parseFloat(currentProduct.weight_unit_qty) || 0;
    const weight_unit_price = parseFloat(currentProduct.weight_unit_price) || 0;

    const total_product_price = order_qty * purchase_price;
    const total_weight_amount = order_qty * weight_unit_qty * weight_unit_price;
    const totalWeight = order_qty * weight_unit_qty;
    const total_purchase_price = total_product_price + total_weight_amount;
    const total_product_unit_price = order_qty > 0 ? total_purchase_price / order_qty : 0;

    onProductChange('total_product_unit_price', total_product_unit_price.toFixed(2));
    onProductChange('total_weight_amount', total_weight_amount.toFixed(2));
    onProductChange('total_weight', totalWeight.toFixed(2));
    onProductChange('total_purchase_price', total_purchase_price.toFixed(2));
    onProductChange('total_product_price', total_product_price.toFixed(2));
  };

  return (
    <fieldset className="border p-4 mt-4">
      <legend className="font-bold">Product Information</legend>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-[12px]">
            <th className="p-2 border w-[8%]">Location</th>
            <th className="p-2 border w-[8%]">Product Name</th>
            <th className="p-2 border w-[6%]">Part Number</th>
            <th className="p-2 border w-[6%]">Unit</th>
            <th className="p-2 border w-[8%]">Qty</th>
            <th className="p-2 border w-[6%]">Unit Price</th>
            <th className="p-2 border w-[6%]">PER KG</th>
            <th className="p-2 border w-[6%]">SP</th>
            <th className="p-2 border w-[8%]">Total Unit Price</th>
            <th className="p-2 border w-[8%]">Total Product Price</th>
            <th className="p-2 border w-[8%]">Weight Unit</th>
            <th className="p-2 border w-[8%]">Total Weight</th>
            <th className="p-2 border w-[8%]">Total Weight Amount</th>
            <th className="p-2 border w-[8%]">Total Purchase Price</th>
            <th className="p-2 border w-[6%]">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-1 border">
              <select
                value={formData.location_id}
                onChange={(e) => onInputChange('location_id', e.target.value)}
                className="w-full p-1 border rounded text-sm"
              >
                <option value="">Select</option>
              </select>
            </td>
            <td className="p-1 border">
              <div className="flex items-center">
                <input
                  type="text"
                  value={currentProduct.model_name || ''}
                  readOnly
                  className="flex-1 p-1 border rounded text-sm bg-gray-100"
                  placeholder="Select product"
                />
              </div>
            </td>
            <td className="p-1 border">
              <input
                type="text"
                value={currentProduct.code}
                onChange={(e) => onProductChange('code', e.target.value)}
                className="w-full p-1 border rounded text-sm"
              />
            </td>
            <td className="p-1 border text-center">
              <span className="text-sm">
                 <select
                value={formData.unit_id}
                onChange={(e) => onInputChange('unit_id', e.target.value)}
                className="w-full p-1 border rounded text-sm"
              >
                <option value="">Select</option>
              </select>
              </span>
            </td>
            <td className="p-1 border">
              <input
                type="number"
                value={currentProduct.order_qty}
                onChange={(e) => onProductChange('order_qty', e.target.value)}
                className="w-full p-1 border rounded text-sm"
                step="1"
              />
            </td>
            <td className="p-1 border">
              <input
                type="number"
                value={currentProduct.purchase_price}
                onChange={(e) => onProductChange('purchase_price', e.target.value)}
                className="w-full p-1 border rounded text-sm"
                step="0.01"
              />
            </td>
            <td className="p-1 border">
              <input
                type="number"
                value={currentProduct.weight_unit_price}
                onChange={(e) => onProductChange('weight_unit_price', e.target.value)}
                readOnly={formData.local_import === '54'}
                className="w-full p-1 border rounded text-sm"
                step="0.01"
              />
            </td>
            <td className="p-1 border">
              <input
                type="number"
                value={currentProduct.sell_price}
                onChange={(e) => onProductChange('sell_price', e.target.value)}
                className="w-full p-1 border rounded text-sm bg-gray-100"
                step="0.01"
              />
            </td>
            <td className="p-1 border">
              <input
                type="text"
                value={currentProduct.total_product_unit_price}
                readOnly
                className="w-full p-1 border rounded text-sm bg-gray-100"
              />
            </td>
            <td className="p-1 border">
              <input
                type="text"
                value={currentProduct.total_product_price}
                readOnly
                className="w-full p-1 border rounded text-sm bg-gray-100"
              />
            </td>
            <td className="p-1 border">
              <input
                type="number"
                value={currentProduct.weight_unit_qty}
                readOnly
                className="w-full p-1 border rounded text-sm bg-gray-100"
              />
            </td>
            <td className="p-1 border">
              <input
                type="text"
                value={currentProduct.total_weight}
                readOnly
                className="w-full p-1 border rounded text-sm bg-gray-100"
              />
            </td>
            <td className="p-1 border">
              <input
                type="text"
                value={currentProduct.total_weight_amount}
                readOnly
                className="w-full p-1 border rounded text-sm bg-gray-100"
              />
            </td>
            <td className="p-1 border">
              <input
                type="text"
                value={currentProduct.total_purchase_price}
                readOnly
                className="w-full p-1 border rounded text-sm bg-gray-100"
              />
            </td>
            <td className="p-1 border">
              <button
                type="button"
                onClick={onAddProduct}
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
                title="Add"
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>
  );
}