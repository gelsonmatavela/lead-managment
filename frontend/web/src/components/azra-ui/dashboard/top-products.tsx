import React from 'react';

interface Product {
  name: string;
  sales: number;
  revenue: string;
}

interface TopProductsProps {
  products: Product[];
  title?: string;
}

export default function TopProducts({ 
  products, 
  title = "Top Products" 
}: TopProductsProps) {
  return (
    <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-6">
      <h3 className="text-sm font-medium text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-white font-medium">{product.name}</p>
              <p className="text-xs text-gray-500">{product.sales} sales</p>
            </div>
            <div className="text-sm text-white font-medium">
              ${product.revenue}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}