# 🚀 QUICK START GUIDE

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```
Wait for all packages to install (this may take a few minutes).

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open Browser
- The app will auto-open at `http://localhost:5173`
- Or manually visit: http://localhost:5173

### Step 4: Login
Use these credentials:
- **Email:** admin@workerapp.com
- **Password:** admin123

## ✨ What You Get

### 📊 Dashboard
Real-time statistics and overview

### 👷 Worker Management
- Add/Edit/Delete workers
- Search functionality
- Daily wage management

### 📅 Attendance Tracking
- Mark daily attendance
- Message preview system
- Status indicators

### 💰 Payment System
- Automatic salary calculation
- Monthly reports
- CSV export

### 📊 Monthly Sheet
- Attendance calendar view
- Color-coded status
- Export to CSV

## 🎨 Dark Mode
Click the moon icon in sidebar to toggle dark/light mode

## 📁 File Structure Overview

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── context/            # State management
├── utils/              # Helper functions
└── App.jsx             # Main app file
```

## 🔒 Demo Features

✅ Full authentication system  
✅ Worker CRUD operations  
✅ Daily attendance marking  
✅ Automatic payment calculation  
✅ Monthly reports  
✅ CSV export  
✅ Dark mode  
✅ Toast notifications  
✅ Form validation  
✅ Responsive design  

## 💾 Data Storage

All data stored in **localStorage** (browser storage):
- Persists after page refresh
- Persists after browser close
- Clears if you clear browser cache

## 🛠️ Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Key Features to Try

1. **Add Workers**: Click "Add Worker" on Workers page
2. **Mark Attendance**: Go to Attendance and select a date
3. **View Payments**: Check monthly payment calculations
4. **Export Data**: Download CSV reports
5. **Dark Mode**: Toggle theme in sidebar

## 📝 Default Demo Data

The app comes pre-loaded with 5 sample workers:
- John Doe
- Jane Smith
- Mike Johnson
- Sarah Williams
- David Brown

You can add more or delete these workers.

## ⚠️ Important Notes

- This is a **frontend-only** application
- No backend server required
- Data stored locally in browser
- Clear browser cache to reset data
- For production, implement proper backend authentication

## 🆘 Troubleshooting

**Port 5173 already in use?**
```bash
npm run dev -- --port 3000
```

**Blank page?**
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- Clear browser cache

**Data not saving?**
- Enable localStorage in browser settings
- Check browser storage quota

## 🎓 Learning Points

This project demonstrates:
- React hooks and functional components
- Context API for state management
- Tailwind CSS for styling
- React Router for navigation
- LocalStorage API usage
- Form handling and validation
- Component composition
- Responsive design patterns

## 📚 Next Steps

1. **Customize**: Change colors, fonts, and layout
2. **Add Features**: Implement additional requirements
3. **Connect Backend**: Replace localStorage with API calls
4. **Deploy**: Build and upload to hosting service

## 🚀 Ready to Go!

Your Worker Attendance & Payment Management System is ready to use!

Happy coding! 🎉
