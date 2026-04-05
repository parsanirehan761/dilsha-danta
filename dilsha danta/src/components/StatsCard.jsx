import React from 'react';

export const StatsCard = ({ title, value, icon: Icon, color = 'blue', details }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700',
    green: 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700',
    red: 'bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700',
    yellow: 'bg-yellow-50 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700',
    purple: 'bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-700',
  };

  const iconColorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-800',
    green: 'bg-green-100 dark:bg-green-800',
    red: 'bg-red-100 dark:bg-red-800',
    yellow: 'bg-yellow-100 dark:bg-yellow-800',
    purple: 'bg-purple-100 dark:bg-purple-800',
  };

  return (
    <div className={`card border ${colorClasses[color]} p-6 rounded-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {details && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{details}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconColorClasses[color]}`}>
          <Icon className="text-current" size={24} />
        </div>
      </div>
    </div>
  );
};
