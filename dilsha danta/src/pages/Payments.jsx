import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { formatCurrency, getMonthName } from '../utils/helpers';
import { Download, Calendar } from 'lucide-react';

export const Payments = () => {
  const { workers, getWorkerPaymentDetails, getTotalMonthlyPayment } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const paymentData = useMemo(() => {
    return workers
      .map(worker => getWorkerPaymentDetails(worker.id, selectedYear, selectedMonth))
      .filter(Boolean);
  }, [workers, selectedMonth, selectedYear]);

  const totalPayment = useMemo(
    () => getTotalMonthlyPayment(selectedYear, selectedMonth),
    [selectedYear, selectedMonth]
  );

  const years = Array.from({ length: 5 }, (_, i) => 
    new Date().getFullYear() - i
  );

  const handleExport = () => {
    const csv = [
      ['Payment Report', getMonthName(selectedMonth), selectedYear].join(' - '),
      [''],
      ['Worker Name', 'Email', 'Phone', 'Daily Wage', 'Present Days', 'Half Days', 'Absent Days', 'Total Payment'],
      ...paymentData.map(d => [
        d.worker.name,
        d.worker.email,
        d.worker.phone,
        `₹${d.dailyWage}`,
        d.presentDays,
        d.halfDays,
        d.absentDays,
        `₹${d.totalPayment}`,
      ]),
      [''],
      ['TOTAL PAYMENT', '', '', '', '', '', '', `₹${totalPayment}`],
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payment-report-${selectedYear}-${String(selectedMonth).padStart(2, '0')}.csv`;
    link.click();
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <Header title="Payment Management" />

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Filters and Export */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
            {/* Month Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="input-field"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>
                    {getMonthName(month)}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="input-field"
              >
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="btn-primary flex items-center gap-2"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>

          {/* Summary Card */}
          <div className="card mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Total Monthly Payment ({getMonthName(selectedMonth)} {selectedYear})
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
                  {formatCurrency(totalPayment, 'INR')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 dark:text-gray-400 font-medium">Total Workers</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
                  {paymentData.length}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Table */}
          <div className="card overflow-x-auto">
            {paymentData.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Worker Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Daily Wage
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Present Days
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Half Days
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Absent Days
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                      Total Payment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentData.map((payment, index) => (
                    <tr key={index} className="table-row">
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                        {payment.worker.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {formatCurrency(payment.dailyWage, 'INR')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium">
                          {payment.presentDays}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                          {payment.halfDays}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm font-medium">
                          {payment.absentDays}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-900 dark:text-white font-bold text-lg">
                        {formatCurrency(payment.totalPayment, 'INR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 font-bold">
                    <td colSpan="5" className="px-6 py-4 text-right text-gray-900 dark:text-white">
                      TOTAL:
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900 dark:text-white text-lg">
                      {formatCurrency(totalPayment, 'INR')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No payment data available for {getMonthName(selectedMonth)} {selectedYear}
                </p>
              </div>
            )}
          </div>

          {/* Calculation Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Payment Calculation</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Full Day = 100% of Daily Wage</li>
                <li>✓ Half Day = 50% of Daily Wage</li>
                <li>✓ Absent = 0% of Daily Wage</li>
                <li>✓ Total Payment = (Present Days × Daily Wage) + (Half Days × 50% Of Daily Wage)</li>
              </ul>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Payment Summary</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Workers:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{paymentData.length}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Period:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getMonthName(selectedMonth)} {selectedYear}
                  </span>
                </li>
                <li className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white font-bold">Total Payment:</span>
                  <span className="font-bold text-lg text-purple-600 dark:text-purple-400">
                    {formatCurrency(totalPayment, 'INR')}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
