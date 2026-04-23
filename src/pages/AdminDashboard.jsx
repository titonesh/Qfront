import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Download, Search, Filter, X, ArrowUpDown, Copy, Check } from 'lucide-react';
import * as XLSX from 'xlsx';
import callbackService from '../services/callbackService';
import { formatCurrency, formatDate } from '../utils/formatters';
import CallbackDetailModal from '../components/CallbackDetailModal';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [callbacks, setCallbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedCallback, setSelectedCallback] = useState(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // Sorting state
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Action state
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
      return;
    }
    fetchCallbacks();
  }, [page, statusFilter, dateRange, searchQuery]);

  const fetchCallbacks = async () => {
    try {
      setLoading(true);
      const data = await callbackService.getAllCallbacks(
        page,
        pageSize,
        searchQuery,
        statusFilter,
        dateRange
      );
      setCallbacks(data.items || []);
      setTotalItems(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch callbacks:', error);
      showToast('Failed to fetch callbacks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const showConfirm = (title, message, onConfirm) => {
    setConfirmDialog({ title, message, onConfirm });
  };

  const handleBulkContacted = async () => {
    showConfirm(
      'Mark as Contacted',
      `Are you sure you want to mark ${selectedIds.size} selected item(s) as contacted?`,
      async () => {
        try {
          setActionLoading(true);
          const ids = Array.from(selectedIds);
          await callbackService.bulkUpdateCallbacks(ids, 'markContacted');
          setSelectedIds(new Set());
          setConfirmDialog(null);
          showToast(`Successfully marked ${ids.length} item(s) as contacted`);
          fetchCallbacks();
        } catch (error) {
          showToast('Failed to update callbacks', 'error');
        } finally {
          setActionLoading(false);
        }
      }
    );
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id.toString());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper function to safely format numeric values for Excel
  const formatForExcel = (value, prefix = 'KES') => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    const num = Number(value);
    if (isNaN(num)) {
      return '-';
    }
    if (prefix === 'KES') {
      return `${prefix} ${num.toLocaleString()}`;
    }
    if (prefix === '%') {
      return `${(num * 100).toFixed(2)}%`;
    }
    return num.toLocaleString();
  };

  const handleExportExcel = () => {
    if (callbacks.length === 0) {
      alert('No data to export');
      return;
    }

    // Prepare data for export
    const exportData = callbacks.map((callback) => {
      const loanInputs = callback.loanInputsJson ? JSON.parse(callback.loanInputsJson) : {};
      const loanResult = callback.loanResultJson ? JSON.parse(callback.loanResultJson) : {};

      return {
        'ID': callback.id,
        'Date Submitted': formatDate(callback.createdAt),
        'Full Name': callback.fullName,
        'Phone Number': callback.phoneNumber,
        'Email': callback.email,
        'Message': callback.message || '-',
        'Referral Code': callback.referralNumber || '-',
        'Preferred Branch': callback.preferredBranch || '-',
        'Status': callback.isProcessed ? 'Contacted' : 'Pending',
        'Date Contacted': callback.processedAt ? formatDate(callback.processedAt) : '-',
        // Loan Input Details
        'Product Type': loanInputs.productType || '-',
        'Income Type': loanInputs.incomeSource || '-',
        'Monthly Salary': formatForExcel(loanInputs.monthlySalaryIncome),
        'Employer Name': loanInputs.employerName || '-',
        'Monthly Business Income': formatForExcel(loanInputs.monthlyBusinessIncome),
        'Nature of Business': loanInputs.natureOfBusiness || '-',
        'Business Location': loanInputs.businessLocation || '-',
        'Monthly Rental': formatForExcel(loanInputs.monthlyRentalPayments),
        'Existing Loan Obligations': formatForExcel(loanInputs.existingLoanObligations),
        'Credit Card Limit': formatForExcel(loanInputs.creditCardLimit),
        'Overdraft Limit': formatForExcel(loanInputs.overdraftLimit),
        'ID Number': loanInputs.idNumber || '-',
        'Preferred Loan Tenor': loanInputs.loanTenorYears ? `${loanInputs.loanTenorYears} years` : '-',
        // Loan Results
        'Max Loan Amount': formatForExcel(loanResult.maximumLoanAmount),
        'Adjusted Income': formatForExcel(loanResult.adjustedIncome),
        'Monthly Repayment': formatForExcel(loanResult.estimatedMonthlyRepayment),
        'Stress Test Repayment': formatForExcel(loanResult.stressTestedRepayment),
        'Interest Rate': formatForExcel(loanResult.appliedInterestRate, '%'),
        'Stress Rate': formatForExcel(loanResult.appliedStressTestRate, '%'),
        'Eligibility Status': loanResult.eligibilityMessage || '-',
      };
    });

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Callbacks');

    // Style the header row
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + '1';
      if (!ws[address]) continue;
      ws[address].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '1E40AF' } },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      };
    }

    // Set column widths
    const colWidths = [
      { wch: 8 },   // ID
      { wch: 15 },  // Date Submitted
      { wch: 20 },  // Full Name
      { wch: 15 },  // Phone
      { wch: 25 },  // Email
      { wch: 20 },  // Message
      { wch: 15 },  // Referral Code
      { wch: 12 },  // Status
      { wch: 15 },  // Date Contacted
      { wch: 18 },  // Product Type
      { wch: 15 },  // Income Type
      { wch: 15 },  // Salary
      { wch: 20 },  // Employer
      { wch: 18 },  // Business Income
      { wch: 20 },  // Nature of Business
      { wch: 18 },  // Business Location
      { wch: 15 },  // Rental
      { wch: 18 },  // Loan Obligations
      { wch: 15 },  // Credit Card
      { wch: 15 },  // Overdraft
      { wch: 15 },  // ID Number
      { wch: 15 },  // Loan Tenor
      { wch: 18 },  // Max Loan
      { wch: 18 },  // Adjusted Income
      { wch: 18 },  // Monthly Repayment
      { wch: 20 },  // Stress Test
      { wch: 15 },  // Interest Rate
      { wch: 15 },  // Stress Rate
      { wch: 25 },  // Eligibility
    ];
    ws['!cols'] = colWidths;

    // Add alternating row colors
    for (let R = 2; R <= range.e.r + 1; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: R - 1, c: C });
        if (!ws[address]) continue;
        if (R % 2 === 0) {
          ws[address].s = {
            fill: { fgColor: { rgb: 'F3F4F6' } },
            alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
            border: {
              top: { style: 'thin', color: { rgb: 'D1D5DB' } },
              bottom: { style: 'thin', color: { rgb: 'D1D5DB' } },
              left: { style: 'thin', color: { rgb: 'D1D5DB' } },
              right: { style: 'thin', color: { rgb: 'D1D5DB' } },
            },
          };
        } else {
          ws[address].s = {
            fill: { fgColor: { rgb: 'FFFFFF' } },
            alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
            border: {
              top: { style: 'thin', color: { rgb: 'D1D5DB' } },
              bottom: { style: 'thin', color: { rgb: 'D1D5DB' } },
              left: { style: 'thin', color: { rgb: 'D1D5DB' } },
              right: { style: 'thin', color: { rgb: 'D1D5DB' } },
            },
          };
        }
      }
    }

    // Freeze header row
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `Mortgage_Callbacks_${timestamp}.xlsx`;

    // Write file
    XLSX.writeFile(wb, filename);
  };

  const stats = {
    total: totalItems,
    pending: callbacks.filter(c => !c.isProcessed).length,
    contacted: callbacks.filter(c => c.isProcessed).length,
    conversionRate: totalItems > 0 ? Math.round((callbacks.filter(c => c.isProcessed).length / callbacks.length) * 100) : 0,
  };

  // Calculate data insights
  const calculateInsights = () => {
    const allLoansWithInputs = callbacks.filter(c => c.loanInputsJson);
    
    if (allLoansWithInputs.length === 0) {
      return {
        avgLoanAmount: 0,
        avgTenor: 0,
        businessVsSalaried: { employed: 0, business: 0 },
        topProductTypes: [],
        avgMonthlyIncome: 0,
        topBranches: [],
      };
    }

    const loanInputs = allLoansWithInputs.map(c => {
      try {
        return JSON.parse(c.loanInputsJson);
      } catch {
        return null;
      }
    }).filter(Boolean);

    const loanResults = allLoansWithInputs.map(c => {
      try {
        return c.loanResultJson ? JSON.parse(c.loanResultJson) : null;
      } catch {
        return null;
      }
    }).filter(Boolean);

    // Average loan amount
    const totalLoanAmount = loanResults.reduce((sum, result) => sum + (Number(result.maximumLoanAmount) || 0), 0);
    const avgLoanAmount = loanResults.length > 0 ? totalLoanAmount / loanResults.length : 0;

    // Average tenor
    const totalTenor = loanInputs.reduce((sum, input) => sum + (Number(input.preferredLoanTenorYears) || 0), 0);
    const avgTenor = loanInputs.length > 0 ? (totalTenor / loanInputs.length).toFixed(1) : 0;

    // Business vs Employed - filter only entries with valid income source
    const employedCount = loanInputs.filter(input => input.incomeSource === 'employed').length;
    const businessCount = loanInputs.filter(input => input.incomeSource === 'business').length;
    const totalWithIncomeSource = employedCount + businessCount;
    const businessVsSalaried = {
      employed: totalWithIncomeSource > 0 ? Math.round((employedCount / totalWithIncomeSource) * 100) : 0,
      business: totalWithIncomeSource > 0 ? Math.round((businessCount / totalWithIncomeSource) * 100) : 0,
    };

    // Top product types - only count products that have a value
    const productCounts = {};
    loanInputs.forEach(input => {
      const product = input.productType;
      // Only count if product type is defined and not empty
      if (product && product.trim()) {
        productCounts[product] = (productCounts[product] || 0) + 1;
      }
    });
    const topProductTypes = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type, count]) => ({
        type: type.replace(/([A-Z])/g, ' $1').trim(),
        count,
        percentage: Math.round((count / Object.values(productCounts).reduce((sum, val) => sum + val, 0)) * 100),
      }));

    // Average monthly income
    const totalIncome = loanInputs.reduce((sum, input) => {
      const salary = Number(input.monthlySalaryIncome) || 0;
      const business = Number(input.monthlyBusinessIncome) || 0;
      return sum + salary + business;
    }, 0);
    const avgMonthlyIncome = loanInputs.length > 0 ? totalIncome / loanInputs.length : 0;

    // Top branches
    const branchCounts = {};
    callbacks.forEach(c => {
      if (c.preferredBranch) {
        branchCounts[c.preferredBranch] = (branchCounts[c.preferredBranch] || 0) + 1;
      }
    });
    const topBranches = Object.entries(branchCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([branch, count]) => ({ branch, count }));

    return {
      avgLoanAmount,
      avgTenor,
      businessVsSalaried,
      topProductTypes,
      avgMonthlyIncome,
      topBranches,
    };
  };

  const insights = calculateInsights();
  const totalPages = Math.ceil(totalItems / pageSize);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-ncb-blue"></div>
          <p className="mt-4 text-ncb-text">Loading callbacks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notifications */}
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg text-white z-50 animate-fade-in ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm p-6">
            <h3 className="text-lg font-bold text-ncb-heading mb-2">{confirmDialog.title}</h3>
            <p className="text-ncb-text mb-6">{confirmDialog.message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 border border-ncb-divider rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-ncb-divider sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-ncb-heading">Admin Dashboard</h1>
            <button onClick={handleLogout} className="flex items-center gap-2 text-ncb-text hover:text-ncb-blue transition-colors">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue rounded-xl p-6 shadow-card">
            <div>
              <p className="text-ncb-text text-sm">Total Callbacks</p>
              <p className="text-3xl font-bold text-ncb-blue">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-card">
            <div>
              <p className="text-ncb-text text-sm">Pending</p>
              <p className="text-3xl font-bold text-ncb-blue">{stats.pending}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-card">
            <div>
              <p className="text-ncb-text text-sm">Contacted</p>
              <p className="text-3xl font-bold text-ncb-blue">{stats.contacted}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-card">
            <div>
              <p className="text-ncb-text text-sm">Conversion Rate</p>
              <p className="text-3xl font-bold text-ncb-blue">{stats.conversionRate}%</p>
            </div>
          </div>
        </div>

        {/* Data Insights Section */}
        <div className="bg-white rounded-xl shadow-card mb-6 p-6">
          <h2 className="text-lg font-bold text-ncb-heading mb-6 flex items-center gap-2">
            <Users size={20} className="text-ncb-blue" />
            Data Insights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Average Loan Amount */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-xs font-semibold text-blue-600 mb-1">AVG LOAN AMOUNT</p>
              <p className="text-2xl font-bold text-blue-900">KES {(insights.avgLoanAmount / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-blue-600 mt-2">Based on {callbacks.length} applications</p>
            </div>

            {/* Average Tenor */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-xs font-semibold text-blue-600 mb-1">AVG LOAN TENOR</p>
              <p className="text-2xl font-bold text-green-900">{insights.avgTenor} <span className="text-lg">years</span></p>
              <p className="text-xs text-blue-600 mt-2">Customer preference</p>
            </div>

            {/* Average Monthly Income */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-xs font-semibold text-blue-600 mb-1">AVG MONTHLY INCOME</p>
              <p className="text-2xl font-bold text-purple-900">KES {(insights.avgMonthlyIncome / 1000).toFixed(0)}K</p>
              <p className="text-xs text-blue-600 mt-2">From all sources</p>
            </div>

            {/* Income Type Ratio */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-xs font-semibold text-blue-600 mb-1">INCOME TYPE SPLIT</p>
              <div className="space-y-1">
                <p className="text-sm"><span className="font-bold text-orange-900">{insights.businessVsSalaried.employed}%</span> <span className="text-xs text-blue-600">Employed</span></p>
                <p className="text-sm"><span className="font-bold text-blue-600">{insights.businessVsSalaried.business}%</span> <span className="text-xs text-blue-600">Business</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Product Types */}
            <div>
              <h3 className="text-sm font-semibold text-ncb-heading mb-4">Top Product Types</h3>
              <div className="space-y-3">
                {insights.topProductTypes.length > 0 ? (
                  insights.topProductTypes.map((product, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm text-ncb-text">{product.type}</p>
                        <p className="text-sm font-semibold text-ncb-heading">{product.count} ({product.percentage}%)</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-ncb-blue to-blue-600 h-2 rounded-full"
                          style={{ width: `${product.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No data available</p>
                )}
              </div>
            </div>

            {/* Top Branches */}
            <div>
              <h3 className="text-sm font-semibold text-ncb-heading mb-4">Top Branches</h3>
              <div className="space-y-3">
                {insights.topBranches.length > 0 ? (
                  insights.topBranches.map((branch, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-sm text-ncb-heading">{branch.branch}</p>
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-ncb-blue text-white text-xs font-semibold">
                        {branch.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No preferred branches yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-card mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, phone, email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-ncb-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-ncb-blue"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-ncb-divider rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} />
              Filters
            </button>

            {/* Export Button */}
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 border border-ncb-divider rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={18} /> Export
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-ncb-divider grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-ncb-heading mb-2 block">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-ncb-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-ncb-blue"
                >
                  <option value="all">All Status</option>
                  <option value="new">Pending</option>
                  <option value="contacted">Contacted</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-ncb-heading mb-2 block">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => {
                    setDateRange(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-ncb-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-ncb-blue"
                >
                  <option value="1d">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-ncb-heading mb-2 block">Items Per Page</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(parseInt(e.target.value));
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-ncb-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-ncb-blue"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-card mb-6 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {selectedIds.size > 0 && (
              <>
                <p className="text-sm text-ncb-text">{selectedIds.size} selected</p>
                <button
                  onClick={handleBulkContacted}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  Mark as Contacted
                </button>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-ncb-divider">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(new Set(callbacks.map(c => c.id)));
                        } else {
                          setSelectedIds(new Set());
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ncb-text uppercase cursor-pointer hover:bg-gray-100" onClick={() => setSortBy('id')}>
                    ID {sortBy === 'id' && <ArrowUpDown size={14} className="inline" />}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ncb-text uppercase cursor-pointer hover:bg-gray-100" onClick={() => setSortBy('date')}>
                    Date {sortBy === 'date' && <ArrowUpDown size={14} className="inline" />}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ncb-text uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ncb-text uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ncb-text uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ncb-text uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ncb-text uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {callbacks.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-ncb-text">
                      No callbacks found
                    </td>
                  </tr>
                ) : (
                  callbacks.map((callback) => (
                    <tr
                      key={callback.id}
                      className="border-b border-ncb-divider hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(callback.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            const newSet = new Set(selectedIds);
                            if (e.target.checked) newSet.add(callback.id);
                            else newSet.delete(callback.id);
                            setSelectedIds(newSet);
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-ncb-text cursor-pointer hover:text-ncb-blue flex items-center gap-2" onClick={() => handleCopyId(callback.id)}>
                        {callback.id}
                        {copiedId === callback.id ? (
                          <Check size={14} className="text-green-600" />
                        ) : (
                          <Copy size={14} className="opacity-0 group-hover:opacity-100" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-ncb-text">{formatDate(callback.createdAt)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-ncb-heading cursor-pointer hover:text-ncb-blue" onClick={() => setSelectedCallback(callback)}>
                        {callback.fullName}
                      </td>
                      <td className="px-6 py-4 text-sm text-ncb-text">{callback.phoneNumber}</td>
                      <td className="px-6 py-4 text-sm text-ncb-text truncate">{callback.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${callback.isProcessed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {callback.isProcessed ? 'Contacted' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => setSelectedCallback(callback)}
                          className="text-ncb-blue hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 border-t border-ncb-divider px-6 py-4 flex justify-between items-center">
              <p className="text-sm text-ncb-text">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalItems)} of {totalItems} results
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-ncb-divider rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded transition-colors ${p === page ? 'bg-ncb-blue text-white' : 'border border-ncb-divider hover:bg-gray-100'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-ncb-divider rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Callback Detail Modal */}
      <CallbackDetailModal
        callback={selectedCallback}
        onClose={() => setSelectedCallback(null)}
      />
    </div>
  );
}