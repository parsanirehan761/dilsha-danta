// Toast notification system
const toastStack = [];
const toastCallbacks = new Set();

export const showToast = (message, type = 'success', duration = 3000) => {
  const id = Date.now();
  const toast = {
    id,
    message,
    type, // success, error, warning, info
    duration,
  };

  toastStack.push(toast);
  notifySubscribers();

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
};

export const removeToast = (id) => {
  const index = toastStack.findIndex(t => t.id === id);
  if (index > -1) {
    toastStack.splice(index, 1);
    notifySubscribers();
  }
};

export const subscribeToToasts = (callback) => {
  toastCallbacks.add(callback);
  return () => toastCallbacks.delete(callback);
};

const notifySubscribers = () => {
  toastCallbacks.forEach(callback => callback([...toastStack]));
};

// Date utilities
export const formatDate = (date) => {
  if (typeof date === 'string') {
    return date;
  }
  return new Date(date).toISOString().split('T')[0];
};

export const formatDateDisplay = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

export const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

export const getMonthName = (month) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1];
};

// Validation utilities
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[\d\s\-\+\(\)]{10,}$/;
  return re.test(phone);
};

export const validateForm = (formData, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].trim() === '') {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  });

  if (formData.email && !validateEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = 'Invalid phone number';
  }

  return errors;
};

// Export utilities
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

// Currency formatter
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Number formatter
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};
