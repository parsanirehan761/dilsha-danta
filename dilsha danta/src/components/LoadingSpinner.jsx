import React from 'react';

export const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-blue-500 border-t-transparent ${sizeClasses[size]}`} />
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          {spinner}
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{spinner}</div>;
};
