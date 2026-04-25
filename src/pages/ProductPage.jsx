// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft, Home } from 'lucide-react';
// import ModernLoanCalculator from '../components/calculator/ModernLoanCalculator';

// const MORTGAGE_PRODUCTS = [
//   {
//     id: 'ahf',
//     label: 'Affordable Housing Mortgage (AHF)',
//     shortLabel: 'AHF',
//     description: '9.5% rate for 20 years financing.',
//     audience: '9.9% rate for 25 years financing.',
//     highlights: ['Low interest rates', 'Flexible terms']
//   },
//   {
//     id: 'standard',
//     label: 'Standard Mortgage',
//     shortLabel: 'Standard',
//     description: 'Get a mortgage with competitive rates and flexible terms.',
//     audience: '14.02% rate for 25 years financing.',
//     highlights: ['Competitive rates', 'Long tenure options']
//   }
// ];

// export default function ProductPage({ onNavigateToCalculator, onBackHome }) {
//   const navigate = useNavigate();
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   // Guard: Redirect to welcome if customer info is not in sessionStorage
//   useEffect(() => {
//     const customerInfo = sessionStorage.getItem('customerInfo');
//     if (!customerInfo) {
//       navigate('/welcome');
//     }
//   }, [navigate]);

//   const handleProductSelect = (product) => {
//     setSelectedProduct(product);
//   };

//   const handleBackToProducts = () => {
//     setSelectedProduct(null);
//   };

//   if (selectedProduct) {
//     return (
//       <ModernLoanCalculator
//         selectedProduct={selectedProduct}
//         onChangeProduct={handleBackToProducts}
//         onBackHome={onBackHome}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       {/* Header */}
//       <header className="bg-white border-b border-ncb-divider sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <button onClick={onBackHome} className="flex items-center gap-2 text-ncb-text hover:text-ncb-blue transition-colors">
//               <ArrowLeft size={20} /> Back to Home
//             </button>
//             <div className="flex items-center gap-2">
//               <Home size={18} className="text-ncb-blue" />
//               <span className="font-semibold text-ncb-heading">NCBA Mortgage</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Product Selection */}
//       <main className="py-12 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl font-bold text-ncb-heading">Choose Your Mortgage Product</h1>
//             <p className="text-ncb-text mt-4">Select the product that best fits your needs</p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-8">
//             {MORTGAGE_PRODUCTS.map((product) => (
//               <button
//                 key={product.id}
//                 onClick={() => handleProductSelect(product)}
//                 className="group bg-white rounded-2xl border border-ncb-divider overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 text-left"
//               >
//                 <div className="p-8">
//                   <div className="inline-block px-3 py-1 bg-ncb-blue-100 rounded-full text-xs font-bold text-ncb-blue mb-4">
//                     {product.shortLabel}
//                   </div>
//                   <h3 className="text-2xl font-bold text-ncb-heading group-hover:text-ncb-blue transition-colors mb-3">
//                     {product.label}
//                   </h3>
//                   <p className="text-ncb-text mb-4">{product.description}</p>
//                   <div className="inline-flex items-center gap-2 text-ncb-blue font-semibold">
//                     Select Product <ArrowLeft size={16} className="rotate-180" />
//                   </div>
//                 </div>
//                 <div className="bg-ncb-blue-50 px-8 py-4 border-t border-ncb-divider">
//                   <span className="text-sm text-ncb-text">{product.audience}</span>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }






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
    eligibleFor: ['employed', 'business'] // Available to both
  },
  {
    id: 'standard',
    label: 'Standard Mortgage',
    shortLabel: 'Standard',
    image: StandardMortgageImage,
    description: 'Get a mortgage with competitive rates and flexible terms.',
    audience: '14.02% rate for 25 years financing.',
    highlights: ['Competitive rates', 'Long tenure options', 'High loan amounts'],
    eligibleFor: ['employed'] // Only for employed
  }
];

export default function ProductPage({ onNavigateToCalculator, onBackHome }) {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Get income source from sessionStorage
  const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');
  const incomeSource = customerInfo.incomeSource || 'employed';

  const handleProductSelect = (product) => {
    // Check if product is eligible for the customer's income source
    if (!product.eligibleFor.includes(incomeSource)) {
      return; // Don't open calculator if product is not eligible
    }
    setSelectedProduct(product);
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
              return (
                <button
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  disabled={!isEligible}
                  className={`group relative bg-white rounded-xl border overflow-hidden text-left transition-all ${
                    isEligible
                      ? 'border-ncb-divider hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                      : 'border-gray-300 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Product Image - Reduced height */}
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

                  {/* Eligibility Info for Ineligible Products */}
                  {!isEligible && (
                    <div className="absolute inset-0 flex items-end pointer-events-none">
                      <div className="w-full bg-gradient-to-t from-black/40 to-transparent p-3">
                        <p className="text-white text-xs font-medium">Try: Affordable Housing Mortgage (AHF)</p>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}