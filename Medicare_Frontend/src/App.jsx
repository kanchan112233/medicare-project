import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // 💡 Added Navigate for auto-routing redirects
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Cart from './Pages/Cart';
import Appointments from './Pages/Appointments';
import Medicine from './Pages/Mediciens';
import LabTest from './Pages/LabTests';
import Account from './Pages/Account';
import Orders from './Pages/Orders';
import Payment from './Pages/Payment';
import AppointmentForm from "./components/AppointmentForm";
import ViewAppointments from "./Pages/ViewAppointments";
import ViewOrders from "./Pages/ViewOrders";
import ViewLabBookings from './Pages/ViewLabBookings';
import AdminDashboard from './Pages/AdminDashboard'; // 💡 Added Admin Dashboard Page Import
import AdminViewAppointments from './Pages/AdminViewAppointments';

// 💡 New Admin Sub-Page Imports From Sidebar
import AdminDoctors from './Pages/AdminDoctors';
import AdminLabTests from './Pages/AdminLabTests';
import AdminMedicines from './Pages/AdminMedicines';
import AdminOrders from './Pages/AdminOrders';
import AdminViewLabBookings from './Pages/AdminViewLabBookings'; // ⚡ NEW: Admin view all bookings import node
import AdminViewUsers from './Pages/AdminViewUsers'; // ⚡ NEW: Admin view users account roster import node
import AdminViewPatients from './Pages/AdminViewPatients'; // ⚡ NEW: Admin view patient clinical files import node

// 💡 New Home Route Interceptor Component 
// Automatically evaluates system access token roles before mounting views
function RootRouteRedirector() {
  const sessionUser = JSON.parse(localStorage.getItem("user"));
  
  if (sessionUser?.role?.toUpperCase() === 'ADMIN') {
    // If administrative profiles match, forcefully redirect to admin dashboard
    return <Navigate to="/admin-dashboard" replace />;
  }
  
  // Normal patients proceed right onto the common public homepage layout grid
  return <Home />;
}

function App() {
  return (
    <Router>
      {/* ⚡ THE FIX: Explicitly wrap the layout components in a 100% viewport flexbox stack column container */}
      <div className="d-flex flex-column min-vh-100 bg-light" style={{ width: '100%' }}>
        
        {/* Navbar at the top (Now handles conditional admin toggle states cleanly) */}
        <Navbar />

        {/* Body content */}
        {/* ⚡ THE FIX: main component now expands dynamically to push the footer perfectly to the bottom limit */}
        <main className="flex-grow-1 w-100">
          <Routes>
            {/* 💡 MODIFIED: Swapped static <Home /> with our role-aware redirect gate component */}
            <Route path="/" element={<RootRouteRedirector />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/medicine" element={<Medicine />} />
            <Route path="/labtest" element={<LabTest />} />
            <Route path="/account" element={<Account />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/appointment-form" element={<AppointmentForm />} />
            <Route path="/view-appointments" element={<ViewAppointments />} />
            <Route path="/view-orders" element={<ViewOrders />} />
            <Route path="/view-lab-bookings" element={<ViewLabBookings />} />
            
            {/* 💡 Admin Control Panel Route Node */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            
            {/* 💡 Simple Admin Sub-Routes */}
            <Route path="/admin/doctors" element={<AdminDoctors />} />
            <Route path="/admin/lab-tests" element={<AdminLabTests />} />
            <Route path="/admin/medicines" element={<AdminMedicines />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/view-lab-bookings" element={<AdminViewLabBookings />} /> {/* ⚡ NEW: Direct Admin Lab Ledger Node Hook */}
            <Route path="/admin/view-appointments" element={<AdminViewAppointments />} />
            <Route path="/admin/view-users" element={<AdminViewUsers />} /> {/* ⚡ NEW: Integrated Users Ledger Route */}
            <Route path="/admin/view-patients" element={<AdminViewPatients />} /> {/* ⚡ NEW: Integrated Patients Ledger Route */}
          </Routes>
        </main>

        {/* Footer at the bottom */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;
