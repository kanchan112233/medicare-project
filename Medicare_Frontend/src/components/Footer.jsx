import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Footer() {
  const location = useLocation();

  // Parse active session to determine layout status features dynamically
  const activeUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = activeUser?.role?.toUpperCase() === 'ADMIN';

  // Helper function to dynamically append active text-white tracking status classes
  const getFooterBtnClass = (path) => {
    const baseClass = "btn fw-bold px-4 py-2 rounded-pill fs-6 transition-all text-uppercase tracking-wide d-flex align-items-center gap-2 text-decoration-none ";
    return location.pathname === path
      ? baseClass + "btn-dark-brown shadow-sm text-white"
      : baseClass + "btn-outline-dark-brown";
  };

  return (
    <footer className="footer bg-light-brown py-4 mt-auto border-top">
      <div className="container">
        {isAdmin ? (
          /* ============================================================ */
          /* 🛡️ 1. ADMINISTRATIVE TERMINAL FOOTER LAYER (FIXED ROUTING)   */
          /* ============================================================ */
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 w-100">
            
            {/* Left Column: Admin Brand Logo Link */}
            <Link to="/admin-dashboard" className="d-flex align-items-center gap-2 text-dark-brown fs-3 fw-bold text-decoration-none">
              <i className="bi bi-heart-pulse-fill text-danger"></i>
              <span>Medicare</span>
              <span className="badge bg-danger ms-1" style={{ fontSize: "10px" }}>ADMIN PANEL</span>
            </Link>

            {/* Center Column: Global Administrative System Copyright Messaging */}
            <div className="text-muted small font-medium m-0">
              © 2026 Medicare Administrative Terminal. All rights reserved.
            </div>

            {/* Right Column: Admin Account Identity Anchor Icon Bubble Layout */}
            <div>
              {/* ⚡ FIXED: Targets "/account" path instead of "/admin-dashboard" so it loads your updated Account profile page node context layout! */}
              <Link to="/account" className="text-dark-brown d-inline-block" title="Admin Account Settings Control Center">
                <i className="bi bi-person-circle text-danger" style={{ fontSize: '2.5rem', lineHeight: '1' }}></i>
              </Link>
            </div>

          </div>
        ) : (
          /* ============================================================ */
          /* 👨‍👩‍👧‍👦 2. STANDARD PATIENT PUBLIC PANEL FOOTER                  */
          /* ============================================================ */
          <div className="d-flex flex-column flex-xl-row justify-content-between align-items-center gap-3">
            
            {/* Left Column: Brand Logo */}
            <Link to="/" className="d-flex align-items-center gap-2 text-dark-brown fs-3 fw-bold text-decoration-none">
              <i className="bi bi-heart-pulse-fill text-danger"></i>
              <span>Medicare</span>
            </Link>

            {/* Center Column: User Specific Interaction Pill Navigation Controls */}
            <div className="d-flex flex-wrap justify-content-center gap-3 align-items-center">
              <Link to="/view-appointments" className={getFooterBtnClass('/view-appointments')}>
                <i className="bi bi-calendar-check-fill"></i>
                <span>View Appointments</span>
              </Link>
              <Link to="/view-orders" className={getFooterBtnClass('/view-orders')}>
                <i className="bi bi-box-seam-fill"></i>
                <span>View Orders</span>
              </Link>
              <Link to="/view-lab-bookings" className={getFooterBtnClass('/view-lab-bookings')}>
                <i className="bi bi-flask-fill"></i>
                <span>View Lab Bookings</span>
              </Link>
            </div>

            {/* Right Column: User Account Identity Anchor Icon Bubble */}
            <div>
              <Link to="/account" className="text-dark-brown d-inline-block" title="Manage Profile Account">
                <i className="bi bi-person-circle text-dark-brown" style={{ fontSize: '2.5rem', lineHeight: '1' }}></i>
              </Link>
            </div>

          </div>
        )}
      </div>

      {/* Trademark Bottom Copyright Layer Block for Standard Users */}
      {!isAdmin && (
        <div className="text-center mt-3 pt-3 border-top border-secondary-subtle text-muted small font-medium">
          © 2026 Medicare Application. All rights reserved.
        </div>
      )}
    </footer>
  );
}

export default Footer;
