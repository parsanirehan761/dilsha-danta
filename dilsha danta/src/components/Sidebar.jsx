import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Clipboard,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
} from 'lucide-react';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useApp();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/workers', label: 'Workers', icon: Users },
    { path: '/attendance', label: 'Attendance', icon: Calendar },
    { path: '/payments', label: 'Payments', icon: DollarSign },
    { path: '/notes', label: 'Notes', icon: Clipboard },
    { path: '/monthly-sheet', label: 'Monthly Sheet', icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-blue-600 text-white rounded-lg"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 bg-gray-900 dark:bg-gray-950 text-white
          transform transition-transform duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">WorkTrack</h1>
            <p className="text-xs text-gray-400">Employee Management</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4 space-y-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${darkMode
                ? 'bg-gray-800 text-yellow-400'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }
            `}
          >
            {darkMode ? (
              <>
                <Sun size={20} />
                <span className="font-medium">Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={20} />
                <span className="font-medium">Dark Mode</span>
              </>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900 hover:text-red-200 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden md:block w-64" />
    </>
  );
};
