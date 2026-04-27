

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ModernLoanCalculator from '../components/calculator/ModernLoanCalculator';
import NCBALogo from '../assets/images/logo.png';

// Import product images
import AffordableHousingImage from '../assets/images/AI 1.jpg';
import StandardMortgageImage from '../assets/images/AI 2.jpg';

const MORTGAGE_PRODUCTS = [
  {
    id: 'ahf',
    label: 'Affordable Housing Mortgage (AHF)',
    shortLabel: 'AHF',
    image: AffordableHousingImage,
    description: '9.5% rate for 20 years financing.',
    audience: '9.9% rate for 25 years financing.',
    highlights: ['Low interest rates', 'Flexible terms', 'First-time home buyers'],
    eligibleFor: ['employed', 'business'], // Available to both
    qualifications: [
      'A customer whose monthly income is below 1 Million',
      'A customer who requires financing of a minimum of 1 Million up-to a maximum of 10.5M',
      'Income is in form of KES ONLY',
      'Interest rate 9.5% upto 20 years and 9.9% upto 25 years'
    ],
    products: ['Equity release', 'Buy&Build', 'Easy Build', 'Construction loans', 'Property purchases', 'Mortgage Buy out'],
    facilityFee: 'Non-refundable Facility fee of 1.5% of loan amount will be charged'
  },
  {
    id: 'standard',
    label: 'Standard Mortgage',
    shortLabel: 'Standard',
    image: StandardMortgageImage,
    description: 'Get a mortgage with competitive rates and flexible terms.',
    audience: '14.02% rate for 25 years financing.',
    highlights: ['Competitive rates', 'Long tenure options', 'High loan amounts'],
    eligibleFor: ['employed'], // Only for employed
    qualifications: [
      'A customer whose monthly income is above 1 Million',
      'A customer who requires financing of more than 10.5 Million',
      'Income is in form of KES, USD, GBP & EUROS'
    ],
    products: ['Equity release', 'Buy&Build', 'Easy Build', 'Construction loans', 'House purchases'],
    facilityFee: 'Facility fee of 1% of loan amount for KES and 1.5% for other currencies will be charged'
  }
];

export default function ProductPage({ onNavigateToCalculator, onBackHome }) {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);

  // Get income source from sessionStorage
  const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');
  const incomeSource = customerInfo.incomeSource || 'employed';

  const handleProductSelect = (product) => {
    // Check if product is eligible for the customer's income source
    if (!product.eligibleFor.includes(incomeSource)) {
      return; // Don't open calculator if product is not eligible
    }
    // Toggle expansion or navigate to calculator
    if (expandedProduct === product.id) {
      setSelectedProduct(product);
    } else {
      setExpandedProduct(expandedProduct === product.id ? null : product.id);
    }
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
  };

  if (selectedProduct) {
    // Get incomeSource from sessionStorage (set in Welcome page)
    const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');
    const incomeSource = customerInfo.incomeSource || 'employed';
    
    return (
      <ModernLoanCalculator
        selectedProduct={selectedProduct}
        incomeSource={incomeSource}
        onChangeProduct={handleBackToProducts}
        onBackHome={onBackHome}
      />
    );
  }

  const isProductEligible = (product) => product.eligibleFor.includes(incomeSource);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header - Reduced height */}
      <header className="bg-white border-b border-ncb-divider sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button onClick={onBackHome} className="flex items-center gap-2 text-ncb-text hover:text-ncb-blue transition-colors text-sm">
              <ArrowLeft size={18} /> Back to Home
            </button>
            <div className="flex items-center gap-2">
              <img
                src={NCBALogo}
                alt="NCBA Logo"
                className="h-6 w-auto object-contain"
              />
              <span className="font-semibold text-ncb-heading text-sm"></span>
            </div>
          </div>
        </div>
      </header>

      {/* Product Selection - Reduced padding and spacing */}
      <main className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Reduced top margin and spacing */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-ncb-heading">Choose Your Mortgage Product</h1>
            <p className="text-ncb-text mt-2 text-sm">Select the product that best fits your needs</p>
          </div>

          {/* Reduced gap between cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {MORTGAGE_PRODUCTS.map((product) => {
              const isEligible = isProductEligible(product);
              const isExpanded = expandedProduct === product.id;
              
              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-xl border overflow-hidden transition-all ${
                    isEligible
                      ? 'border-ncb-divider hover:shadow-lg'
                      : 'border-gray-300 opacity-60'
                  }`}
                >
                  {/* Product Image - Reduced height */}
                  <button
                    onClick={() => handleProductSelect(product)}
                    disabled={!isEligible}
                    className={`w-full group relative overflow-hidden text-left transition-all ${
                      isEligible ? 'cursor-pointer' : 'cursor-not-allowed'
                    }`}
                  >
                    <div className={`relative h-36 overflow-hidden ${
                      isEligible ? '' : 'grayscale'
                    }`}>
                      <img
                        src={product.image}
                        alt={product.label}
                        className={`w-full h-full object-cover ${
                          isEligible
                            ? 'transition-transform duration-700 group-hover:scale-110'
                            : ''
                        }`}
                      />
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 ${
                        isEligible
                          ? 'bg-gradient-to-t from-black/60 via-transparent to-transparent'
                          : 'bg-gradient-to-t from-black/80 via-transparent to-transparent'
                      }`} />
                      
                      {/* Badge Overlay */}
                      <div className="absolute top-3 left-3">
                        {isEligible ? (
                          <div className="inline-block px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-ncb-blue shadow-md">
                            {product.shortLabel}
                          </div>
                        ) : (
                          <div className="inline-block px-2.5 py-1 bg-red-500 rounded-full text-xs font-bold text-white shadow-md">
                            Not Applicable
                          </div>
                        )}
                      </div>

                      {/* Not Applicable Overlay Message */}
                      {!isEligible && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-white font-bold text-sm">Not available for</p>
                            <p className="text-white/90 text-xs">Business owners</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Section - Reduced padding */}
                    <div className="p-4">
                      <h3 className={`text-lg font-bold transition-colors mb-2 ${
                        isEligible
                          ? 'text-ncb-heading group-hover:text-ncb-blue'
                          : 'text-gray-500'
                      }`}>
                        {product.label}
                      </h3>
                      <p className={`text-sm mb-3 ${
                        isEligible ? 'text-ncb-text' : 'text-gray-400'
                      }`}>
                        {product.description}
                      </p>
                    </div>

                    {/* Footer with Rate Info - Reduced padding */}
                    <div className={`px-4 py-3 border-t ${
                      isEligible
                        ? 'bg-ncb-blue-50 border-ncb-divider'
                        : 'bg-gray-50 border-gray-300'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs ${isEligible ? 'text-ncb-text' : 'text-gray-400'}`}>
                          Interest Rate
                        </span>
                        <span className={`text-xs font-bold ${isEligible ? 'text-ncb-blue' : 'text-gray-400'}`}>
                          {product.audience}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Expandable Details Section */}
                  {isExpanded && isEligible && (
                    <div className="border-t border-ncb-divider bg-gray-50 p-4 space-y-4">
                      {/* Who Qualifies */}
                      <div>
                        <h4 className="text-xs font-bold text-ncb-heading mb-2 uppercase">Who Qualifies?</h4>
                        <ul className="space-y-1.5">
                          {product.qualifications.map((qual, idx) => (
                            <li key={idx} className="text-xs text-ncb-text flex gap-2">
                              <span className="text-ncb-blue font-bold">◦</span>
                              <span>{qual}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Products Included */}
                      <div>
                        <h4 className="text-xs font-bold text-ncb-heading mb-2 uppercase">Products Include</h4>
                        <p className="text-xs text-ncb-text">
                          {product.products.join(', ')}
                        </p>
                      </div>

                      {/* Facility Fee */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <h4 className="text-xs font-bold text-yellow-800 mb-1">Note:</h4>
                        <p className="text-xs text-yellow-700">
                          {product.facilityFee}
                        </p>
                      </div>

                      {/* Proceed Button */}
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="w-full py-2.5 bg-ncb-blue text-white font-semibold text-sm rounded-lg hover:bg-ncb-blue-dark transition-all"
                      >
                        Proceed with {product.shortLabel}
                      </button>
                    </div>
                  )}

                  {/* Eligibility Info for Ineligible Products */}
                  {!isEligible && (
                    <div className="bg-gray-50 border-t border-gray-300 p-3">
                      <p className="text-gray-600 text-xs font-medium text-center">Try: Affordable Housing Mortgage (AHF)</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}