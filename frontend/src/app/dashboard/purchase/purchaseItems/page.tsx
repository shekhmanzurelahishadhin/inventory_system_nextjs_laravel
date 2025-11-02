'use client';
import { useState, useEffect } from 'react';
import PurchaseOrderSection from './components/PurchaseOrderSection';
import ReceivedInformation from './components/ReceivedInformation';
import ProductInformation from './components/ProductInformation';
import AddedProductsTable from './components/AddedProductsTable';
import ProductModal from './components/ProductModal';
import SupplierModal from './components/SupplierModal';
import ShipByModal from './components/ShipByModal';

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

interface SupplierInfo {
  name: string;
  mobile_no: string;
  due_amount: number;
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

export default function PurchaseForm() {
  const [formData, setFormData] = useState<FormData>({
    po_no: '',
    issue_date: new Date().toISOString().split('T')[0],
    cash_due: '',
    local_import: '',
    store_id: '',
    location_id: '',
    ship_by: '',
    supplier_id: '',
    payment_type: '',
    payment_amount: '',
    ref_no: '',
    grand_total: 0,
    company_id: ''
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<CurrentProduct>({
    model_id: '',
    code: '',
    order_qty: '',
    purchase_price: '',
    weight_unit_price: '',
    sell_price: '',
    weight_unit_qty: '',
    total_product_unit_price: '0',
    total_product_price: '0',
    total_weight: '0',
    total_weight_amount: '0',
    total_purchase_price: '0'
  });
  
  const [supplierInfo, setSupplierInfo] = useState<SupplierInfo>({
    name: '',
    mobile_no: '',
    due_amount: 0
  });

  const [modals, setModals] = useState({
    product: false,
    supplier: false,
    shipBy: false
  });

  useEffect(() => {
    generatePONumber();
  }, []);

  const generatePONumber = async (): Promise<void> => {
    try {
      const response = await fetch('/api/purchase/generate-po-number');
      const data = await response.json();
      setFormData(prev => ({ ...prev, po_no: data.poNumber }));
    } catch (error) {
      console.error('Error generating PO number:', error);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProductChange = (field: keyof CurrentProduct, value: string): void => {
    setCurrentProduct(prev => ({ ...prev, [field]: value }));
  };

  const validateProduct = (): boolean => {
    if (!currentProduct.model_id) {
      alert('Please select a product!');
      return false;
    }
    if (!currentProduct.order_qty || parseFloat(currentProduct.order_qty) <= 0) {
      alert('Please enter order quantity!');
      return false;
    }
    if (!currentProduct.purchase_price || parseFloat(currentProduct.purchase_price) <= 0) {
      alert('Please enter purchase price!');
      return false;
    }
    return true;
  };

  const addProduct = (): void => {
    if (!validateProduct()) return;

    const newProduct: Product = {
      id: Date.now(),
      ...currentProduct,
      location_name: 'Location Name', // You'll need to get this from your location select
      unit: 'pcs' // You'll need to get this from your product data
    };

    setProducts(prev => [...prev, newProduct]);
    updateGrandTotal([...products, newProduct]);
    resetProductForm();
  };

  const removeProduct = (id: number): void => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    updateGrandTotal(updatedProducts);
  };

  const updateGrandTotal = (productList: Product[]): void => {
    const total = productList.reduce((sum, product) => 
      sum + parseFloat(product.total_purchase_price || '0'), 0
    );
    setFormData(prev => ({ ...prev, grand_total: total }));
  };

  const resetProductForm = (): void => {
    setCurrentProduct({
      model_id: '',
      code: '',
      order_qty: '',
      purchase_price: '',
      weight_unit_price: '',
      sell_price: '',
      weight_unit_qty: '',
      total_product_unit_price: '0',
      total_product_price: '0',
      total_weight: '0',
      total_weight_amount: '0',
      total_purchase_price: '0'
    });
  };

  const submitForm = async (): Promise<void> => {
    try {
      const response = await fetch('/api/purchase/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          products,
          supplier: supplierInfo
        }),
      });

      if (response.ok) {
        console.log('Purchase order created successfully');
        // Reset form or show success message
      } else {
        console.error('Error creating purchase order');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
        <fieldset className="border p-4 mb-6">
          <legend className="text-lg font-bold">Purchase Form</legend>
          
          <div className="grid grid-cols-2 gap-6">
            <PurchaseOrderSection 
              formData={formData}
              onInputChange={handleInputChange}
            />

            <ReceivedInformation 
              formData={formData}
              supplierInfo={supplierInfo}
              onInputChange={handleInputChange}
            />
          </div>

          <ProductInformation 
            currentProduct={currentProduct}
            formData={formData}
            onProductChange={handleProductChange}
            onInputChange={handleInputChange}
            onAddProduct={addProduct}
            onOpenModal={(modal: string) => setModals(prev => ({ ...prev, [modal]: true }))}
          />

          <AddedProductsTable 
            products={products}
            onRemoveProduct={removeProduct}
          />
        </fieldset>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            id="submitBtn"
          >
            Create PO
          </button>
        </div>
      </form>

      <ProductModal 
        isOpen={modals.product}
        onClose={() => setModals(prev => ({ ...prev, product: false }))}
        onProductSelect={(product: any) => {
          setCurrentProduct(prev => ({
            ...prev,
            model_id: product.id,
            model_name: product.name,
            code: product.code,
            sell_price: product.sell_price,
            purchase_price: product.purchase_price,
            weight_unit_qty: product.weight
          }));
        }}
      />

      <SupplierModal 
        isOpen={modals.supplier}
        onClose={() => setModals(prev => ({ ...prev, supplier: false }))}
        onSupplierSelect={(supplier: any) => {
          setFormData(prev => ({ ...prev, supplier_id: supplier.id }));
          setSupplierInfo({
            name: supplier.company_name,
            mobile_no: supplier.mobile,
            due_amount: supplier.due_amount
          });
        }}
      />

      <ShipByModal 
        isOpen={modals.shipBy}
        onClose={() => setModals(prev => ({ ...prev, shipBy: false }))}
        onShipBySelect={(shipBy: any) => {
          setFormData(prev => ({ ...prev, ship_by: shipBy.id }));
        }}
      />
    </div>
  );
}