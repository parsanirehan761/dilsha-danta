# 📚 ARCHITECTURE & DOCUMENTATION

## System Overview

This is a comprehensive single-page application (SPA) for managing worker attendance and payments. The application is built with a modern React architecture following industry best practices.

## 🏗️ Architecture Pattern

### Model-View-Controller (MVC) + Context API

```
┌─────────────────────────────────────┐
│         React Components            │
│     (Views/Presentational)          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Context API State              │
│    (AuthContext + AppContext)       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      localStorage API               │
│     (Data Persistence)              │
└─────────────────────────────────────┘
```

## 🔄 Data Flow

1. **User Action** → Component Event Handler
2. **Event Trigger** → Context State Update
3. **State Update** → All Subscribers Re-render
4. **Async Save** → localStorage Persistence

## 📦 Component Architecture

### Context Providers (Global State)

#### AuthContext.jsx
Manages authentication state and user sessions.

**State:**
- `user` - Current logged-in user object
- `loading` - Loading state during initialization

**Functions:**
- `login(email, password)` - Authenticate user
- `logout()` - Clear user session
- `isAuthenticated()` - Check if user is logged in

**Data Persisted:** User data saved to `authUser` localStorage key

---

#### AppContext.jsx
Manages all application data (workers, attendance, payments).

**State:**
- `workers[]` - Array of all workers
- `attendance{}` - Object storing attendance records by date
- `darkMode` - Theme preference

**Structure of Attendance Object:**
```javascript
{
  "1-2026-04-01": "present",
  "1-2026-04-02": "half",
  "1-2026-04-03": "absent",
  // Key = "workerId-YYYY-MM-DD"
  // Value = "present" | "half" | "absent"
}
```

**Worker Object Structure:**
```javascript
{
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  dailyWage: 500
}
```

**Key Functions:**

*Worker Management:*
- `addWorker(workerData)` - Add new worker
- `updateWorker(id, updatedData)` - Update worker details
- `deleteWorker(id)` - Remove worker

*Attendance Management:*
- `markAttendance(workerId, date, status)` - Mark attendance
- `getAttendance(workerId, date)` - Retrieve attendance
- `getMonthlyAttendance(workerId, year, month)` - Get month data

*Payment Calculations:*
- `calculateMonthlyPayment(workerId, year, month)` - Calculate total salary
- `getTotalMonthlyPayment(year, month)` - Sum of all payments
- `getWorkerPaymentDetails(workerId, year, month)` - Detailed breakdown

*Statistics:*
- `getTodayStats()` - Today's attendance stats

---

### Page Components

#### Login.jsx
**Purpose:** Authentication interface for admin users

**Features:**
- Email & password form
- Client-side validation
- Demo credentials display
- Loading state handling
- Error messages

**Validations:**
- Email format check
- Password minimum length (3 chars)
- Required field validation

**Security Note:** 
In production, implement proper backend validation and secure authentication.

---

#### Dashboard.jsx
**Purpose:** Overview and key metrics

**Displays:**
- Total workers
- Today's attendance stats (present, half-day, absent)
- Monthly payment summary
- Quick action cards

**Data Calculations:**
- Real-time stats generation
- Monthly rollup totals
- Percentage calculations

---

#### Workers.jsx
**Purpose:** Worker management (CRUD operations)

**Features:**
- Add new workers
- Edit worker details
- Delete workers
- Search & filter (by name, email, phone)
- Validation feedback

**Search Algorithm:**
```javascript
workers.filter(worker =>
  worker.name.toLowerCase().includes(searchTerm) ||
  worker.email.toLowerCase().includes(searchTerm) ||
  worker.phone.includes(searchTerm)
)
```

**Form Validation:**
- Name: Required (non-empty string)
- Email: Required, must be valid email format
- Phone: Required, minimum 10 characters
- Daily Wage: Required, must be positive number

---

#### Attendance.jsx
**Purpose:** Daily attendance marking interface

**Features:**
- Date picker for any date
- Real-time status buttons
- Quick statistics display
- Message preview system
- Color-coded status indicators

**Attendance Options:**
- Present (Full Day) - 100% wage
- Half Day - 50% wage
- Absent - 0% wage
- Not Marked - No entry

**Message System:**
Generates simulated SMS preview without backend:
```
"Hello {Name}, your attendance for {Date} is marked as {Status}."
```

---

#### Payments.jsx
**Purpose:** Payment calculations and reports

**Features:**
- Monthly payment summaries
- Worker-wise breakdown
- Calculation details displayed
- CSV export functionality
- Multi-year/month support

**Calculation Logic:**
```javascript
totalPayment = (presentDays × dailyWage) + (halfDays × dailyWage × 0.5)
```

**Export Format:**
CSV with columns:
- Worker Name
- Email
- Phone
- Daily Wage
- Present Days
- Half Days
- Absent Days
- Total Payment

---

#### MonthlySheet.jsx
**Purpose:** Monthly attendance overview (Excel-like format)

**Features:**
- Calendar grid view
- All workers + all days of month
- Color-coded status cells
- Print-friendly layout
- CSV export

**Status Indicators:**
- **P** (Green) - Present
- **H** (Yellow) - Half Day
- **A** (Red) - Absent
- **-** (Gray) - Not Marked

---

### Reusable Components

#### Header.jsx
Displays page title and user information

**Props:**
- `title` (string) - Page title

---

#### Sidebar.jsx
Main navigation and theme toggle

**Features:**
- Responsive design (collapsible on mobile)
- Route highlighting
- Dark mode toggle
- Logout button
- Navigation links

---

#### Modal.jsx
Reusable modal/dialog component

**Props:**
- `isOpen` (boolean) - Show/hide modal
- `onClose` (function) - Close handler
- `title` (string) - Modal title
- `children` (ReactNode) - Modal content
- `size` (string) - 'sm', 'md', 'lg', 'xl'

---

#### StatsCard.jsx
Statistics display card component

**Props:**
- `title` (string) - Card title
- `value` (string/number) - Main value
- `icon` (Component) - Icon component
- `color` (string) - 'blue', 'green', 'red', 'yellow', 'purple'
- `details` (string, optional) - Additional info

---

#### Toaster.jsx
Toast notification system (global)

**Features:**
- Auto-dismiss notifications
- Multiple types (success, error, warning, info)
- Stacking display
- Auto-hide after 3 seconds

**Usage:**
```javascript
import { showToast } from '../utils/helpers';

showToast('Success message', 'success');
showToast('Error message', 'error');
showToast('Warning message', 'warning');
showToast('Info message', 'info');
```

---

#### ProtectedRoute.jsx
Route protection for authenticated routes

**Features:**
- Redirects to login if not authenticated
- Shows loading spinner while checking auth
- Prevents unauthorized access

---

#### LoadingSpinner.jsx
Loading indicator component

**Props:**
- `size` (string) - 'sm', 'md', 'lg'
- `fullScreen` (boolean) - Full screen overlay

---

## 🛠️ Utility Functions

### helpers.js

#### Toast Management
```javascript
showToast(message, type, duration)    // Show notification
removeToast(id)                       // Remove specific toast
subscribeToToasts(callback)           // Subscribe to toast updates
```

#### Date Utilities
```javascript
formatDate(date)                      // Convert to YYYY-MM-DD
formatDateDisplay(dateString)         // Format for display
getCurrentDate()                      // Get today's date
getDaysInMonth(year, month)          // Count days in month
getMonthName(month)                  // Get month name string
```

#### Validation
```javascript
validateEmail(email)                  // Check email format
validatePhone(phone)                  // Check phone format
validateForm(formData, fields)        // Validate entire form
```

#### Export Utilities
```javascript
exportToCSV(data, filename)           // Export to CSV file
formatCurrency(amount, currency)      // Format as currency
formatNumber(num)                     // Format number with separators
```

---

## 💾 Data Persistence Strategy

### localStorage Keys

| Key | Value | Purpose |
|-----|-------|---------|
| `authUser` | JSON User Object | Session persistence |
| `workers` | JSON Array | Workers list |
| `attendance` | JSON Object | Attendance records |
| `darkMode` | Boolean | Theme preference |

### Persistence Flow

```
Component Change
    ↓
Context State Updated
    ↓
useEffect Triggered
    ↓
localStorage Updated
    ↓
Data Persisted
```

### Data Structure on Disk

```javascript
// localStorage.authUser
{
  id: 1,
  email: "admin@workerapp.com",
  name: "Admin User",
  role: "admin",
  loginTime: "2026-04-05T10:30:00Z"
}

// localStorage.workers
[
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    dailyWage: 500
  },
  ...
]

// localStorage.attendance
{
  "1-2026-04-01": "present",
  "2-2026-04-01": "half",
  "3-2026-04-01": "absent",
  ...
}

// localStorage.darkMode
true
```

---

## 🎨 Styling Architecture

### Tailwind CSS Approach

**Utility-First CSS** - No custom CSS classes (mostly)

**Custom Tailwind Components** (in index.css):
```css
@layer components {
  .btn-primary { ... }
  .card { ... }
  .input-field { ... }
  .table-container { ... }
}
```

### Color Palette

- **Primary:** Blue (#3b82f6)
- **Secondary:** Green (#10b981)
- **Danger:** Red (#ef4444)
- **Warning:** Yellow (#f59e0b)
- **Dark:** Gray (#1f2937)
- **Light:** Gray (#f9fafb)

### Dark Mode Implementation

```javascript
// Toggle dark mode
const toggle = () => setDarkMode(!darkMode);

// Apply dark class to html
if (darkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}
```

---

## 🔐 Authentication Flow

```
┌────────────────────────────────────────────┐
│         Login Page                         │
│  (Show demo credentials)                   │
└────────────────┬─────────────────────────┘
                 │
         Input credentials
                 │
        ▼────────▼─────────▐
   Email: admin@workerapp.com
   Pass:  admin123
   
         ▼────────▼─────────▐
      Validate locally
      (client-side check)
                 │
      ┌──────────┴──────────┐
      │                     │
   Valid              Invalid
      │                     │
      │                     ├─→ Show error message
   Create              Retry form
   User Object              
      │
      ├─→ Save to localStorage
      ├─→ Update Context
      ├─→ Redirect to /dashboard
      └─→ Render protected routes
```

---

## 📊 Payment Calculation Examples

### Example 1: 20 working days in month

```
Worker: John Doe
Daily Wage: ₹500
Present Days: 18
Half Days: 2
Absent Days: 0

Calculation:
= (18 × 500) + (2 × 500 × 0.5)
= 9000 + 500
= ₹9,500
```

### Example 2: With absences

```
Worker: Jane Smith
Daily Wage: ₹550
Present Days: 16
Half Days: 2
Absent Days: 2

Calculation:
= (16 × 550) + (2 × 550 × 0.5)
= 8800 + 550
= ₹9,350
```

---

## 🚀 Performance Optimizations

### Memoization
```javascript
const paymentData = useMemo(
  () => workers.map(worker => 
    getWorkerPaymentDetails(worker.id, year, month)
  ),
  [workers, month, year]
);
```

### Lazy Dependencies
- Components only re-render when dependencies change
- Expensive calculations cached
- Filtered lists memoized

### Efficient Searches
- Client-side filtering in real-time
- No API calls required
- Instant feedback

---

## 🧪 Testing Considerations

For unit tests, test:
1. **Context functions:** Payment calculations, attendance logic
2. **Utility functions:** Date formatting, validation
3. **Component rendering:** With mock context
4. **localStorage:** Data persistence

Example test:
```javascript
test('calculateMonthlyPayment calculates correctly', () => {
  const context = {
    workers: [{ id: 1, dailyWage: 500 }],
    attendance: { '1-2026-04-01': 'present' }
  };
  
  expect(calculateMonthlyPayment(1, 2026, 4)).toBe(500);
});
```

---

## 🔄 Future Enhancements

1. **Backend Integration:** Replace localStorage with API
2. **Authentication:** Implement JWT tokens
3. **Advanced Features:**
   - Employee bonuses/deductions
   - Leave management
   - Expense tracking
   - Payslip generation
   - Attendance trends/analytics
4. **Mobile App:** React Native version
5. **Notifications:** Email/SMS notifications
6. **Multi-language:** i18n support
7. **Advanced Reporting:** Charts, graphs, analytics
8. **Audit Logs:** Track all changes
9. **User Roles:** Different access levels
10. **Mobile Attendance:** QR code scanning

---

## 📖 Learning Resources

- **React Hooks:** https://react.dev/reference/react
- **Context API:** https://react.dev/reference/react/useContext
- **React Router:** https://reactrouter.com/
- **Tailwind CSS:** https://tailwindcss.com/
- **Lucide Icons:** https://lucide.dev/

---

**Version:** 1.0.0  
**Last Updated:** 2026  
**Maintainer:** Your Team
