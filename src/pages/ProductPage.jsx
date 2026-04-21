import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import ModernLoanCalculator from '../components/calculator/ModernLoanCalculator';

const MORTGAGE_PRODUCTS = [
  {
    id: 'ahf',
    label: 'Affordable Housing Mortgage (AHF)',
    shortLabel: 'AHF',
    description: '9.5% rate for 20 years financing.',
    audience: '9.9% rate for 25 years financing.',
    highlights: ['Low interest rates', 'Flexible terms']
  },
  {
    id: 'standard',
    label: 'Standard Mortgage',
    shortLabel: 'Standard',
    description: 'Get a mortgage with competitive rates and flexible terms.',
    audience: '14.02% rate for 25 years financing.',
    highlights: ['Competitive rates', 'Long tenure options']
  }
];

export default function ProductPage({ onNavigateToCalculator, onBackHome }) {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
  };

  if (selectedProduct) {
    return (
      <ModernLoanCalculator
        selectedProduct={selectedProduct}
        onChangeProduct={handleBackToProducts}
        onBackHome={onBackHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-ncb-divider sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={onBackHome} className="flex items-center gap-2 text-ncb-text hover:text-ncb-blue transition-colors">
              <ArrowLeft size={20} /> Back to Home
            </button>
            <div className="flex items-center gap-2">
              <Home size={18} className="text-ncb-blue" />
              <span className="font-semibold text-ncb-heading">NCBA Mortgage</span>
            </div>
          </div>
        </div>
      </header>

      {/* Product Selection */}
      <main className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-ncb-heading">Choose Your Mortgage Product</h1>
            <p className="text-ncb-text mt-4">Select the product that best fits your needs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {MORTGAGE_PRODUCTS.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className="group bg-white rounded-2xl border border-ncb-divider overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 text-left"
              >
                <div className="p-8">
                  <div className="inline-block px-3 py-1 bg-ncb-blue-100 rounded-full text-xs font-bold text-ncb-blue mb-4">
                    {product.shortLabel}
                  </div>
                  <h3 className="text-2xl font-bold text-ncb-heading group-hover:text-ncb-blue transition-colors mb-3">
                    {product.label}
                  </h3>
                  <p className="text-ncb-text mb-4">{product.description}</p>
                  <div className="inline-flex items-center gap-2 text-ncb-blue font-semibold">
                    Select Product <ArrowLeft size={16} className="rotate-180" />
                  </div>
                </div>
                <div className="bg-ncb-blue-50 px-8 py-4 border-t border-ncb-divider">
                  <span className="text-sm text-ncb-text">{product.audience}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}