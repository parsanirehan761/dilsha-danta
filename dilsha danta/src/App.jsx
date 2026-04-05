import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Toaster } from './components/Toaster';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Workers } from './pages/Workers';
import { Attendance } from './pages/Attendance';
import { Payments } from './pages/Payments';
import { Notes } from './pages/Notes';
import { MonthlySheet } from './pages/MonthlySheet';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/workers"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Workers />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Attendance />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Payments />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Notes />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/monthly-sheet"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <MonthlySheet />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {/* Global Toaster */}
          <Toaster />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
