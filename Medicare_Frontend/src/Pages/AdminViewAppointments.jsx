import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import appointmentService from '../services/AppointmentService';

function AdminViewAppointments() {
  // --- STATE HOOKS LAYER ---
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- DATABASE DATA STREAM INGESTION ---
  const fetchAllAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentService.getAllAppointments();
      setAppointments(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Database connection fault streaming schedule matrix:", err);
      setError("Unable to stream live clinical directory. Running on secure local sandbox simulation database.");
      
      setAppointments([
        { 
          id: 1, 
          appointmentdate: '2026-09-16', 
          timeslot: '10:30 AM', 
          reason: 'Fever', 
          billamount: 800.0, 
          paymentmode: 'UPI', 
          status: 'Booked', 
          paymentstatus: 'Paid',
          doctor: { name: 'Dr. Amit Verma', specialization: 'Cardiologist' }, 
          user: { name: 'hasina', email: 'hasina@medicare.com', phone: '+91 9123456789' },
          patient: null // Test condition: Will fallback to user details cleanly
        },
        { 
          id: 2, 
          appointmentdate: '2026-10-25', 
          timeslot: '09:00 AM', 
          reason: 'Back-pain', 
          billamount: 800.0, 
          paymentmode: 'Cash Counter', 
          status: 'Pending', 
          paymentstatus: 'Unpaid',
          doctor: null, 
          user: { name: 'Guest User', email: 'guest@medicare.com', phone: '—' },
          patient: { firstname: 'Rahul', lastname: 'Kumar', gender: 'Male', phone: '9988776655', bloodgroup: 'A+' } // Test condition: Will show patient data
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  return (
    <div className="container pt-5 mt-5 mb-5" style={{ fontFamily: 'system-ui, sans-serif', minHeight: '85vh' }}>
      
      {/* Upper Navigation Heading Row Links Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold m-0 text-dark">Clinical Scheduling Master Ledger</h2>
          <small className="text-muted">Global tracking node monitoring medical consultation queues and patient details across the platform.</small>
        </div>
        <Link to="/admin-dashboard" className="btn btn-outline-secondary px-3 py-2 fw-semibold text-decoration-none">
          ← Dashboard Control Center
        </Link>
      </div>

      {error && (
        <div className="alert alert-warning border-0 small mb-4 py-2 shadow-sm">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border text-primary mb-2" role="status"></div>
          <div>Streaming total system consultation queues securely...</div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="alert alert-light border text-center py-5 shadow-sm rounded-3">
          <h5 className="text-secondary fw-bold mb-0">No Consultation Schedules Logged Inside Active Operational Matrices</h5>
        </div>
      ) : (
        /* 💡 Balanced 3-Cards-Per-Row Grid Display Layout (col-md-4) */
        <div className="row g-3">
          {appointments.map((item) => (
            <div className="col-md-4" key={item.id}>
              <div className="card border border-light-subtle shadow-sm rounded-3 p-3 bg-white h-100 d-flex flex-column justify-content-between">
                
                <div>
                  {/* Card Status Indicator Strip Flag Row Elements */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-secondary small fw-bold">Ticket ID: #{item.id}</span>
                    <span className="badge px-2 py-1 rounded-pill bg-warning-subtle text-warning text-capitalize" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                      ● {item.status || 'Booked'}
                    </span>
                  </div>

                  {/* Doctor Profile Metrics Header Details Block */}
                  <h5 className="fw-bold text-dark mb-0 text-truncate">{item.doctor?.name || 'Medical Officer Node'}</h5>
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded px-2.5 py-0.5 fw-semibold mb-3" style={{ fontSize: '11px' }}>
                    {item.doctor?.specialization || 'General Health'}
                  </span>

                  {/* ⚡ UPDATED CONFIGURATION BLOCK: Fallback rendering layout container logic */}
                  <div className="bg-light p-2.5 rounded mb-3" style={{ fontSize: '13px', borderLeft: item.patient ? '3px solid #dc3545' : '3px solid #0d6efd' }}>
                    {item.patient ? (
                      /* 🎯 1st Priority: Renders explicit nested Patient profile parameters if discovered */
                      <>
                        <div className="fw-bold text-dark mb-1.5 d-flex justify-content-between align-items-center">
                          <span><i className="bi bi-person-fill-gear me-1.5 text-danger"></i>Patient Profile Details</span>
                          {item.patient.bloodgroup && (
                            <span className="badge bg-danger text-white rounded-pill px-2" style={{ fontSize: '9px' }}>🩸 {item.patient.bloodgroup}</span>
                          )}
                        </div>
                        <div className="text-dark ps-1 fw-semibold">{item.patient.firstname} {item.patient.lastname}</div>
                        <div className="text-muted ps-1 mt-0.5"><i className="bi bi-gender-ambiguous me-1"></i>Gender: {item.patient.gender || '—'}</div>
                        <div className="text-muted ps-1 text-truncate"><i className="bi bi-telephone me-1"></i>Contact: {item.patient.phone || '—'}</div>
                      </>
                    ) : (
                      /* 🎯 2nd Priority: Fallback seamlessly to registered User credentials if Patient row is blank */
                      <>
                        <div className="fw-bold text-dark mb-1.5">
                          <i className="bi bi-person-circle me-1.5 text-primary"></i>User Account Details (No Patient File)
                        </div>
                        <div className="text-dark ps-1 fw-semibold text-capitalize">{item.user?.name || 'Guest User Account'}</div>
                        <div className="text-muted ps-1 mt-0.5 text-truncate"><i className="bi bi-envelope-at me-1"></i>Email: {item.user?.email || '—'}</div>
                        <div className="text-muted ps-1 text-truncate"><i className="bi bi-telephone me-1"></i>Phone: {item.user?.phone || '—'}</div>
                      </>
                    )}
                  </div>

                  {/* Session scheduling variables matching precise java keys */}
                  <div className="small text-muted mb-3" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                    <div className="text-truncate mb-1"><i className="bi bi-chat-left-text me-2"></i>Indication: <span className="text-dark font-medium">{item.reason}</span></div>
                    <div><i className="bi bi-calendar3 me-2"></i>Date Slot: <strong>{item.appointmentdate || item.appointmentDate || 'Unspecified'}</strong></div>
                    <div><i className="bi bi-clock me-2"></i>Time Window: <strong>{item.timeslot || item.timeSlot || 'Unspecified'}</strong></div>
                  </div>
                </div>

                {/* Footing statement details row */}
                <div className="border-top pt-2 mt-auto d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted d-block" style={{ fontSize: '10px' }}>CONSULT FEE</small>
                    <strong className="text-success fs-4">${item.billamount ? item.billamount.toFixed(2) : '0.00'}</strong>
                  </div>
                  <span className={`badge border fw-bold px-2 py-1.5 ${
                    item.paymentstatus?.toUpperCase() === 'PAID' || item.paymentstatus === 'Paid'
                      ? 'bg-success-subtle text-success border-success-subtle' 
                      : 'bg-danger-subtle text-danger border-danger-subtle'
                  }`} style={{ fontSize: '11px' }}>
                    {item.paymentstatus || 'Unpaid'} {item.paymentmode ? `(${item.paymentmode})` : ''}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default AdminViewAppointments;
