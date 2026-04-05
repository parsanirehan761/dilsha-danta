import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { Modal } from '../components/Modal';
import { showToast, validateForm } from '../utils/helpers';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export const Workers = () => {
  const { workers, addWorker, updateWorker, deleteWorker } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dailyWage: '',
  });
  const [errors, setErrors] = useState({});

  // Filter workers based on search
  const filteredWorkers = useMemo(() => {
    return workers.filter(worker =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.phone.includes(searchTerm)
    );
  }, [workers, searchTerm]);

  const handleOpenModal = (worker = null) => {
    if (worker) {
      setEditingWorker(worker);
      setFormData({
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
        dailyWage: worker.dailyWage,
      });
    } else {
      setEditingWorker(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        dailyWage: '',
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWorker(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      dailyWage: '',
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = validateForm(formData, ['name', 'email', 'phone']);
    if (!formData.dailyWage) {
      newErrors.dailyWage = 'Daily wage is required';
    } else if (isNaN(formData.dailyWage) || formData.dailyWage <= 0) {
      newErrors.dailyWage = 'Daily wage must be a positive number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const workerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dailyWage: parseFloat(formData.dailyWage),
      };

      if (editingWorker) {
        updateWorker(editingWorker.id, workerData);
        showToast('Worker updated successfully!', 'success');
      } else {
        addWorker(workerData);
        showToast('Worker added successfully!', 'success');
      }

      handleCloseModal();
    } catch (error) {
      showToast('An error occurred. Please try again.', 'error');
    }
  };

  const handleDelete = (workerId) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      deleteWorker(workerId);
      showToast('Worker deleted successfully!', 'success');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <Header title="Worker Management" />

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={() => handleOpenModal()}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Add Worker
            </button>
          </div>

          {/* Workers Table */}
          <div className="card overflow-x-auto">
            {filteredWorkers.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Daily Wage
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkers.map(worker => (
                    <tr
                      key={worker.id}
                      className="table-row"
                    >
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                        {worker.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                        {worker.email}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                        {worker.phone}
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                        ₹{worker.dailyWage}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal(worker)}
                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"
                            title="Edit worker"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(worker.id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg text-red-600 dark:text-red-400 transition-colors"
                            title="Delete worker"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  {workers.length === 0 ? 'No workers added yet.' : 'No workers found matching your search.'}
                </p>
                {workers.length === 0 && (
                  <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary mt-4"
                  >
                    Add First Worker
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingWorker ? 'Edit Worker' : 'Add New Worker'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1234567890"
              className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Daily Wage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Daily Wage (₹) *
            </label>
            <input
              type="number"
              name="dailyWage"
              value={formData.dailyWage}
              onChange={handleChange}
              placeholder="500"
              min="0"
              step="0.01"
              className={`input-field ${errors.dailyWage ? 'border-red-500' : ''}`}
            />
            {errors.dailyWage && <p className="text-sm text-red-500 mt-1">{errors.dailyWage}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              {editingWorker ? 'Update Worker' : 'Add Worker'}
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
