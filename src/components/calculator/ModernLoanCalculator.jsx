import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, Building, Briefcase } from 'lucide-react';
import loanService from '../../services/loanService';
import callbackService from '../../services/callbackService';
import { formatCurrency, formatNumberInput, parseNumberInput } from '../../utils/formatters';
import CallbackModal from './CallbackModal';

const KENYAN_TOWNS = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'];

function ModernLoanCalculator({ selectedProduct, onChangeProduct, onBackHome }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    incomeSource: 'employed',
    monthlySalaryIncome: '',
    monthlyBusinessIncome: '',
    existingLoanObligations: '',
    creditCardLimit: '',
    overdraftLimit: '',
    preferredLoanTenorYears: 20,
    employerName: '',
    natureOfBusiness: '',
    businessLocation: '',
    idNumber: '',
    customerType: '',
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [loanResultId, setLoanResultId] = useState(null);
  const [error, setError] = useState(null);
  const [successNotification, setSuccessNotification] = useState(null);

  // Load customer info from sessionStorage (from Welcome page) and guard
  useEffect(() => {
    const customerInfo = sessionStorage.getItem('customerInfo');
    if (!customerInfo) {
      // Redirect to welcome if customer info is missing
      navigate('/welcome');
      return;
    }
    
    try {
      const data = JSON.parse(customerInfo);
      setFormData(prev => ({
        ...prev,
        idNumber: data.idNumber || '',
        customerType: data.customerType || '',
      }));
    } catch (e) {
      console.error('Failed to parse customer info from sessionStorage:', e);
      navigate('/welcome');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // List of monetary fields that should be formatted with commas
    const monetaryFields = [
      'monthlySalaryIncome',
      'monthlyBusinessIncome',
      'existingLoanObligations',
      'creditCardLimit',
      'overdraftLimit'
    ];
    
    // If it's a monetary field, format it with commas
    if (monetaryFields.includes(name)) {
      const cleaned = parseNumberInput(value);
      const formatted = formatNumberInput(cleaned);
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCalculate = async () => {
    setError(null);
    
    // Parse formatted numbers (remove commas) for calculation
    const salary = parseFloat(parseNumberInput(formData.monthlySalaryIncome)) || 0;
    const business = parseFloat(parseNumberInput(formData.monthlyBusinessIncome)) || 0;
    
    if (salary === 0 && business === 0) {
      setError('Please enter either a monthly salary or business income');
      return;
    }

    if (formData.incomeSource === 'employed' && !formData.employerName.trim()) {
      setError('Please enter your employer name');
      return;
    }

    if (formData.incomeSource === 'business' && !formData.natureOfBusiness.trim()) {
      setError('Please enter your nature of business');
      return;
    }

    if (formData.incomeSource === 'business' && !formData.businessLocation.trim()) {
      setError('Please select your business location');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        monthlySalaryIncome: salary,
        monthlyBusinessIncome: business,
        monthlyRentalPayments: 0,
        existingLoanObligations: parseFloat(parseNumberInput(formData.existingLoanObligations)) || 0,
        creditCardLimit: parseFloat(parseNumberInput(formData.creditCardLimit)) || 0,
        overdraftLimit: parseFloat(parseNumberInput(formData.overdraftLimit)) || 0,
        preferredLoanTenorYears: formData.preferredLoanTenorYears,
        productType: selectedProduct.id === 'ahf' ? 'affordableHousing' : 'stdMortgage',
        incomeSourceType: formData.incomeSource,
        employerName: formData.employerName,
        natureOfBusiness: formData.natureOfBusiness,
        businessLocation: formData.businessLocation,
        idNumber: formData.idNumber,
        customerType: formData.customerType,
      };
      
      const response = await loanService.calculateLoan(payload);
      setResult(response);
      setLoanResultId(response.loanResultId);
      setCalculated(true);
    } catch (error) {
      console.error('Calculation failed:', error);
      if (error.response?.status === 502) {
        setError('Backend service is unavailable. Please ensure the backend server is running on port 5002.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Calculation failed. Please check your inputs and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCallbackSubmit = async (callbackData) => {
    try {
      await callbackService.createCallbackRequest({
        loanResultId: loanResultId,
        fullName: callbackData.fullName,
        phoneNumber: callbackData.phoneNumber,
        email: callbackData.email,
        referralNumber: callbackData.referralNumber,
        message: callbackData.message,
        loanInputsJson: JSON.stringify(formData),
        loanResultJson: JSON.stringify(result),
      });
      setShowCallbackModal(false);
      setSuccessNotification('Callback request submitted successfully! Our team will contact you shortly.');
      setTimeout(() => {
        setSuccessNotification(null);
        navigate('/welcome');
      }, 2000);
    } catch (error) {
      console.error('Callback request failed:', error);
      setSuccessNotification('Callback request failed. Please try again.');
      setTimeout(() => setSuccessNotification(null), 15000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes progressShrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .progress-line {
          height: 3px;
          background: linear-gradient(to right, #059669, #10b981);
          animation: progressShrink 15s linear forwards;
        }
      `}</style>
      
      {/* Success Notification */}
      {successNotification && (
        <div className="fixed top-0 left-0 right-0 z-[60]">
          <div className="progress-line"></div>
          <div className="bg-green-50 border-b border-green-200 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-green-800">{successNotification}</p>
                </div>
                <button 
                  onClick={() => setSuccessNotification(null)}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-ncb-divider sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button 
              onClick={() => {
                sessionStorage.removeItem('customerInfo');
                navigate('/welcome');
              }} 
              className="flex items-center gap-2 text-ncb-text hover:text-ncb-blue text-sm"
            >
              <ArrowLeft size={18} /> Start Over
            </button>
            <div className="text-center">
              <h1 className="font-semibold text-ncb-heading text-lg">{selectedProduct.label}</h1>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="text-lg font-bold text-ncb-heading mb-5">Financial Information</h2>
            
            {/* Income Source Toggle */}
            {selectedProduct.id === 'ahf' && (
              <div className="flex gap-3 mb-5 p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, incomeSource: 'employed' })}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all text-sm ${formData.incomeSource === 'employed' ? 'bg-ncb-blue text-white' : 'text-ncb-text'}`}
                >
                  <Briefcase size={16} /> Employed
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, incomeSource: 'business' })}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all text-sm ${formData.incomeSource === 'business' ? 'bg-ncb-blue text-white' : 'text-ncb-text'}`}
                >
                  <Building size={16} /> Business
                </button>
              </div>
            )}

            <div className="space-y-3.5">
              {/* Income fields based on source */}
              {formData.incomeSource === 'employed' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-ncb-heading mb-0.5">Monthly Salary Income</label>
                      <input
                        type="text"
                        name="monthlySalaryIncome"
                        value={formData.monthlySalaryIncome}
                        onChange={handleInputChange}
                        className="w-full px-2.5 py-1 text-xs border border-ncb-divider rounded-lg"
                        placeholder="e.g., 50,000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ncb-heading mb-0.5">Employer Name</label>
                      <input
                        type="text"
                        name="employerName"
                        value={formData.employerName}
                        onChange={handleInputChange}
                        className="w-full px-2.5 py-1 text-xs border border-ncb-divider rounded-lg"
                        placeholder="Your employer"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-ncb-heading mb-0.5">Monthly Business Income</label>
                    <input
                      type="text"
                      name="monthlyBusinessIncome"
                      value={formData.monthlyBusinessIncome}
                      onChange={handleInputChange}
                      className="w-full px-2.5 py-1 text-xs border border-ncb-divider rounded-lg"
                      placeholder="e.g., 100,000"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-ncb-heading mb-0.5">Nature of Business</label>
                      <input
                        type="text"
                        name="natureOfBusiness"
                        value={formData.natureOfBusiness}
                        onChange={handleInputChange}
                        className="w-full px-2.5 py-1 text-xs border border-ncb-divider rounded-lg"
                        placeholder="e.g., Retail"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ncb-heading mb-0.5">Business Location</label>
                      <select
                        name="businessLocation"
                        value={formData.businessLocation}
                        onChange={handleInputChange}
                        className="w-full px-2.5 py-1 text-xs border border-ncb-divider rounded-lg"
                      >
                        <option value="">Select location</option>
                        {KENYAN_TOWNS.map(town => <option key={town} value={town}>{town}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Loan Obligations */}
              <div>
                <label className="block text-xs font-semibold text-ncb-heading mb-0.5">Existing Loan Obligations (Monthly)</label>
                <input
                  type="text"
                  name="existingLoanObligations"
                  value={formData.existingLoanObligations}
                  onChange={handleInputChange}
                  className="w-full px-2.5 py-1 text-xs border border-ncb-divider rounded-lg"
                  placeholder="e.g., 10,000"
                />
              </div>

              {/* Credit Card & Overdraft */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ncb-heading mb-0.5">Credit Card Limit</label>
                  <input
                    type="text"
                    name="creditCardLimit"
                    value={formData.creditCardLimit}
                    onChange={handleInputChange}
                    className="w-full px-2.5 py-1 text-xs border border-ncb-divider rounded-lg"
                    placeholder="e.g., 50,000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ncb-heading mb-0.5">Overdraft Limit</label>
                  <input
                    type="text"
                    name="overdraftLimit"
                    value={formData.overdraftLimit}
                    onChange={handleInputChange}
                    className="w-full px-2.5 py-1 text-xs border border-ncb-divider rounded-lg"
                    placeholder="e.g., 20,000"
                  />
                </div>
              </div>

              {/* Tenor */}
              <div>
                <label className="block text-xs font-semibold text-ncb-heading mb-0.5">Preferred Loan Tenor (Years)</label>
                <input
                  type="range"
                  name="preferredLoanTenorYears"
                  min="1"
                  max="25"
                  value={formData.preferredLoanTenorYears}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <div className="text-center text-ncb-blue font-semibold text-sm mt-1">{formData.preferredLoanTenorYears} years</div>
              </div>

              {/* Calculate Button */}
              <button
                type="button"
                onClick={handleCalculate}
                disabled={loading}
                className="w-full py-2.5 bg-ncb-blue text-white font-semibold text-sm rounded-lg hover:bg-ncb-blue-dark transition-all flex items-center justify-center gap-2"
              >
                <Calculator size={18} /> {loading ? 'Calculating...' : 'Calculate Eligibility'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="text-lg font-bold text-ncb-heading mb-4">Your Assessment</h2>
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 font-semibold text-sm">⚠ Calculation Error</p>
                <p className="text-red-700 text-xs mt-1">{error}</p>
              </div>
            )}
            
            {result ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-ncb-blue-50 to-blue-100 rounded-xl p-4 text-center border border-ncb-blue-200">
                  <p className="text-xs text-ncb-text font-semibold mb-1.5">MAXIMUM LOAN AMOUNT</p>
                  <p className="text-3xl font-bold text-ncb-blue">{formatCurrency(result.maximumLoanAmount)}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                    <p className="text-xs text-ncb-text font-semibold mb-0.5">Monthly Instalment</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(result.estimatedMonthlyRepayment)}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                    <p className="text-xs text-ncb-text font-semibold mb-0.5">Loan Tenor</p>
                    <p className="text-xl font-bold text-blue-600">{result.loanTenorMonths / 12} years</p>
                  </div>
                </div>

                <div className="border-t border-ncb-divider pt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-ncb-text">Interest Rate:</span>
                    <span className="font-semibold text-ncb-heading">{(result.appliedInterestRate * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-ncb-text">Product Type:</span>
                    <span className="font-semibold text-ncb-heading text-right">{result.productType === 'affordableHousing' ? 'Affordable Housing' : 'Standard Mortgage'}</span>
                  </div>
                  {result.message && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
                      <p className="text-yellow-800 text-xs font-semibold">ℹ Note</p>
                      <p className="text-yellow-700 text-xs mt-0.5">{result.message}</p>
                    </div>
                  )}
                </div>

                {calculated && (
                  <button
                    type="button"
                    onClick={() => setShowCallbackModal(true)}
                    className="w-full py-2.5 bg-ncb-blue text-white font-semibold text-sm rounded-lg hover:bg-ncb-blue-dark transition-all flex items-center justify-center gap-2"
                  >
                    <Building size={16} /> Request Callback
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-ncb-text">
                <Calculator size={40} className="mx-auto mb-3 opacity-50" />
                <p className="font-semibold text-sm">Fill in your details and click Calculate to see your eligibility</p>
                <p className="text-xs mt-1.5">Your assessment will appear here once calculated</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Callback Modal */}
      {showCallbackModal && (
        <CallbackModal
          onClose={() => setShowCallbackModal(false)}
          onSubmit={handleCallbackSubmit}
        />
      )}
    </div>
  );
}

// Add the default export at the end
export default ModernLoanCalculator;