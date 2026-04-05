import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { getDaysInMonth, getMonthName, getCurrentDate } from '../utils/helpers';
import { Calendar, Download } from 'lucide-react';

export const MonthlySheet = () => {
  const { workers, getMonthlyAttendance } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const daysInMonth = useMemo(
    () => getDaysInMonth(selectedYear, selectedMonth),
    [selectedYear, selectedMonth]
  );

  const attendanceMatrix = useMemo(() => {
    return workers.map(worker => ({
      worker,
      attendance: getMonthlyAttendance(worker.id, selectedYear, selectedMonth),
    }));
  }, [workers, selectedMonth, selectedYear]);

  const getAttendanceDisplay = (attendance, date) => {
    const dateStr = String(date).padStart(2, '0');
    const fullDateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${dateStr}`;
    const status = attendance[fullDateStr];
    
    if (status === 'present') return 'P';
    if (status === 'half') return 'H';
    if (status === 'absent') return 'A';
    return '-';
  };

  const getColorClass = (status) => {
    switch (status) {
      case 'P':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'H':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'A':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const handleExport = () => {
    const csv = [
      [`Attendance Report - ${getMonthName(selectedMonth)} ${selectedYear}`],
      [''],
      ['Worker Name', ...Array.from({ length: daysInMonth }, (_, i) => i + 1)],
      ...attendanceMatrix.map(({ worker, attendance }) => [
        worker.name,
        ...Array.from({ length: daysInMonth }, (_, i) => 
          getAttendanceDisplay(attendance, i + 1)
        ),
      ]),
    ]
      .map(row => {
        // Properly escape CSV fields
        return row.map(cell => {
          const str = String(cell);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(',');
      })
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `attendance-${selectedYear}-${String(selectedMonth).padStart(2, '0')}.csv`;
    link.click();
  };

  const years = Array.from({ length: 5 }, (_, i) => 
    new Date().getFullYear() - i
  );

  return (
    <div className="flex-1 flex flex-col h-full">
      <Header title="Monthly Attendance Sheet" />

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-full mx-auto">
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

          {/* Legend */}
          <div className="card mb-6">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <span className="inline-block w-6 h-6 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-bold flex items-center justify-center">
                  P
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Present (Full Day)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-6 h-6 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs font-bold flex items-center justify-center">
                  H
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Half Day</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-6 h-6 rounded bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-bold flex items-center justify-center">
                  A
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-6 h-6 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-xs font-bold flex items-center justify-center">
                  -
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Not Marked</span>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="card overflow-x-auto">
            <div className="inline-block min-w-full">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 border-b-2 dark:border-gray-600">
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white border-r dark:border-gray-600 sticky left-0 bg-gray-100 dark:bg-gray-700 z-10 min-w-48">
                      Worker Name
                    </th>
                    {Array.from({ length: daysInMonth }, (_, i) => (
                      <th
                        key={i}
                        className="px-3 py-4 text-center font-semibold text-gray-900 dark:text-white text-xs border-r dark:border-gray-600"
                      >
                        {i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attendanceMatrix.map((item, rowIndex) => (
                    <tr
                      key={item.worker.id}
                      className={`border-b dark:border-gray-700 ${
                        rowIndex % 2 === 0
                          ? 'bg-white dark:bg-gray-800'
                          : 'bg-gray-50 dark:bg-gray-900'
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white border-r dark:border-gray-600 sticky left-0 z-10 min-w-48 bg-inherit">
                        {item.worker.name}
                      </td>
                      {Array.from({ length: daysInMonth }, (_, i) => {
                        const status = getAttendanceDisplay(item.attendance, i + 1);
                        return (
                          <td
                            key={i}
                            className={`px-3 py-4 text-center text-sm font-bold border-r dark:border-gray-600 ${getColorClass(
                              status
                            )}`}
                          >
                            {status}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="card">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Workers</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {attendanceMatrix.length}
              </p>
            </div>
            <div className="card">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Days in Month</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {daysInMonth}
              </p>
            </div>
            <div className="card">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Days</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {attendanceMatrix.length * daysInMonth}
              </p>
            </div>
            <div className="card">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Period</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {getMonthName(selectedMonth)} '{String(selectedYear).slice(-2)}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
