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

interface PurchaseOrderSectionProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
}

export default function PurchaseOrderSection({ formData, onInputChange }: PurchaseOrderSectionProps) {
  return (
    <fieldset className="border p-4">
      <legend className="font-bold">ORDER NO</legend>
      <table className="w-full">
        <tbody>
          <tr>
            <td className="py-1">
              <label className="block text-sm font-medium">Issue Date</label>
            </td>
            <td className="py-1">
              <input
                type="date"
                value={formData.issue_date}
                onChange={(e) => onInputChange('issue_date', e.target.value)}
                className="w-full p-1 border rounded text-sm"
              />
            </td>
          </tr>
          <tr>
            <td className="py-1">
              <label className="block text-sm font-medium">Cash/Due</label>
            </td>
            <td className="py-1">
              <select
                value={formData.cash_due}
                onChange={(e) => onInputChange('cash_due', e.target.value)}
                className="w-full p-1 border rounded text-sm"
              >
                <option value="">Select</option>
                <option value="81">Cash</option>
                <option value="82">Due</option>
              </select>
            </td>
          </tr>
          <tr>
            <td className="py-1">
              <label className="block text-sm font-medium">Local/Import</label>
            </td>
            <td className="py-1">
              <select
                value={formData.local_import}
                onChange={(e) => onInputChange('local_import', e.target.value)}
                className="w-full p-1 border rounded text-sm"
              >
                <option value="">Select</option>
                <option value="53">Local</option>
                <option value="54">Import</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>
  );
}