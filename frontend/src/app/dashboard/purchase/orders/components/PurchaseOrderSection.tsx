import SingleSelectField from "@/app/components/ui/SingleSelectField";

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
  isMobile: boolean;
}

export default function PurchaseOrderSection({
  formData,
  onInputChange,
  isMobile,
}: PurchaseOrderSectionProps) {
  return (
    <fieldset className="border p-3 md:p-4 rounded-lg">
      <legend className="font-bold text-sm md:text-base px-2">
        ORDER INFORMATION
      </legend>
      <table className="w-full">
        <tbody>
          <tr>
            <td className="py-1">
              <label className="block text-xs md:text-sm font-medium">
                Issue Date
              </label>
            </td>
            <td className="py-1">
              <input
                type="date"
                value={formData.issue_date}
                onChange={(e) => onInputChange("issue_date", e.target.value)}
                className="w-full p-1 border rounded text-xs md:text-sm"
              />
            </td>
          </tr>
          <tr>
            <td className="py-1">
              <label className="block text-xs md:text-sm font-medium">
                Cash/Due
              </label>
            </td>
          <td className="py-1">
  <SingleSelectField
  value={formData.cash_due}
  onChange={(val) => onInputChange("cash_due", val)}
  options={[
    { value: "81", label: "Cash" },
    { value: "82", label: "Due" },
  ]}
  placeholder="Select"
  padding="0px 0px"
  marginTop="0px"
  minHeight="0px"
  backgroundColor= "#F9FAFB"
/>

</td>

          </tr>
          <tr>
            <td className="py-1">
              <label className="block text-xs md:text-sm font-medium">
                Local/Import
              </label>
            </td>
            <td className="py-1">
              <select
                value={formData.local_import}
                onChange={(e) => onInputChange("local_import", e.target.value)}
                className="w-full p-1 border rounded text-xs md:text-sm"
              >
                <option value="">Select</option>
                <option value="53">Local</option>
                <option value="54">Import</option>
              </select>
            </td>
          </tr>
          <tr>
            <td className="py-1">
              <label className="block text-xs md:text-sm font-medium">
                Company
              </label>
            </td>
            <td className="py-1">
              <select
                value={formData.company_id}
                onChange={(e) => onInputChange("company_id", e.target.value)}
                className="w-full p-1 border rounded text-xs md:text-sm"
              >
                <option value="">Select</option>
              </select>
            </td>
          </tr>
          <tr>
            <td className="py-1">
              <label className="block text-xs md:text-sm font-medium">
                Store
              </label>
            </td>
            <td className="py-1">
              <select
                value={formData.store_id}
                onChange={(e) => onInputChange("store_id", e.target.value)}
                className="w-full p-1 border rounded text-xs md:text-sm"
              >
                <option value="">Select</option>
              </select>
            </td>
          </tr>
          <tr>
            <td className="py-1">
              <label className="block text-xs md:text-sm font-medium">
                Supplier
              </label>
            </td>
            <td className="py-1">
              <select
                value={formData.supplier_id}
                onChange={(e) => onInputChange("supplier_id", e.target.value)}
                className="w-full p-1 border rounded text-xs md:text-sm"
              >
                <option value="">Select</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>
  );
}
