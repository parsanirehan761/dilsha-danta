# Worker Attendance & Payment Management System

A complete production-level React.js application for managing worker attendance and payments. This is a full-featured SaaS-style admin dashboard built with modern technologies.

## 🚀 Features

### 1. **Authentication System**
- Admin login page with form validation
- Protected routes (no access without login)
- Session persistence with localStorage
- Demo credentials included

### 2. **Dashboard**
- Real-time statistics
  - Total workers count
  - Present today
  - Half-day workers
  - Absent workers
  - Monthly payment overview
- Visual cards and summary widgets
- Quick access to key metrics

### 3. **Worker Management**
- Add new workers with validation
- Edit worker details
- Delete workers
- Search & filter workers by name, email, or phone
- Store daily wage information

### 4. **Attendance System**
- Mark attendance per worker
  - Present (Full Day) - 100% wage
  - Half Day - 50% wage
  - Absent - 0% wage
- Daily attendance marking UI (table format)
- Individual worker message preview (simulated SMS)
- Automatic data persistence with localStorage

### 5. **Payment System**
- Automatic salary calculation based on attendance
- Monthly payment summaries
- Display payment per worker
- Export payment reports to CSV
- Payment history by month and year
- Clear calculation breakdown

### 6. **Monthly Attendance Sheet**
- Excel-like attendance calendar
- View all workers with daily attendance status
  - P (Present)
  - H (Half Day)
  - A (Absent)
  - \- (Not Marked)
- Export to CSV
- Easy to print and share

### 7. **UI/UX Features**
- Modern admin dashboard design
- Responsive sidebar navigation
- Dark mode toggle
- Mobile-responsive design
- Toast notifications (success, error, warning)
- Loading states
- Form validation with error messages
- Smooth transitions and animations

### 8. **State Management**
- Context API for global state
- Modular component structure
- Reusable components
- Clean separation of concerns

## 📁 Project Structure

```
/src
  /components
    Toaster.jsx              # Toast notification system
    ProtectedRoute.jsx       # Route protection
    Sidebar.jsx              # Navigation sidebar
    Header.jsx               # Page header component
    Modal.jsx                # Reusable modal component
    StatsCard.jsx            # Statistics card component
    LoadingSpinner.jsx       # Loading indicator
  /pages
    Login.jsx                # Login page
    Dashboard.jsx            # Dashboard page
    Workers.jsx              # Worker management page
    Attendance.jsx           # Attendance marking page
    Payments.jsx             # Payment management page
    MonthlySheet.jsx         # Monthly attendance sheet
  /context
    AuthContext.jsx          # Authentication context
    AppContext.jsx           # App state management
  /utils
    helpers.js               # Utility functions
  App.jsx                    # Main app component
  main.jsx                   # Entry point
  index.css                  # Global styles with Tailwind

/public
  index.html                 # HTML template

vite.config.js              # Vite configuration
tailwind.config.js          # Tailwind CSS configuration
postcss.config.js           # PostCSS configuration
package.json                # Dependencies and scripts
```

## 🛠️ Tech Stack

- **React.js** 18.2+ - UI framework with hooks
- **React Router DOM** 6.20+ - Client-side routing
- **Tailwind CSS** 3.3+ - Utility-first CSS framework
- **Lucide React** 0.294+ - Icon library
- **Vite** 5.0+ - Build tool and dev server
- **Context API** - State management
- **localStorage** - Data persistence

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm 7+
- Git (optional)

### Steps

1. **Navigate to project directory**
   ```bash
   cd "p:\Project\react 1"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - The app will automatically open at `http://localhost:5173`
   - If not, manually visit the URL

5. **Login with demo credentials**
   ```
   Email: admin@workerapp.com
   Password: admin123
   ```

## 🏗️ Build for Production

```bash
npm run build
```

The production build will be created in the `dist` folder.

## 🎯 Demo Credentials

```
Email: admin@workerapp.com
Password: admin123
```

## 💾 Data Storage

All data is stored locally using browser's **localStorage**:
- User sessions
- Workers list
- Attendance records
- Dark mode preference

**Note:** Data persists even after closing the browser but is cleared if browser cache is cleared.

## 🎨 UI/UX Highlights

- **Clean Design**: Modern admin panel with intuitive navigation
- **Dark Mode**: Toggle between light and dark themes
- **Responsive**: Works seamlessly on mobile, tablet, and desktop
- **Accessibility**: Proper semantic HTML and ARIA labels
- **Performance**: Optimized with React hooks and memoization
- **Notifications**: Toast messages for user feedback

## 📊 Page Features

### Dashboard
- Real-time worker statistics
- Today's attendance summary
- Monthly payment overview
- Quick access buttons to other sections

### Workers
- Full CRUD operations
- Search functionality
- Daily wage management
- Contact information storage

### Attendance
- Daily marking interface
- Status indicators (Present/Half/Absent)
- Message preview system
- Quick status overview

### Payments
- Monthly payment calculations
- Worker payment breakdown
- CSV export functionality
- Salary calculation details

### Monthly Sheet
- Full month attendance overview
- Color-coded attendance status
- Print-friendly layout
- CSV export for records

## 🔐 Security Notes

This is a **frontend-only** demonstration application. For production use:
- Implement proper backend authentication
- Use secure token management (JWT)
- Validate all data on the server
- Implement proper API security
- Use environment variables for sensitive data
- Implement proper error handling

## 🚀 Performance Optimizations

- Memoization with `useMemo()` for expensive calculations
- Lazy component rendering
- CSS-in-JS with Tailwind for reduced bundle size
- Optimized re-renders with proper dependency arrays
- Efficient localStorage usage

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is already in use:
```bash
npm run dev -- --port 3000
```

### Dependencies Not Installing
```bash
npm install --legacy-peer-deps
npm cache clean --force
```

### Data Not Persisting
- Check if localStorage is enabled in browser
- Clear browser cache and try again
- Check browser's storage quota

## 📝 License

This project is provided as-is for educational and commercial use.

## 🤝 Contributing

Feel free to fork, modify, and enhance this project for your needs.

## 📧 Support

For issues or questions, refer to the code comments and utility functions for guidance.

---

**Version:** 1.0.0  
**Last Updated:** 2026

**Built with ❤️ using React, Tailwind CSS, and modern web technologies.**
