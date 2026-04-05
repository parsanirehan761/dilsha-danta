import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { Modal } from '../components/Modal';
import { showToast, formatDateDisplay } from '../utils/helpers';
import { Plus, Edit2, Trash2, Search, Calendar } from 'lucide-react';

export const Notes = () => {
  const { workers, addNote, updateNote, deleteNote, getNotes } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorker, setSelectedWorker] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    workerId: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    priority: 'medium',
  });
  const [errors, setErrors] = useState({});

  const allNotes = useMemo(() => getNotes(), [getNotes]);

  const filteredNotes = useMemo(() => {
    return allNotes.filter(note => {
      const worker = workers.find(w => w.id === parseInt(note.workerId));
      const matchesSearch = 
        (worker?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesWorker = !selectedWorker || note.workerId === selectedWorker;
      
      return matchesSearch && matchesWorker;
    });
  }, [allNotes, workers, searchTerm, selectedWorker]);

  const handleOpenModal = (note = null) => {
    if (note) {
      setEditingNote(note);
      setFormData({
        workerId: note.workerId,
        title: note.title,
        description: note.description,
        date: note.date,
        priority: note.priority,
      });
    } else {
      setEditingNote(null);
      setFormData({
        workerId: '',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        priority: 'medium',
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
    setFormData({
      workerId: '',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      priority: 'medium',
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

    const newErrors = {};
    if (!formData.workerId) newErrors.workerId = 'Worker is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const noteData = {
        workerId: formData.workerId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,
        priority: formData.priority,
      };

      if (editingNote) {
        updateNote(editingNote.id, noteData);
        showToast('Note updated successfully!', 'success');
      } else {
        addNote(noteData);
        showToast('Note added successfully!', 'success');
      }

      handleCloseModal();
    } catch (error) {
      showToast('An error occurred. Please try again.', 'error');
    }
  };

  const handleDelete = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(noteId);
      showToast('Note deleted successfully!', 'success');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getWorkerName = (workerId) => {
    return workers.find(w => w.id === parseInt(workerId))?.name || 'Unknown';
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <Header title="Worker Notes & Tasks" />

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search notes by worker, title, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>

            {/* Worker Filter */}
            <select
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
              className="input-field"
            >
              <option value="">All Workers</option>
              {workers.map(worker => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </select>

            {/* Add Button */}
            <button
              onClick={() => handleOpenModal()}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={20} />
              Add Note
            </button>
          </div>

          {/* Notes Grid */}
          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  className="card hover:shadow-lg transition-shadow flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {note.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {getWorkerName(note.workerId)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(note)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(note.priority)}`}>
                      {note.priority.charAt(0).toUpperCase() + note.priority.slice(1)}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDateDisplay(note.date)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 dark:text-gray-300 text-sm flex-1 mb-4 line-clamp-4">
                    {note.description}
                  </p>

                  {/* Footer */}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Created: {formatDateDisplay(note.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {filteredNotes.length === 0 && allNotes.length > 0
                  ? 'No notes match your search criteria'
                  : 'No notes created yet. Add one to get started!'}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingNote ? 'Edit Note' : 'Add New Note'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Worker Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Worker <span className="text-red-500">*</span>
            </label>
            <select
              name="workerId"
              value={formData.workerId}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select a worker</option>
              {workers.map(worker => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </select>
            {errors.workerId && <p className="text-red-500 text-sm mt-1">{errors.workerId}</p>}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Training Session, Equipment Check"
              className="input-field"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task details or notes..."
              rows={4}
              className="input-field"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input-field"
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input-field"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {editingNote ? 'Update Note' : 'Add Note'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
