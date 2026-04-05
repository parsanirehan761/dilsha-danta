import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { Modal } from '../components/Modal';
import { showToast, getCurrentDate } from '../utils/helpers';
import { Calendar, MessageSquare } from 'lucide-react';

export const Attendance = () => {
  const { workers, markAttendance, getAttendance } = useApp();
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [messageModal, setMessageModal] = useState({ isOpen: false, message: '' });

  const attendanceData = useMemo(() => {
    return workers.map(worker => ({
      ...worker,
      status: getAttendance(worker.id, selectedDate),
    }));
  }, [workers, selectedDate, getAttendance]);

  const handleMarkAttendance = (workerId, status) => {
    markAttendance(workerId, selectedDate, status);
    const worker = workers.find(w => w.id === workerId);
    const statusText = status === 'present' ? 'Present' : status === 'half' ? 'Half Day' : 'Absent';
    showToast(`${worker.name} marked as ${statusText}`, 'success');
  };

  const handleSendMessage = (worker) => {
    const status = getAttendance(worker.id, selectedDate);
    const statusDisplay = status === 'present' ? 'Full Day' : status === 'half' ? 'Half Day' : status === 'absent' ? 'Absent' : 'Not Marked';
    
    const message = `Hello ${worker.name}, your attendance for ${new Date(selectedDate).toLocaleDateString()} is marked as ${statusDisplay}.`;
    setMessageModal({ isOpen: true, message });
    showToast('Message preview generated!', 'success');
  };

  const stats = {
    total: workers.length,
    present: attendanceData.filter(w => w.status === 'present').length,
    halfDay: attendanceData.filter(w => w.status === 'half').length,
    absent: attendanceData.filter(w => w.status === 'absent').length,
    notMarked: attendanceData.filter(w => !w.status).length,
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <Header title="Attendance Management" />

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Date Selector and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            {/* Date Picker */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Stats Display */}
            <div className="md:col-span-3 grid grid-cols-2 gap-2">
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-3">
                <p className="text-xs text-blue-600 dark:text-blue-300 font-medium">Present</p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{stats.present}</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-3">
                <p className="text-xs text-yellow-600 dark:text-yellow-300 font-medium">Half Day</p>
                <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">{stats.halfDay}</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900 rounded-lg p-3">
                <p className="text-xs text-red-600 dark:text-red-300 font-medium">Absent</p>
                <p className="text-xl font-bold text-red-900 dark:text-red-100">{stats.absent}</p>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Not Marked</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.notMarked}</p>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Worker Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Email
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map(worker => (
                  <tr key={worker.id} className="table-row">
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                      {worker.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                      {worker.email}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="space-y-2">
                        {worker.status && (
                          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium
                            ${worker.status === 'present' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                            ${worker.status === 'half' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                            ${worker.status === 'absent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                          `}>
                            {worker.status === 'present' ? 'Present' : worker.status === 'half' ? 'Half Day' : 'Absent'}
                          </div>
                        )}
                        {!worker.status && (
                          <span className="text-gray-500 dark:text-gray-400 text-sm">Not marked</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleMarkAttendance(worker.id, 'present')}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                            ${worker.status === 'present'
                              ? 'bg-green-500 text-white'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                            }
                          `}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(worker.id, 'half')}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                            ${worker.status === 'half'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800'
                            }
                          `}
                        >
                          Half
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(worker.id, 'absent')}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                            ${worker.status === 'absent'
                              ? 'bg-red-500 text-white'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
                            }
                          `}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleSendMessage(worker)}
                          className="px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                          title="Send attendance message"
                        >
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Message Modal */}
      <Modal
        isOpen={messageModal.isOpen}
        onClose={() => setMessageModal({ isOpen: false, message: '' })}
        title="Message Preview"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <p className="text-blue-900 dark:text-blue-100 text-sm leading-relaxed">
              {messageModal.message}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(messageModal.message);
                showToast('Message copied to clipboard!', 'success');
              }}
              className="flex-1 btn-primary"
            >
              Copy Message
            </button>
            <button
              onClick={() => setMessageModal({ isOpen: false, message: '' })}
              className="flex-1 btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
