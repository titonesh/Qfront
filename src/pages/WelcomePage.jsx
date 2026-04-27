import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import bgImage from '../assets/images/bgdncba.jpg';

const COMPANY_OPTIONS = [
  'NCBA Bank',
  'Safaricom',
  'Kenya Power',
  'Kenya Airways',
  'Equity Bank',
  'KCB Bank',
  'Co-operative Bank',
  'Standard Chartered',
  'Barclays Bank',
  'Diamond Trust Bank',
  'Other'
];

export default function WelcomePage({ onNavigateToProducts }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hasNCBAccount: '',
    incomeSource: '',
    businessRegNo: '',
    employerName: '',
    selectedCompany: '',
    idNumber: '',
    firstName: '',
    lastName: '',
    sirName: ''
  });

  const [errors, setErrors] = useState({});
  const [companySearch, setCompanySearch] = useState('');
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);

  const filteredCompanies = companySearch.trim()
    ? COMPANY_OPTIONS.filter(company =>
        company.toLowerCase().includes(companySearch.toLowerCase())
      )
    : COMPANY_OPTIONS;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCompanySearch = (e) => {
    setCompanySearch(e.target.value);
    setShowCompanySuggestions(true);
  };

  const handleSelectCompany = (company) => {
    setFormData(prev => ({
      ...prev,
      selectedCompany: company,
      employerName: '' // Reset employerName when selection changes
    }));
    setCompanySearch('');
    setShowCompanySuggestions(false);
    if (errors.selectedCompany) {
      setErrors(prev => ({
        ...prev,
        selectedCompany: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hasNCBAccount) {
      newErrors.hasNCBAccount = 'Please indicate if you have an NCBA account';
    }

    if (!formData.incomeSource) {
      newErrors.incomeSource = 'Please select your source of income';
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'ID/Passport number is required';
    } else if (formData.idNumber.length > 20) {
      newErrors.idNumber = 'ID number cannot exceed 20 characters';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.sirName.trim()) {
      newErrors.sirName = 'Surname is required';
    }

    // Validate income source specific fields
    if (formData.incomeSource === 'business' && !formData.businessRegNo.trim()) {
      newErrors.businessRegNo = 'Business registration number or name is required';
    }

    if (formData.incomeSource === 'employed') {
      if (!formData.selectedCompany) {
        newErrors.selectedCompany = 'Please select your employer';
      } else if (formData.selectedCompany === 'Other' && !formData.employerName.trim()) {
        newErrors.employerName = 'Please specify your employer name';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      sessionStorage.setItem('customerInfo', JSON.stringify(formData));
      navigate('/products', { state: { customerInfo: formData } });
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${bgImage})`,
      }}
    >
      {/* Header */}
      <header className="bg-white border-b border-ncb-divider sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 text-ncb-text hover:text-ncb-blue text-sm transition-colors"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/images/logo.png"
                alt="NCBA Mortgage Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="font-semibold text-ncb-blue"></span>
            </div>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <main className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Message */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-ncb-blue mb-4 ">
              Welcome to NCBA Bank
            </h1>
            <p className="text-lg text-ncb-text">
              Your NCBA home ownership journey starts here.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-ncb-divider p-8 shadow-sm">
            {/* NCB Account Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-ncb-blue mb-3">
                Do you have an NCBA account? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasNCBAccount"
                    value="yes"
                    checked={formData.hasNCBAccount === 'yes'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-ncb-blue cursor-pointer"
                  />
                  <span className="text-ncb-text">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasNCBAccount"
                    value="no"
                    checked={formData.hasNCBAccount === 'no'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-ncb-blue cursor-pointer"
                  />
                  <span className="text-ncb-text">No</span>
                </label>
              </div>
              {errors.hasNCBAccount && (
                <p className="text-sm text-red-500 mt-2">{errors.hasNCBAccount}</p>
              )}
            </div>

            {/* Source of Income Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-ncb-blue mb-3">
                Source of Income <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="incomeSource"
                    value="employed"
                    checked={formData.incomeSource === 'employed'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-ncb-blue cursor-pointer"
                  />
                  <span className="text-ncb-text">Employed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="incomeSource"
                    value="business"
                    checked={formData.incomeSource === 'business'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-ncb-blue cursor-pointer"
                  />
                  <span className="text-ncb-text">Business</span>
                </label>
              </div>
              {errors.incomeSource && (
                <p className="text-sm text-red-500 mt-2">{errors.incomeSource}</p>
              )}
            </div>

            {/* Business Fields */}
            {formData.incomeSource === 'business' && (
              <div className="mb-8 p-4 bg-ncb-blue-50 rounded-lg border border-ncb-blue-100">
                <label className="block text-sm font-semibold text-ncb-blue mb-3">
                  Reg No / Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessRegNo"
                  value={formData.businessRegNo}
                  onChange={handleInputChange}
                  placeholder="Enter your business registration number or name"
                  className={`w-full px-4 py-3 border rounded-lg text-ncb-heading font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ncb-blue focus:border-transparent transition-all ${
                    errors.businessRegNo ? 'border-red-500' : 'border-gray-300 hover:border-ncb-blue'
                  }`}
                />
                {errors.businessRegNo && (
                  <p className="text-sm text-red-500 mt-2">{errors.businessRegNo}</p>
                )}
              </div>
            )}

            {/* Employed Fields */}
            {formData.incomeSource === 'employed' && (
              <div className="mb-8 p-4 bg-ncb-blue-50 rounded-lg border border-ncb-blue-100">
                <label className="block text-sm font-semibold text-ncb-blue mb-3">
                  Select Your Employer <span className="text-red-500">*</span>
                </label>
                
                {/* Autocomplete Input */}
                <div className="relative mb-4">
                  {formData.selectedCompany ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-4 py-3 border border-green-300 bg-green-50 rounded-lg text-ncb-heading font-medium">
                        {formData.selectedCompany}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            selectedCompany: '',
                            employerName: ''
                          }));
                          setCompanySearch('');
                        }}
                        className="px-4 py-3 text-sm font-medium text-ncb-blue hover:bg-ncb-blue-50 rounded-lg transition-colors"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={companySearch}
                        onChange={handleCompanySearch}
                        onFocus={() => setShowCompanySuggestions(true)}
                        placeholder="Type employer name..."
                        className={`w-full px-4 py-3 border rounded-lg text-ncb-heading font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ncb-blue focus:border-transparent transition-all ${
                          errors.selectedCompany ? 'border-red-500' : 'border-gray-300 hover:border-ncb-blue'
                        }`}
                      />
                      
                      {/* Suggestions Dropdown */}
                      {showCompanySuggestions && filteredCompanies.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-ncb-blue-100 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                          {filteredCompanies.map((company) => (
                            <button
                              key={company}
                              type="button"
                              onClick={() => handleSelectCompany(company)}
                              className="w-full text-left px-4 py-3 hover:bg-ncb-blue-50 text-ncb-heading font-medium transition-colors border-b border-ncb-divider last:border-b-0"
                            >
                              {company}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* No results message */}
                      {showCompanySuggestions && companySearch && filteredCompanies.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-ncb-blue-100 rounded-lg shadow-lg z-10 p-4">
                          <p className="text-sm text-ncb-text">No matching employers found. Select "Other" from the list or type "other"</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {errors.selectedCompany && (
                  <p className="text-sm text-red-500 mt-2">{errors.selectedCompany}</p>
                )}

                {/* Other Employer Name Field */}
                {formData.selectedCompany === 'Other' && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-ncb-blue mb-3">
                      Please specify employer name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="employerName"
                      value={formData.employerName}
                      onChange={handleInputChange}
                      placeholder="Enter your employer name"
                      className={`w-full px-4 py-3 border rounded-lg text-ncb-heading font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ncb-blue focus:border-transparent transition-all ${
                        errors.employerName ? 'border-red-500' : 'border-gray-300 hover:border-ncb-blue'
                      }`}
                    />
                    {errors.employerName && (
                      <p className="text-sm text-red-500 mt-2">{errors.employerName}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ID Number Field */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-ncb-blue mb-3">
                Applicant ID No. <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                maxLength="20"
                placeholder="Enter your ID or Passport number"
                className={`w-full px-4 py-3 border rounded-lg text-ncb-heading font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ncb-blue focus:border-transparent transition-all ${
                  errors.idNumber ? 'border-red-500' : 'border-gray-300 hover:border-ncb-blue'
                }`}
              />
              <div className="flex justify-between items-start mt-2">
                <p className="text-xs text-ncb-text">(ID / Passport)</p>
                <p className="text-xs text-ncb-text">
                  {formData.idNumber.length} of 20 max characters
                </p>
              </div>
              {errors.idNumber && (
                <p className="text-sm text-red-500 mt-2">{errors.idNumber}</p>
              )}
            </div>

            {/* Applicant Name Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-ncb-blue mb-3">
                Applicant Name <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    className={`w-full px-4 py-3 border rounded-lg text-ncb-heading font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ncb-blue focus:border-transparent transition-all ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300 hover:border-ncb-blue'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-2">{errors.firstName}</p>
                  )}
                  <p className="text-xs text-ncb-text mt-2">First</p>
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Other names"
                    className={`w-full px-4 py-3 border rounded-lg text-ncb-heading font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ncb-blue focus:border-transparent transition-all ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300 hover:border-ncb-blue'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-2">{errors.lastName}</p>
                  )}
                  <p className="text-xs text-ncb-text mt-2">Last</p>
                </div>
              </div>
            </div>

            {/* Sir Name Field */}
            <div className="mb-10">
              <label className="block text-sm font-semibold text-ncb-blue mb-3">
                Surname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sirName"
                value={formData.sirName}
                onChange={handleInputChange}
                placeholder="Enter your surname"
                className={`w-full px-4 py-3 border rounded-lg text-ncb-heading font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ncb-blue focus:border-transparent transition-all ${
                  errors.sirName ? 'border-red-500' : 'border-gray-300 hover:border-ncb-blue'
                }`}
              />
              {errors.sirName && (
                <p className="text-sm text-red-500 mt-2">{errors.sirName}</p>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="w-full bg-ncb-blue hover:bg-ncb-blue-dark text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Next
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Info Text */}
          <div className="mt-8 p-6 bg-ncb-blue-50 rounded-lg border border-ncb-blue-100">
            <p className="text-sm text-ncb-text">
              <span className="font-semibold text-ncb-heading">Privacy Notice:</span> Your personal information will be securely stored and used only for your mortgage application and in accordance with NCBA's privacy policy.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

