import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { StatsCard } from '../components/StatsCard';
import { Users, CheckCircle, Clock, AlertCircle, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export const Dashboard = () => {
  const { workers, getTodayStats, getTotalMonthlyPayment } = useApp();

  const stats = useMemo(() => getTodayStats(), [workers]);

  const currentDate = new Date();
  const monthlyPayment = useMemo(
    () => getTotalMonthlyPayment(currentDate.getFullYear(), currentDate.getMonth() + 1),
    [getTotalMonthlyPayment]
  );

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const monthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <div className="flex-1 flex flex-col h-full">
      <Header title="Dashboard" />

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Date and Month Info */}
          <div className="mb-8">
            <h2 className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatsCard
              title="Total Workers"
              value={stats.totalWorkers}
              icon={Users}
              color="blue"
            />
            <StatsCard
              title="Present Today"
              value={stats.presentToday}
              icon={CheckCircle}
              color="green"
              details={`${stats.notMarked} not marked`}
            />
            <StatsCard
              title="Half Day"
              value={stats.halfDayToday}
              icon={Clock}
              color="yellow"
            />
            <StatsCard
              title="Absent"
              value={stats.absentToday}
              icon={AlertCircle}
              color="red"
            />
            <StatsCard
              title={`Payment (${monthYear.split(' ')[0]})`}
              value={formatCurrency(monthlyPayment, 'INR').split('.')[0]}
              icon={DollarSign}
              color="purple"
            />
          </div>

          {/* Quick Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Summary */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Today's Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                  <span className="text-green-900 dark:text-green-100 font-medium">Present</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.presentToday}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                  <span className="text-yellow-900 dark:text-yellow-100 font-medium">Half Day</span>
                  <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.halfDayToday}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900 rounded-lg">
                  <span className="text-red-900 dark:text-red-100 font-medium">Absent</span>
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {stats.absentToday}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <span className="text-blue-900 dark:text-blue-100 font-medium">Not Marked</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.notMarked}
                  </span>
                </div>
              </div>
            </div>

            {/* Monthly Overview */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {monthYear} Overview
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Workers</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalWorkers}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Total Monthly Payment
                  </p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {formatCurrency(monthlyPayment, 'INR')}
                  </p>
                </div>
                <button className="w-full btn-primary py-2 text-sm">
                  View Monthly Sheet
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
