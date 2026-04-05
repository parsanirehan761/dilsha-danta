import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';

export const Header = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      
      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <User size={20} />
          </div>
        </div>
      )}
    </header>
  );
};
