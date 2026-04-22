import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function WelcomePage({ onNavigateToProducts }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerType: 'existing',
    idNumber: '',
    firstName: '',
    lastName: '',
    sirName: ''
  });

  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};

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
      newErrors.sirName = 'Sir name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      // Store customer data in sessionStorage or pass through context
      sessionStorage.setItem('customerInfo', JSON.stringify(formData));
      navigate('/products', { state: { customerInfo: formData } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
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
              <span className="font-semibold text-ncb-blue">NCBA Mortgage</span>
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
            {/* Customer Type Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-ncb-blue mb-3">
                Are you an existing or new customer? <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-ncb-heading font-medium appearance-none cursor-pointer hover:border-ncb-blue focus:outline-none focus:ring-2 focus:ring-ncb-blue focus:border-transparent transition-all"
                >
                  <option value="existing">Existing</option>
                  <option value="new">New</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-ncb-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            </div>

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
