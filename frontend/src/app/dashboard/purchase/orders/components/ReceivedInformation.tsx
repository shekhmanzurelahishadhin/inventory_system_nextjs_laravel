interface FormData {
  po_no: string;
  issue_date: string;
  cash_due: string;
  local_import: string;
  store_id: string;
  location_id: string;
  ship_by: string;
  supplier_id: string;
  payment_type: string;
  payment_amount: string;
  ref_no: string;
  grand_total: number;
  company_id: string;
}

interface SupplierInfo {
  name: string;
  mobile_no: string;
  due_amount: number;
}

interface ReceivedInformationProps {
  formData: FormData;
  supplierInfo: SupplierInfo;
  onInputChange: (field: keyof FormData, value: string) => void;
  isMobile: boolean;
}

export default function ReceivedInformation({ formData, supplierInfo, onInputChange, isMobile }: ReceivedInformationProps) {
  const handlePaymentAmountChange = (value: string): void => {
    if (formData.cash_due === '81' && parseFloat(value) > formData.grand_total) {
      alert('Paid Amount must be lower or equal than grand total');
      return;
    }
    onInputChange('payment_amount', value);
  };

  return (
    <fieldset className="border p-3 md:p-4 rounded-lg">
      <legend className="font-bold text-sm md:text-base px-2">PAYMENT INFORMATION</legend>
      
      {isMobile ? (
        // Mobile View - Vertical Layout
        <div className="space-y-3">
          <div>
            <label className="block text-xs md:text-sm font-medium mb-1">Payment Type*</label>
            <select
              value={formData.payment_type}
              onChange={(e) => onInputChange('payment_type', e.target.value)}
              disabled={formData.cash_due === '82'}
              className="w-full p-2 border rounded text-xs md:text-sm"
            >
              <option value="">Select</option>
              <option value="1">Cash</option>
              <option value="2">Bank Transfer</option>
              <option value="3">Check</option>
              <option value="4">Card</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs md:text-sm font-medium mb-1">Payment Amount</label>
            <input
              type="number"
              value={formData.payment_amount}
              onChange={(e) => handlePaymentAmountChange(e.target.value)}
              readOnly={formData.cash_due === '82'}
              className="w-full p-2 border rounded text-xs md:text-sm"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-xs md:text-sm font-medium mb-1">Ref No</label>
            <input
              type="text"
              value={formData.ref_no}
              onChange={(e) => onInputChange('ref_no', e.target.value)}
              className="w-full p-2 border rounded text-xs md:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs md:text-sm font-medium mb-1">Grand Total</label>
            <input
              type="text"
              value={formData.grand_total.toFixed(2)}
              readOnly
              className="w-full p-2 border rounded text-xs md:text-sm bg-gray-100 text-right font-bold text-green-600"
            />
          </div>
          
          <div>
            <label className="block text-xs md:text-sm font-medium mb-1">Due Amount</label>
            <input
              type="text"
              value={supplierInfo.due_amount.toFixed(2)}
              readOnly
              className="w-full p-2 border rounded text-xs md:text-sm text-right bg-gray-100"
            />
          </div>
        </div>
      ) : (
        // Desktop View - Table Layout
        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-1 w-1/3">
                <label className="block text-xs md:text-sm font-medium">Payment Type*</label>
              </td>
              <td className="py-1">
                <select
                  value={formData.payment_type}
                  onChange={(e) => onInputChange('payment_type', e.target.value)}
                  disabled={formData.cash_due === '82'}
                  className="w-full p-1 border rounded text-xs md:text-sm"
                >
                  <option value="">Select</option>
                  <option value="1">Cash</option>
                  <option value="2">Bank Transfer</option>
                  <option value="3">Check</option>
                  <option value="4">Card</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="py-1">
                <label className="block text-xs md:text-sm font-medium">Payment Amount</label>
              </td>
              <td className="py-1">
                <input
                  type="number"
                  value={formData.payment_amount}
                  onChange={(e) => handlePaymentAmountChange(e.target.value)}
                  readOnly={formData.cash_due === '82'}
                  className="w-full p-1 border rounded text-xs md:text-sm"
                  step="0.01"
                />
              </td>
            </tr>
            <tr>
              <td className="py-1">
                <label className="block text-xs md:text-sm font-medium">Ref No</label>
              </td>
              <td className="py-1">
                <input
                  type="text"
                  value={formData.ref_no}
                  onChange={(e) => onInputChange('ref_no', e.target.value)}
                  className="w-full p-1 border rounded text-xs md:text-sm"
                />
              </td>
            </tr>
            <tr>
              <td className="py-1">
                <label className="block text-xs md:text-sm font-medium">Grand Total</label>
              </td>
              <td className="py-1">
                <input
                  type="text"
                  value={formData.grand_total.toFixed(2)}
                  readOnly
                  className="w-full p-1 border rounded text-xs md:text-sm bg-gray-100 text-right font-bold text-green-600"
                />
              </td>
            </tr>
            <tr>
              <td className="py-1">
                <label className="block text-xs md:text-sm font-medium">Due Amount</label>
              </td>
              <td className="py-1">
                <input
                  type="text"
                  value={supplierInfo.due_amount.toFixed(2)}
                  readOnly
                  className="w-full p-1 border rounded text-xs md:text-sm text-right bg-gray-100"
                />
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </fieldset>
  );
}