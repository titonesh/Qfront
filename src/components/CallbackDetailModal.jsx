import React from 'react';
import { X, User, Phone, Mail, MessageSquare, FileText, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function CallbackDetailModal({ callback, onClose }) {
  if (!callback) return null;

  // Parse JSON data if available
  const loanInputs = callback.loanInputsJson ? JSON.parse(callback.loanInputsJson) : null;
  const loanResult = callback.loanResultJson ? JSON.parse(callback.loanResultJson) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-ncb-divider p-3.5 flex justify-between items-center">
          <h2 className="text-lg font-bold text-ncb-heading">Callback Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Customer Information */}
          <div>
            <h3 className="text-xs font-semibold text-ncb-heading mb-2.5 flex items-center gap-2">
              <User size={16} className="text-ncb-blue" />
              CUSTOMER INFO
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-ncb-text">Full Name</p>
                <p className="text-sm font-medium text-ncb-heading">{callback.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-ncb-text flex items-center gap-1">
                  <Phone size={12} />
                  Phone
                </p>
                <p className="text-sm font-medium text-ncb-heading">{callback.phoneNumber}</p>
              </div>
              <div>
                <p className="text-xs text-ncb-text flex items-center gap-1">
                  <Mail size={12} />
                  Email
                </p>
                <p className="text-sm font-medium text-ncb-heading">{callback.email}</p>
              </div>
              {callback.referralNumber && (
                <div>
                  <p className="text-xs text-ncb-text">Referral Code</p>
                  <p className="text-sm font-medium text-ncb-heading">{callback.referralNumber}</p>
                </div>
              )}
              {callback.message && (
                <div>
                  <p className="text-xs text-ncb-text">Message</p>
                  <p className="text-sm text-ncb-heading bg-gray-50 p-2 rounded border border-ncb-divider">
                    {callback.message}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-ncb-text">Submitted</p>
                <p className="text-sm font-medium text-ncb-heading">{formatDate(callback.createdAt)}</p>
              </div>
              {callback.isProcessed && callback.processedAt && (
                <div>
                  <p className="text-xs text-ncb-text">Contacted</p>
                  <p className="text-sm font-medium text-green-600">{formatDate(callback.processedAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Loan Input Details */}
          {loanInputs && (
            <div>
              <h3 className="text-xs font-semibold text-ncb-heading mb-2.5 flex items-center gap-2">
                <FileText size={16} className="text-yellow-600" />
                LOAN INPUTS
              </h3>
              <div className="space-y-2">
                {loanInputs.customerType && (
                  <div>
                    <p className="text-xs text-ncb-text">Customer Type</p>
                    <p className="text-sm font-medium text-ncb-heading capitalize">
                      {loanInputs.customerType}
                    </p>
                  </div>
                )}
                {loanInputs.idNumber && (
                  <div>
                    <p className="text-xs text-ncb-text">ID Number</p>
                    <p className="text-sm font-medium text-ncb-heading font-mono">{loanInputs.idNumber}</p>
                  </div>
                )}
                {loanInputs.productType && (
                  <div>
                    <p className="text-xs text-ncb-text">Product Type</p>
                    <p className="text-sm font-medium text-ncb-heading capitalize">
                      {loanInputs.productType.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </div>
                )}
                {loanInputs.incomeSource && (
                  <div>
                    <p className="text-xs text-ncb-text">Income Type</p>
                    <p className="text-sm font-medium text-ncb-heading capitalize">
                      {loanInputs.incomeSource}
                    </p>
                  </div>
                )}
                {loanInputs.monthlySalaryIncome > 0 && (
                  <div>
                    <p className="text-xs text-ncb-text">Monthly Salary Income</p>
                    <p className="text-sm font-medium text-ncb-heading">
                      {formatCurrency(loanInputs.monthlySalaryIncome)}
                    </p>
                  </div>
                )}
                {loanInputs.employerName && (
                  <div>
                    <p className="text-xs text-ncb-text">Employer Name</p>
                    <p className="text-sm font-medium text-ncb-heading">
                      {loanInputs.employerName}
                    </p>
                  </div>
                )}
                {loanInputs.monthlyBusinessIncome > 0 && (
                  <div>
                    <p className="text-xs text-ncb-text">Monthly Business Income</p>
                    <p className="text-sm font-medium text-ncb-heading">
                      {formatCurrency(loanInputs.monthlyBusinessIncome)}
                    </p>
                  </div>
                )}
                {loanInputs.natureOfBusiness && (
                  <div>
                    <p className="text-xs text-ncb-text">Nature of Business</p>
                    <p className="text-sm font-medium text-ncb-heading">
                      {loanInputs.natureOfBusiness}
                    </p>
                  </div>
                )}
                {loanInputs.businessLocation && (
                  <div>
                    <p className="text-xs text-ncb-text">Business Location</p>
                    <p className="text-sm font-medium text-ncb-heading">
                      {loanInputs.businessLocation}
                    </p>
                  </div>
                )}
                {loanInputs.monthlyRentalPayments > 0 && (
                  <div>
                    <p className="text-xs text-ncb-text">Monthly Rental Payments</p>
                    <p className="text-sm font-medium text-ncb-heading">
                      {formatCurrency(loanInputs.monthlyRentalPayments)}
                    </p>
                  </div>
                )}
                {loanInputs.existingLoanObligations > 0 && (
                  <div>
                    <p className="text-xs text-ncb-text">Existing Loan Obligations</p>
                    <p className="text-sm font-medium text-ncb-heading">
                      {formatCurrency(loanInputs.existingLoanObligations)}
                    </p>
                  </div>
                )}
                {(loanInputs.creditCardLimit > 0 || loanInputs.overdraftLimit > 0) && (
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <p className="text-xs text-ncb-text font-semibold mb-2">Credit Facilities</p>
                    {loanInputs.creditCardLimit > 0 && (
                      <div className="flex justify-between text-sm mb-1">
                        <p className="text-ncb-text">Credit Card Limit:</p>
                        <p className="font-medium text-ncb-heading">
                          {formatCurrency(loanInputs.creditCardLimit)}
                        </p>
                      </div>
                    )}
                    {loanInputs.overdraftLimit > 0 && (
                      <div className="flex justify-between text-sm">
                        <p className="text-ncb-text">Overdraft Limit:</p>
                        <p className="font-medium text-ncb-heading">
                          {formatCurrency(loanInputs.overdraftLimit)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {loanInputs.loanTenorYears && (
                  <div>
                    <p className="text-xs text-ncb-text">Preferred Loan Tenor</p>
                    <p className="text-sm font-medium text-ncb-heading">
                      {loanInputs.loanTenorYears} years
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Loan Calculation Results */}
          {loanResult && (
            <div>
              <h3 className="text-xs font-semibold text-ncb-heading mb-2.5 flex items-center gap-2">
                <DollarSign size={16} className="text-green-600" />
                LOAN RESULTS
              </h3>
              <div className="space-y-2">
                <div className="bg-blue-50 p-2 rounded border border-blue-200">
                  <p className="text-xs text-ncb-text">Max Loan Amount</p>
                  <p className="text-lg font-bold text-ncb-blue">
                    {formatCurrency(loanResult.maximumLoanAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ncb-text">Adjusted Income</p>
                  <p className="text-sm font-medium text-ncb-heading">
                    {formatCurrency(loanResult.adjustedIncome)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ncb-text">Monthly Repayment</p>
                  <p className="text-sm font-medium text-ncb-heading">
                    {formatCurrency(loanResult.estimatedMonthlyRepayment)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ncb-text">Stress Test Repayment</p>
                  <p className="text-sm font-medium text-ncb-heading">
                    {formatCurrency(loanResult.stressTestedRepayment)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-ncb-text">Interest Rate</p>
                    <p className="text-sm font-medium text-ncb-heading">
                      {(loanResult.appliedInterestRate * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-ncb-text">Stress Rate</p>
                    <p className="text-sm font-medium text-ncb-heading">
                      {(loanResult.appliedStressTestRate * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
                {loanResult.eligibilityMessage && (
                  <div>
                    <p className="text-xs text-ncb-text">Status</p>
                    <p className="text-xs text-ncb-heading bg-white p-2 rounded border border-ncb-divider">
                      {loanResult.eligibilityMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No Data Message */}
          {!loanInputs && !loanResult && (
            <div className="bg-gray-50 p-3 rounded border border-ncb-divider text-center">
              <p className="text-xs text-ncb-text">No loan calculation details available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-3.5 border-t border-ncb-divider flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ncb-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
