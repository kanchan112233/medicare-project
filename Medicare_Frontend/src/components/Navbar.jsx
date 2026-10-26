import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Read the active profile session parameters out of local storage
  const activeUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = activeUser?.role?.toUpperCase() === 'ADMIN';

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Helper function to manage active styling state over a light background
  const getNavLinkClass = (path) => {
    const baseClass = "nav-link fw-bold px-3 text-uppercase fs-5 d-flex align-items-center gap-1 transition-all ";
    return location.pathname === path
      ? baseClass + "text-dark-brown active border-bottom border-2 border-dark-brown"
      : baseClass + "text-secondary hover-text-dark-brown";
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom py-3 px-4 shadow-sm fixed-top navbar-light" style={{ zIndex: 1050 }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Left Side: Brand Logo Link */}
        <Link to={isAdmin ? "/admin-dashboard" : "/"} className="navbar-brand d-flex align-items-center gap-2 text-decoration-none fw-bold fs-3 text-dark-brown">
          <i className="bi bi-heart-pulse-fill text-danger"></i>
          <span>Medicare</span>
          {isAdmin && (
            <span className="badge bg-danger ms-1" style={{ fontSize: "10px", verticalAlign: "middle" }}>
              ADMIN PANEL
            </span>
          )}
        </Link>

        {/* Center Section: Context-Aware Navigation Links */}
        <div className="collapse navbar-collapse justify-content-center" id="medicareNavbarLinks">
          <div className="d-flex gap-2 align-items-center navbar-nav">
            {isAdmin ? (
              <>
                <Link to="/admin-dashboard" className={getNavLinkClass("/admin-dashboard")}>
                  <i className="bi bi-speedometer2"></i> Dashboard
                </Link>
               <Link to="/admin/view-appointments" className={getNavLinkClass("/admin/view-appointments")}>
  <i className="bi bi-calendar-check"></i> Appointments
</Link>

                <Link to="/admin/doctors" className={getNavLinkClass("/admin/doctors")}>
                  <i className="bi bi-person-badge"></i> Doctors
                </Link>
                <Link to="/admin/medicines" className={getNavLinkClass("/admin/medicines")}>
                  <i className="bi bi-capsule"></i> Medicines
                </Link>
                <Link to="/admin/view-lab-bookings" className={getNavLinkClass("/admin/view-lab-bookings")}>
                  <i className="bi bi-eyedropper"></i> Lab Tests
                </Link>
                <Link to="/admin/orders" className={getNavLinkClass("/admin/orders")}>
                  <i className="bi bi-cart-check"></i> Orders
                </Link>
              </>
            ) : (
              <>
                {/* 💡 FIXED: Explicit Home link for standard users so they can always route back to the homepage grid */}
                <Link to="/" className={location.pathname === "/" ? "btn btn-dark-brown fw-bold px-3 py-1.5 rounded-pill me-2 text-white" : "btn btn-outline-dark-brown fw-bold px-3 py-1.5 rounded-pill me-2"}>
                  <i className="bi bi-house-door-fill me-1"></i>Home
                </Link>
                <Link to="/appointments" className="btn btn-outline-dark-brown fw-bold px-3 py-1.5 rounded-pill me-2">Find Doctor</Link>
                <Link to="/medicine" className="btn btn-outline-dark-brown fw-bold px-3 py-1.5 rounded-pill me-2">Pharmacy</Link>
                <Link to="/labtest" className="btn btn-outline-dark-brown fw-bold px-3 py-1.5 rounded-pill">Lab Tests</Link>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Profile & Account Actions */}
        <div className="d-flex align-items-center gap-3">
          {activeUser ? (
            <>
              <span className="text-secondary font-medium fs-5 d-none d-md-inline">
                Welcome, <strong className="text-dark">{activeUser.name || "User"}</strong>
              </span>
              
              {!isAdmin && (
                <Link to="/account" className="btn btn-light rounded-pill px-3 fw-bold border btn-sm">Account</Link>
              )}
              
              <button onClick={handleLogout} className="btn btn-danger rounded-pill px-3 fw-bold shadow-sm d-flex align-items-center gap-1 btn-sm">
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-dark-brown rounded-pill px-4 fw-bold">Login</Link>
          )}

          {/* Hamburger Menu icon for mobile responsiveness */}
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#medicareNavbarLinks">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

      </div>
    </nav>
  );
}
