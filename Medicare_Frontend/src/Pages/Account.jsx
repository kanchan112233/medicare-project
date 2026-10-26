import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const navigate = useNavigate();
  
  const sessionUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!sessionUser) {
      navigate('/login');
    }
  }, [sessionUser, navigate]);

  if (!sessionUser) {
    return null;
  }

  const isAdmin = sessionUser?.role?.toUpperCase() === 'ADMIN';

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    alert("🔒 Logged out successfully!");
    navigate('/login');
  };

  return (
    <div className="container pt-5 mt-5 mb-5" style={{ minHeight: '80vh', maxWidth: '600px', fontFamily: 'system-ui, sans-serif' }}>
      <div className="card shadow border-0 rounded-4 p-4 text-center bg-white mt-3">
        <div className="mb-4 text-center">
          <i className={`bi bi-person-circle ${isAdmin ? 'text-danger' : 'text-dark-brown'}`} style={{ fontSize: '6rem' }}></i>
        </div>
        
        <h2 className="fw-bold text-gray-900 mb-2">
          {isAdmin ? '🛡️ Admin Profile Control Center' : 'My Account Profile'}
        </h2>
        <p className="text-muted mb-4">Manage your Medicare secure session configuration</p>
        
        <hr />
        
        <div className="text-start my-4 px-3">
          <div className="mb-3">
            <label className="text-muted small d-block fw-semibold text-uppercase">Account Name</label>
            <span className="fw-bold fs-5 text-dark">{sessionUser.name || "Administrator"}</span>
          </div>
          <div className="mb-3">
            <label className="text-muted small d-block fw-semibold text-uppercase">Registered Email Address</label>
            <span className="fw-semibold text-dark">{sessionUser.email}</span>
          </div>
          <div className="mb-3">
            <label className="text-muted small d-block fw-semibold text-uppercase">Role Permissions</label>
            <span className={`badge text-uppercase px-3 py-1.5 rounded-pill font-medium ${isAdmin ? 'bg-danger text-white' : 'bg-success-subtle text-success'}`}>
              {sessionUser.role || "PATIENT"}
            </span>
          </div>
        </div>

        <hr className="mb-4" />

        <div className="d-flex flex-column gap-3">
          {isAdmin ? (
            <button className="btn btn-outline-danger rounded-pill py-2.5 fw-bold text-uppercase" onClick={() => navigate('/admin-dashboard')}>
              <i className="bi bi-speedometer2 me-2"></i> Return to Admin Dashboard
            </button>
          ) : (
            <button className="btn btn-outline-dark rounded-pill py-2.5 fw-bold" onClick={() => navigate('/view-orders')}>
              📦 View My Orders History
            </button>
          )}
          
          <button className="btn btn-danger rounded-pill py-2.5 fw-bold text-uppercase shadow-sm" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Log Out from Device
          </button>
        </div>
      </div>
    </div>
  );
}
