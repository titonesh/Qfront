import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Phone, CheckCircle, Clock, Users, Download } from 'lucide-react';
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

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
      return;
    }
    fetchCallbacks();
  }, []);

  const fetchCallbacks = async () => {
    try {
      const data = await callbackService.getAllCallbacks();
      setCallbacks(data.items || []);
    } catch (error) {
      console.error('Failed to fetch callbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const handleBulkContacted = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    await callbackService.bulkUpdateCallbacks(ids, 'markContacted');
    setSelectedIds(new Set());
    fetchCallbacks();
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
        'Status': callback.isProcessed ? 'Contacted' : 'Pending',
        'Date Contacted': callback.processedAt ? formatDate(callback.processedAt) : '-',
        // Loan Input Details
        'Product Type': loanInputs.productType || '-',
        'Income Type': loanInputs.incomeSource || '-',
        'Monthly Salary': loanInputs.monthlySalaryIncome ? `KES ${Number(loanInputs.monthlySalaryIncome).toLocaleString()}` : '-',
        'Employer Name': loanInputs.employerName || '-',
        'Monthly Business Income': loanInputs.monthlyBusinessIncome ? `KES ${Number(loanInputs.monthlyBusinessIncome).toLocaleString()}` : '-',
        'Nature of Business': loanInputs.natureOfBusiness || '-',
        'Business Location': loanInputs.businessLocation || '-',
        'Monthly Rental': loanInputs.monthlyRentalPayments ? `KES ${Number(loanInputs.monthlyRentalPayments).toLocaleString()}` : '-',
        'Existing Loan Obligations': loanInputs.existingLoanObligations ? `KES ${Number(loanInputs.existingLoanObligations).toLocaleString()}` : '-',
        'Credit Card Limit': loanInputs.creditCardLimit > 0 ? `KES ${Number(loanInputs.creditCardLimit).toLocaleString()}` : '-',
        'Overdraft Limit': loanInputs.overdraftLimit > 0 ? `KES ${Number(loanInputs.overdraftLimit).toLocaleString()}` : '-',
        'ID Number': loanInputs.idNumber || '-',
        'Preferred Loan Tenor': loanInputs.loanTenorYears ? `${loanInputs.loanTenorYears} years` : '-',
        // Loan Results
        'Max Loan Amount': loanResult.maximumLoanAmount ? `KES ${Number(loanResult.maximumLoanAmount).toLocaleString()}` : '-',
        'Adjusted Income': loanResult.adjustedIncome ? `KES ${Number(loanResult.adjustedIncome).toLocaleString()}` : '-',
        'Monthly Repayment': loanResult.estimatedMonthlyRepayment ? `KES ${Number(loanResult.estimatedMonthlyRepayment).toLocaleString()}` : '-',
        'Stress Test Repayment': loanResult.stressTestedRepayment ? `KES ${Number(loanResult.stressTestedRepayment).toLocaleString()}` : '-',
        'Interest Rate': loanResult.appliedInterestRate ? `${(loanResult.appliedInterestRate * 100).toFixed(2)}%` : '-',
        'Stress Rate': loanResult.appliedStressTestRate ? `${(loanResult.appliedStressTestRate * 100).toFixed(2)}%` : '-',
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
    total: callbacks.length,
    pending: callbacks.filter(c => !c.isProcessed).length,
    contacted: callbacks.filter(c => c.isProcessed).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-ncb-divider sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-ncb-heading">Admin Dashboard</h1>
            <button onClick={handleLogout} className="flex items-center gap-2 text-ncb-text hover:text-red-600 transition-colors">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ncb-text text-sm">Total Callbacks</p>
                <p className="text-3xl font-bold text-ncb-heading">{stats.total}</p>
              </div>
              <Phone size={32} className="text-ncb-blue" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ncb-text text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock size={32} className="text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ncb-text text-sm">Contacted</p>
                <p className="text-3xl font-bold text-green-600">{stats.contacted}</p>
              </div>
              <CheckCircle size={32} className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-card mb-6 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {selectedIds.size > 0 && (
              <button onClick={handleBulkContacted} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Mark Selected as Contacted ({selectedIds.size})
              </button>
            )}
          </div>
          <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 border border-ncb-divider rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} /> Export Excel
          </button>
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ncb-text uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ncb-text uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ncb-text uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ncb-text uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ncb-text uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ncb-text uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {callbacks.map((callback) => (
                  <tr
                    key={callback.id}
                    onClick={() => setSelectedCallback(callback)}
                    className="border-b border-ncb-divider hover:bg-blue-50 cursor-pointer transition-colors"
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
                    <td className="px-6 py-4 text-sm text-ncb-text">{callback.id}</td>
                    <td className="px-6 py-4 text-sm text-ncb-text">{formatDate(callback.createdAt)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-ncb-heading">{callback.fullName}</td>
                    <td className="px-6 py-4 text-sm text-ncb-text">{callback.phoneNumber}</td>
                    <td className="px-6 py-4 text-sm text-ncb-text">{callback.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${callback.isProcessed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {callback.isProcessed ? 'Contacted' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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