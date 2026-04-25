import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, Building } from 'lucide-react';
import loanService from '../../services/loanService';
import callbackService from '../../services/callbackService';
import { formatCurrency, formatNumberInput, parseNumberInput } from '../../utils/formatters';
import CallbackModal from './CallbackModal';

const KENYAN_TOWNS = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kericho', 'Nyeri', 'Thika',
  'Naivasha', 'Machakos', 'Malindi', 'Lamu', 'Isiolo', 'Meru', 'Embu', 'Murang\'a',
  'Bomet', 'Kisii', 'Migori', 'Kakamega', 'Bungoma', 'Kitale', 'Kapsabet', 'Nakuru',
  'Narok', 'Kericho', 'Kapsabet', 'Karatina', 'Nyahururu', 'Rumuruti', 'Kerugoya'
];

function ModernLoanCalculator({ selectedProduct, incomeSource = 'employed', onChangeProduct, onBackHome }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    incomeSource: incomeSource,
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
  const [showCallbackModal, setShowCallbackModal] = useState(false);  const [showThankYouModal, setShowThankYouModal] = useState(false);  const [calculated, setCalculated] = useState(false);
  const [loanResultId, setLoanResultId] = useState(null);
  const [error, setError] = useState(null);
  const [successNotification, setSuccessNotification] = useState(null);
  const [finishNotification, setFinishNotification] = useState(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [hasCreditCard, setHasCreditCard] = useState('');
  const [hasOverdraft, setHasOverdraft] = useState('');

  const filteredLocations = locationSearch.trim()
    ? KENYAN_TOWNS.filter(town =>
        town.toLowerCase().includes(locationSearch.toLowerCase())
      )
    : KENYAN_TOWNS;

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

  const handleLocationSearch = (e) => {
    setLocationSearch(e.target.value);
    setShowLocationSuggestions(true);
  };

  const handleSelectLocation = (location) => {
    setFormData(prev => ({
      ...prev,
      businessLocation: location
    }));
    setLocationSearch('');
    setShowLocationSuggestions(false);
  };

  const handleCreditCardChange = (value) => {
    setHasCreditCard(value);
    // If user selects "no", clear the credit card limit
    if (value === 'no') {
      setFormData(prev => ({
        ...prev,
        creditCardLimit: ''
      }));
    }
  };

  const handleOverdraftChange = (value) => {
    setHasOverdraft(value);
    // If user selects "no", clear the overdraft limit
    if (value === 'no') {
      setFormData(prev => ({
        ...prev,
        overdraftLimit: ''
      }));
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
        preferredBranch: callbackData.preferredBranch,
        message: callbackData.message,
        loanInputsJson: JSON.stringify(formData),
        loanResultJson: JSON.stringify(result),
      });
      // Close the callback modal and show thank you modal
      setShowCallbackModal(false);
      setShowThankYouModal(true);
    } catch (error) {
      console.error('Callback request failed:', error);
      setSuccessNotification('Callback request failed. Please try again.');
      setTimeout(() => setSuccessNotification(null), 15000);
    }
  };

  const handleThankYouClose = () => {
    setShowThankYouModal(false);
    sessionStorage.removeItem('customerInfo');
    navigate('/welcome');
  };

  const handleFinish = () => {
    setFinishNotification('Thank you for using our mortgage prequalification tool. We\'re here whenever you\'re ready to take the next step. NCBA, Go For It.');
    setTimeout(() => {
      setFinishNotification(null);
      sessionStorage.removeItem('customerInfo');
      navigate('/welcome');
    }, 3000);
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

      {/* Finish Notification */}
      {finishNotification && (
        <div className="fixed top-0 left-0 right-0 z-[60]">
          <div className="progress-line" style={{background: 'linear-gradient(to right, #3AB3E5, #2d90b8)', animation: 'progressShrink 3s linear forwards'}}></div>
          <div className="bg-ncb-blue-50 border-b border-ncb-blue-200 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-ncb-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-ncb-blue">{finishNotification}</p>
                </div>
                <button 
                  onClick={() => setFinishNotification(null)}
                  className="text-ncb-blue hover:text-ncb-blue-dark text-sm font-medium"
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
            
            {/* Income Source Badge (showing selected source, not toggleable) */}
            <div className="mb-5 p-2.5 bg-ncb-blue-50 border border-ncb-blue-100 rounded-lg">
              <p className="text-xs text-ncb-text">
                <span className="font-semibold">Income Source:</span> 
                <span className="font-medium text-ncb-blue ml-2">
                  {formData.incomeSource === 'employed' ? '💼 Employed' : '🏢 Business'}
                </span>
              </p>
            </div>

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
                      <div className="relative">
                        {formData.businessLocation ? (
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1 px-2.5 py-1 border border-green-300 bg-green-50 rounded-lg text-xs text-ncb-heading font-medium">
                              {formData.businessLocation}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  businessLocation: ''
                                }));
                                setLocationSearch('');
                              }}
                              className="px-2 py-1 text-xs text-ncb-blue hover:bg-ncb-blue-50 rounded transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <>
                            <input
                              type="text"
                              value={locationSearch}
                              onChange={handleLocationSearch}
                              onFocus={() => setShowLocationSuggestions(true)}
                              placeholder="Type location..."
                              className="w-full px-2.5 py-1 text-xs border border-ncb-divider rounded-lg focus:outline-none focus:ring-1 focus:ring-ncb-blue focus:border-transparent"
                            />
                            
                            {/* Suggestions Dropdown */}
                            {showLocationSuggestions && filteredLocations.length > 0 && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-ncb-divider rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                                {filteredLocations.map((town) => (
                                  <button
                                    key={town}
                                    type="button"
                                    onClick={() => handleSelectLocation(town)}
                                    className="w-full text-left px-2.5 py-1.5 hover:bg-ncb-blue-50 text-xs text-ncb-heading font-medium transition-colors border-b border-ncb-divider last:border-b-0"
                                  >
                                    {town}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* No results message */}
                            {showLocationSuggestions && locationSearch && filteredLocations.length === 0 && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-ncb-divider rounded-lg shadow-lg z-10 p-2">
                                <p className="text-xs text-ncb-text">No matching locations found</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
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
              <div className="space-y-3">
                {/* Credit Card Question */}
                <div>
                  <label className="block text-xs font-semibold text-ncb-heading mb-2">Do you have a credit card?</label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="hasCreditCard"
                        value="yes"
                        checked={hasCreditCard === 'yes'}
                        onChange={(e) => handleCreditCardChange(e.target.value)}
                        className="w-3 h-3 text-ncb-blue cursor-pointer"
                      />
                      <span className="text-xs text-ncb-text">Yes</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="hasCreditCard"
                        value="no"
                        checked={hasCreditCard === 'no'}
                        onChange={(e) => handleCreditCardChange(e.target.value)}
                        className="w-3 h-3 text-ncb-blue cursor-pointer"
                      />
                      <span className="text-xs text-ncb-text">No</span>
                    </label>
                  </div>
                  
                  {/* Credit Card Input - Shown only if Yes */}
                  {hasCreditCard === 'yes' && (
                    <div className="mt-2 p-2 bg-ncb-blue-50 rounded-lg">
                      <input
                        type="text"
                        name="creditCardLimit"
                        value={formData.creditCardLimit}
                        onChange={handleInputChange}
                        className="w-full px-2.5 py-1 text-xs border border-ncb-divider rounded-lg bg-white"
                        placeholder="e.g., 50,000"
                      />
                    </div>
                  )}
                </div>

                {/* Overdraft Question */}
                <div>
                  <label className="block text-xs font-semibold text-ncb-heading mb-2">Do you have an overdraft limit?</label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="hasOverdraft"
                        value="yes"
                        checked={hasOverdraft === 'yes'}
                        onChange={(e) => handleOverdraftChange(e.target.value)}
                        className="w-3 h-3 text-ncb-blue cursor-pointer"
                      />
                      <span className="text-xs text-ncb-text">Yes</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="hasOverdraft"
                        value="no"
                        checked={hasOverdraft === 'no'}
                        onChange={(e) => handleOverdraftChange(e.target.value)}
                        className="w-3 h-3 text-ncb-blue cursor-pointer"
                      />
                      <span className="text-xs text-ncb-text">No</span>
                    </label>
                  </div>
                  
                  {/* Overdraft Input - Shown only if Yes */}
                  {hasOverdraft === 'yes' && (
                    <div className="mt-2 p-2 bg-ncb-blue-50 rounded-lg">
                      <input
                        type="text"
                        name="overdraftLimit"
                        value={formData.overdraftLimit}
                        onChange={handleInputChange}
                        className="w-full px-2.5 py-1 text-xs border border-ncb-divider rounded-lg bg-white"
                        placeholder="e.g., 20,000"
                      />
                    </div>
                  )}
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
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setShowCallbackModal(true)}
                      className="w-full py-2.5 bg-ncb-blue text-white font-semibold text-sm rounded-lg hover:bg-ncb-blue-dark transition-all flex items-center justify-center gap-2"
                    >
                      <Building size={16} /> Request Callback
                    </button>
                    <button
                      type="button"
                      onClick={handleFinish}
                      className="w-full py-2.5 bg-gray-200 text-ncb-heading font-semibold text-sm rounded-lg hover:bg-gray-300 transition-all"
                    >
                      Finish
                    </button>
                  </div>
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

      {/* Thank You Modal */}
      {showThankYouModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-ncb-blue rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
            {/* Checkmark Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-ncb-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Thank You Message */}
            <h2 className="text-2xl font-bold text-white mb-4">Thank You!</h2>
            <p className="text-white text-lg leading-relaxed mb-8">
              Thank you for your request. One of our mortgage specialists will contact you within 48 working hours to assist you further. NCBA, Go For It.
            </p>

            {/* Close Button */}
            <button
              onClick={handleThankYouClose}
              className="w-full py-3 bg-white text-ncb-blue font-bold text-lg rounded-lg hover:bg-gray-100 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Add the default export at the end
export default ModernLoanCalculator;