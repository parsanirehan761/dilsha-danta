import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

// Default dummy data
const DUMMY_WORKERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', dailyWage: 500 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', dailyWage: 550 },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1234567892', dailyWage: 600 },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '+1234567893', dailyWage: 550 },
  { id: 5, name: 'David Brown', email: 'david@example.com', phone: '+1234567894', dailyWage: 500 },
  { id: 6, name: 'Dilsha Danta', email: 'dilsha@example.com', phone: '+9876543210', dailyWage: 500 },
];

export const AppProvider = ({ children }) => {
  const [workers, setWorkers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [notes, setNotes] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const storedWorkers = localStorage.getItem('workers');
    const storedAttendance = localStorage.getItem('attendance');
    const storedNotes = localStorage.getItem('notes');
    const storedDarkMode = localStorage.getItem('darkMode');

    if (storedWorkers) {
      try {
        setWorkers(JSON.parse(storedWorkers));
      } catch (error) {
        setWorkers(DUMMY_WORKERS);
        localStorage.setItem('workers', JSON.stringify(DUMMY_WORKERS));
      }
    } else {
      setWorkers(DUMMY_WORKERS);
      localStorage.setItem('workers', JSON.stringify(DUMMY_WORKERS));
    }

    if (storedAttendance) {
      try {
        setAttendance(JSON.parse(storedAttendance));
      } catch (error) {
        setAttendance({});
      }
    }

    if (storedNotes) {
      try {
        setNotes(JSON.parse(storedNotes));
      } catch (error) {
        setNotes([]);
      }
    }

    if (storedDarkMode) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  // Persist workers to localStorage
  useEffect(() => {
    localStorage.setItem('workers', JSON.stringify(workers));
  }, [workers]);

  // Persist attendance to localStorage
  useEffect(() => {
    localStorage.setItem('attendance', JSON.stringify(attendance));
  }, [attendance]);

  // Persist notes to localStorage
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Persist dark mode to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Worker Management Functions
  const addWorker = (workerData) => {
    const newWorker = {
      id: Date.now(),
      ...workerData,
    };
    setWorkers([...workers, newWorker]);
    return newWorker;
  };

  const updateWorker = (id, updatedData) => {
    setWorkers(workers.map(w => w.id === id ? { ...w, ...updatedData } : w));
  };

  const deleteWorker = (id) => {
    setWorkers(workers.filter(w => w.id !== id));
  };

  // Attendance Functions
  const markAttendance = (workerId, date, status) => {
    const dateKey = new Date(date).toISOString().split('T')[0];
    const key = `${workerId}-${dateKey}`;
    
    setAttendance({
      ...attendance,
      [key]: status,
    });
  };

  const getAttendance = (workerId, date) => {
    const dateKey = new Date(date).toISOString().split('T')[0];
    const key = `${workerId}-${dateKey}`;
    return attendance[key] || null;
  };

  const getMonthlyAttendance = (workerId, year, month) => {
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    const records = {};
    
    Object.entries(attendance).forEach(([key, value]) => {
      if (key.startsWith(`${workerId}-${monthKey}`)) {
        const date = key.split('-').slice(1).join('-');
        records[date] = value;
      }
    });
    
    return records;
  };

  // Payment/Statistics Functions
  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    let presentCount = 0;
    let halfDayCount = 0;
    let absentCount = 0;

    workers.forEach(worker => {
      const status = getAttendance(worker.id, today);
      if (status === 'present') presentCount++;
      else if (status === 'half') halfDayCount++;
      else if (status === 'absent') absentCount++;
    });

    return {
      totalWorkers: workers.length,
      presentToday: presentCount,
      halfDayToday: halfDayCount,
      absentToday: absentCount,
      notMarked: workers.length - presentCount - halfDayCount - absentCount,
    };
  };

  const calculateMonthlyPayment = (workerId, year, month) => {
    const monthlyAttendance = getMonthlyAttendance(workerId, year, month);
    const worker = workers.find(w => w.id === workerId);
    
    if (!worker) return 0;

    let totalPayment = 0;
    Object.values(monthlyAttendance).forEach(status => {
      if (status === 'present') {
        totalPayment += worker.dailyWage;
      } else if (status === 'half') {
        totalPayment += worker.dailyWage * 0.5;
      }
    });

    return totalPayment;
  };

  const getTotalMonthlyPayment = (year, month) => {
    let total = 0;
    workers.forEach(worker => {
      total += calculateMonthlyPayment(worker.id, year, month);
    });
    return total;
  };

  const getWorkerPaymentDetails = (workerId, year, month) => {
    const worker = workers.find(w => w.id === workerId);
    const monthlyAttendance = getMonthlyAttendance(workerId, year, month);
    
    if (!worker) return null;

    let presentDays = 0;
    let halfDays = 0;
    let absentDays = 0;

    Object.values(monthlyAttendance).forEach(status => {
      if (status === 'present') presentDays++;
      else if (status === 'half') halfDays++;
      else if (status === 'absent') absentDays++;
    });

    const totalPayment = calculateMonthlyPayment(workerId, year, month);

    return {
      worker,
      presentDays,
      halfDays,
      absentDays,
      totalPayment,
      dailyWage: worker.dailyWage,
    };
  };

  // Notes Functions
  const addNote = (noteData) => {
    const newNote = {
      id: Date.now(),
      ...noteData,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setNotes([...notes, newNote]);
    return newNote;
  };

  const updateNote = (id, updatedData) => {
    setNotes(notes.map(note => note.id === id ? { ...note, ...updatedData } : note));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const getNotes = () => {
    return notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getWorkerNotes = (workerId) => {
    return notes.filter(note => note.workerId === workerId);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AppContext.Provider
      value={{
        workers,
        attendance,
        notes,
        darkMode,
        addWorker,
        updateWorker,
        deleteWorker,
        markAttendance,
        getAttendance,
        getMonthlyAttendance,
        getTodayStats,
        calculateMonthlyPayment,
        getTotalMonthlyPayment,
        getWorkerPaymentDetails,
        addNote,
        updateNote,
        deleteNote,
        getNotes,
        getWorkerNotes,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
