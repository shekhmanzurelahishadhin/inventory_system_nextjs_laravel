import { useEffect } from "react";

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
  isMobile: boolean;
}

export default function ProductInformation({
  currentProduct,
  formData,
  onProductChange,
  onInputChange,
  onAddProduct,
  onOpenModal,
  isMobile,
}: ProductInformationProps) {
  useEffect(() => {
    calculateProductTotals();
  }, [
    currentProduct.order_qty,
    currentProduct.purchase_price,
    currentProduct.weight_unit_price,
    currentProduct.weight_unit_qty,
  ]);

  const calculateProductTotals = (): void => {
    const order_qty = parseFloat(currentProduct.order_qty) || 0;
    const purchase_price = parseFloat(currentProduct.purchase_price) || 0;
    const weight_unit_qty = parseFloat(currentProduct.weight_unit_qty) || 0;
    const weight_unit_price = parseFloat(currentProduct.weight_unit_price) || 0;

    const total_product_price = order_qty * purchase_price;
    const total_weight_amount = order_qty * weight_unit_qty * weight_unit_price;
    const totalWeight = order_qty * weight_unit_qty;
    const total_purchase_price = total_product_price + total_weight_amount;
    const total_product_unit_price =
      order_qty > 0 ? total_purchase_price / order_qty : 0;

    onProductChange(
      "total_product_unit_price",
      total_product_unit_price.toFixed(2)
    );
    onProductChange("total_weight_amount", total_weight_amount.toFixed(2));
    onProductChange("total_weight", totalWeight.toFixed(2));
    onProductChange("total_purchase_price", total_purchase_price.toFixed(2));
    onProductChange("total_product_price", total_product_price.toFixed(2));
  };

  if (isMobile) {
    return (
      <fieldset className="border p-3 md:p-4 rounded-lg">
        <legend className="font-bold text-sm md:text-base px-2">ADD PRODUCT</legend>
        
        <div className="space-y-3">
          {/* Location */}
          <div>
            <label className="block text-xs md:text-sm font-medium mb-1">Location</label>
            <select
              value={formData.location_id}
              onChange={(e) => onInputChange("location_id", e.target.value)}
              className="w-full p-2 border rounded text-xs md:text-sm"
            >
              <option value="">Select</option>
            </select>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-xs md:text-sm font-medium mb-1">Product Name</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentProduct.model_name || ""}
                readOnly
                className="flex-1 p-2 border rounded text-xs md:text-sm bg-gray-100"
                placeholder="Select product"
              />
              <button
                type="button"
                onClick={() => onOpenModal('product')}
                className="px-3 bg-blue-500 text-white rounded text-xs md:text-sm"
              >
                Browse
              </button>
            </div>
          </div>

          {/* Part Number & Unit */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs md:text-sm font-medium mb-1">Part No</label>
              <input
                type="text"
                value={currentProduct.code}
                onChange={(e) => onProductChange("code", e.target.value)}
                className="w-full p-2 border rounded text-xs md:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium mb-1">Unit</label>
              <select
                value={formData.unit_id}
                onChange={(e) => onInputChange("unit_id", e.target.value)}
                className="w-full p-2 border rounded text-xs md:text-sm"
              >
                <option value="">Select</option>
              </select>
            </div>
          </div>

          {/* Qty & Unit Price */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs md:text-sm font-medium mb-1">Qty</label>
              <input
                type="number"
                value={currentProduct.order_qty}
                onChange={(e) => onProductChange("order_qty", e.target.value)}
                className="w-full p-2 border rounded text-xs md:text-sm"
                step="1"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium mb-1">Unit Price</label>
              <input
                type="number"
                value={currentProduct.purchase_price}
                onChange={(e) => onProductChange("purchase_price", e.target.value)}
                className="w-full p-2 border rounded text-xs md:text-sm"
                step="0.01"
              />
            </div>
          </div>

          {/* PER KG & SP */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs md:text-sm font-medium mb-1">PER KG</label>
              <input
                type="number"
                value={currentProduct.weight_unit_price}
                onChange={(e) => onProductChange("weight_unit_price", e.target.value)}
                readOnly={formData.local_import === "54"}
                className="w-full p-2 border rounded text-xs md:text-sm"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium mb-1">SP</label>
              <input
                type="number"
                value={currentProduct.sell_price}
                onChange={(e) => onProductChange("sell_price", e.target.value)}
                className="w-full p-2 border rounded text-xs md:text-sm bg-gray-100"
                step="0.01"
              />
            </div>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs md:text-sm font-medium mb-1">Total Unit Price</label>
              <input
                type="text"
                value={currentProduct.total_product_unit_price}
                readOnly
                className="w-full p-2 border rounded text-xs md:text-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium mb-1">Total Product Price</label>
              <input
                type="text"
                value={currentProduct.total_product_price}
                readOnly
                className="w-full p-2 border rounded text-xs md:text-sm bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs md:text-sm font-medium mb-1">Weight Unit</label>
              <input
                type="number"
                value={currentProduct.weight_unit_qty}
                readOnly
                className="w-full p-2 border rounded text-xs md:text-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium mb-1">Total Weight</label>
              <input
                type="text"
                value={currentProduct.total_weight}
                readOnly
                className="w-full p-2 border rounded text-xs md:text-sm bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs md:text-sm font-medium mb-1">Total Weight Amount</label>
              <input
                type="text"
                value={currentProduct.total_weight_amount}
                readOnly
                className="w-full p-2 border rounded text-xs md:text-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium mb-1">Total Purchase Price</label>
              <input
                type="text"
                value={currentProduct.total_purchase_price}
                readOnly
                className="w-full p-2 border rounded text-xs md:text-sm bg-gray-100"
              />
            </div>
          </div>

          {/* Add Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onAddProduct}
              className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 text-sm md:text-base font-medium"
            >
              Add Product to List
            </button>
          </div>
        </div>
      </fieldset>
    );
  }

  return (
    <fieldset className="border p-3 md:p-4 rounded-lg">
      <legend className="font-bold text-sm md:text-base px-2">PRODUCT INFORMATION</legend>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px] md:text-xs lg:text-sm min-w-[900px] border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[12px]">
              <th className="p-1 md:p-2 border w-[8%]">Location</th>
              <th className="p-1 md:p-2 border w-[10%]">Product Name</th>
              <th className="p-1 md:p-2 border w-[6%]">Part No</th>
              <th className="p-1 md:p-2 border w-[6%]">Unit</th>
              <th className="p-1 md:p-2 border w-[6%]">Qty</th>
              <th className="p-1 md:p-2 border w-[6%]">Unit Price</th>
              <th className="p-1 md:p-2 border w-[6%]">PER KG</th>
              <th className="p-1 md:p-2 border w-[6%]">SP</th>
              <th className="p-1 md:p-2 border w-[8%]">Total Unit Price</th>
              <th className="p-1 md:p-2 border w-[8%]">Total Product Price</th>
              <th className="p-1 md:p-2 border w-[8%]">Weight Unit</th>
              <th className="p-1 md:p-2 border w-[8%]">Total Weight</th>
              <th className="p-1 md:p-2 border w-[8%]">Total Weight Amount</th>
              <th className="p-1 md:p-2 border w-[8%]">Total Purchase Price</th>
              <th className="p-1 md:p-2 border w-[6%]">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              {/* Location */}
              <td className="p-1 border">
                <select
                  value={formData.location_id}
                  onChange={(e) => onInputChange("location_id", e.target.value)}
                  className="w-full p-1 border rounded text-[11px] md:text-xs"
                >
                  <option value="">Select</option>
                </select>
              </td>

              {/* Product Name */}
              <td className="p-1 border">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={currentProduct.model_name || ""}
                    readOnly
                    className="flex-1 p-1 border rounded text-[11px] md:text-xs bg-gray-100"
                    placeholder="Select product"
                  />
                 
                </div>
              </td>

              {/* Part Number */}
              <td className="p-1 border">
                <input
                  type="text"
                  value={currentProduct.code}
                  onChange={(e) => onProductChange("code", e.target.value)}
                  className="w-full p-1 border rounded text-[11px] md:text-xs"
                />
              </td>

              {/* Unit */}
              <td className="p-1 border">
                <select
                  value={formData.unit_id}
                  onChange={(e) => onInputChange("unit_id", e.target.value)}
                  className="w-full p-1 border rounded text-[11px] md:text-xs"
                >
                  <option value="">Select</option>
                </select>
              </td>

              {/* Qty */}
              <td className="p-1 border">
                <input
                  type="number"
                  value={currentProduct.order_qty}
                  onChange={(e) => onProductChange("order_qty", e.target.value)}
                  className="w-full p-1 border rounded text-[11px] md:text-xs"
                  step="1"
                />
              </td>

              {/* Unit Price */}
              <td className="p-1 border">
                <input
                  type="number"
                  value={currentProduct.purchase_price}
                  onChange={(e) => onProductChange("purchase_price", e.target.value)}
                  className="w-full p-1 border rounded text-[11px] md:text-xs"
                  step="0.01"
                />
              </td>

              {/* PER KG */}
              <td className="p-1 border">
                <input
                  type="number"
                  value={currentProduct.weight_unit_price}
                  onChange={(e) => onProductChange("weight_unit_price", e.target.value)}
                  readOnly={formData.local_import === "54"}
                  className="w-full p-1 border rounded text-[11px] md:text-xs"
                  step="0.01"
                />
              </td>

              {/* SP */}
              <td className="p-1 border">
                <input
                  type="number"
                  value={currentProduct.sell_price}
                  onChange={(e) => onProductChange("sell_price", e.target.value)}
                  className="w-full p-1 border rounded text-[11px] md:text-xs bg-gray-100"
                  step="0.01"
                />
              </td>

              {/* Total Unit Price */}
              <td className="p-1 border">
                <input
                  type="text"
                  value={currentProduct.total_product_unit_price}
                  readOnly
                  className="w-full p-1 border rounded text-[11px] md:text-xs bg-gray-100"
                />
              </td>

              {/* Total Product Price */}
              <td className="p-1 border">
                <input
                  type="text"
                  value={currentProduct.total_product_price}
                  readOnly
                  className="w-full p-1 border rounded text-[11px] md:text-xs bg-gray-100"
                />
              </td>

              {/* Weight Unit */}
              <td className="p-1 border">
                <input
                  type="number"
                  value={currentProduct.weight_unit_qty}
                  readOnly
                  className="w-full p-1 border rounded text-[11px] md:text-xs bg-gray-100"
                />
              </td>

              {/* Total Weight */}
              <td className="p-1 border">
                <input
                  type="text"
                  value={currentProduct.total_weight}
                  readOnly
                  className="w-full p-1 border rounded text-[11px] md:text-xs bg-gray-100"
                />
              </td>

              {/* Total Weight Amount */}
              <td className="p-1 border">
                <input
                  type="text"
                  value={currentProduct.total_weight_amount}
                  readOnly
                  className="w-full p-1 border rounded text-[11px] md:text-xs bg-gray-100"
                />
              </td>

              {/* Total Purchase Price */}
              <td className="p-1 border">
                <input
                  type="text"
                  value={currentProduct.total_purchase_price}
                  readOnly
                  className="w-full p-1 border rounded text-[11px] md:text-xs bg-gray-100"
                />
              </td>

              {/* Action */}
              <td className="p-1 border text-center">
                <button
                  type="button"
                  onClick={onAddProduct}
                  className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 text-[11px] md:text-xs"
                  title="Add"
                >
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </fieldset>
  );
}