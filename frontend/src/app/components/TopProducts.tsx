// app/components/TopProducts.tsx
'use client';
interface TopProductsProps {
  darkMode: boolean;
}

interface Product {
  name: string;
  sales: number;
  revenue: string;
}

const TopProducts = ({ darkMode }: TopProductsProps) => {
  const products: Product[] = [
    { name: 'Product A', sales: 1254, revenue: '$12,345' },
    { name: 'Product B', sales: 987, revenue: '$9,876' },
    { name: 'Product C', sales: 654, revenue: '$6,543' },
    { name: 'Product D', sales: 321, revenue: '$3,210' },
    { name: 'Product E', sales: 210, revenue: '$2,109' },
  ];

  return (
    <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Top Products</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Product</th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sales</th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product, index) => (
              <tr key={index}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{product.name}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{product.sales}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{product.revenue}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProducts;