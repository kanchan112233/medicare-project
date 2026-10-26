import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/UserService';
import labTestService from '../services/LabTestService';

function AdminViewLabBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- COMPILING USER LISTS TO ACCUMULATE LAB RECORDS ---
  const compileAllLabBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch all registered platform user profiles from the database
      const usersResponse = await userService.getAllUsers();
      const usersList = Array.isArray(usersResponse.data) ? usersResponse.data : [];

      if (usersList.length === 0) {
        setBookings([]);
        setLoading(false);
        return;
      }

      // 2. Dynamic Asynchronous Loop Tree: Query the lab bookings for each user sequentially
      const dynamicBookingPromises = usersList.map(async (user) => {
        try {
          // Hits your mapped Java endpoint: /lab-booking/user/{userId}
          const userBookingRes = await labTestService.getLabBookingsByUserId(user.id);
          const individualBookings = Array.isArray(userBookingRes.data) ? userBookingRes.data : [];
          
          // Re-inject the user profile details directly into each booking item for clear rendering cards
          return individualBookings.map(booking => ({
            ...booking,
            user: user // Re-attaches name and email parameters safely
          }));
        } catch (singleErr) {
          console.error(`Skipping lab booking fetch loop index for user ID: ${user.id}`, singleErr);
          return [];
        }
      });

      // 3. Resolve all promises and merge the arrays into a single combined registry list
      const resolvedBookingArrays = await Promise.all(dynamicBookingPromises);
      const mergedSystemBookings = resolvedBookingArrays.flat();

      // Sort the bookings by ID in descending order so new bookings show up first
      mergedSystemBookings.sort((a, b) => b.id - a.id);
      
      setBookings(mergedSystemBookings);
    } catch (err) {
      console.error("Global admin pathology ledger collection loop crash:", err);
      setError("Unable to stream live clinical database logs. Running on local backup simulation matrix.");
      
      // Fallback development mock matrix matching your entity variables perfectly
      setBookings([
        { id: 1001, labTest: { name: 'Lipid Profile Panel', category: 'Biochemistry' }, user: { name: 'Amit Verma', email: 'amit@gmail.com' }, appointmentDate: '2026-10-28', paymentmode: 'Online Card', status: 'Booked', paymentstatus: 'Paid', billamount: 65.0 },
        { id: 1002, labTest: { name: 'Complete Blood Count (CBC)', category: 'Hematology' }, user: { name: 'Rajesh Sharma', email: 'rajesh@yahoo.com' }, appointmentDate: '2026-10-29', paymentmode: 'Cash On Pickup', status: 'Pending', paymentstatus: 'Unpaid', billamount: 45.0 },
        { id: 1003, labTest: { name: 'HbA1c Diabetic Test', category: 'Endocrinology' }, user: { name: 'Priya Desai', email: 'priya@outlook.com' }, appointmentDate: '2026-10-30', paymentmode: 'Online Card', status: 'Booked', paymentstatus: 'Paid', billamount: 55.0 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    compileAllLabBookings();
  }, []);

  return (
    <div className="container pt-5 mt-5 mb-5" style={{ fontFamily: 'system-ui, sans-serif', minHeight: '85vh' }}>
      
      {/* Upper Navigation Heading Row Links Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold m-0 text-dark">System Pathology Ledger Master</h2>
          <small className="text-muted">Global administrative view compiled from your user lab booking databases.</small>
        </div>
        <div className="d-flex gap-2">
          <button onClick={compileAllLabBookings} className="btn btn-outline-dark px-3 py-2 fw-semibold">
            🔄 Refresh Registry
          </button>
          <Link to="/admin-dashboard" className="btn btn-outline-secondary px-3 py-2 fw-semibold text-decoration-none">
            Dashboard Control Center
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning border-0 small mb-4 py-2 shadow-sm animate-fade-in">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border text-info mb-2" role="status"></div>
          <div>Compiling cross-referenced user pathology orders safely from database...</div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="alert alert-light border text-center py-5 shadow-sm rounded-3">
          <h5 className="text-secondary fw-bold mb-0">No Laboratory Bookings Discovered Across Registered User Accounts</h5>
        </div>
      ) : (
        /* 💡 3-Cards-Per-Row Grid Display Layout (col-md-4) */
        <div className="row g-3">
          {bookings.map((booking) => (
            <div className="col-md-4" key={booking.id}>
              <div className="card border border-light-subtle shadow-sm rounded-3 bg-white p-3 h-100 d-flex flex-column justify-content-between">
                
                <div>
                  {/* Status Strip Header Tag Row Elements */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-secondary small fw-bold">Ticket: #{booking.id}</span>
                    <span className={`badge px-2 py-1 rounded-pill ${
                      booking.status?.toUpperCase() === 'BOOKED' || booking.status === 'Confirmed'
                        ? 'bg-success-subtle text-success' 
                        : 'bg-warning-subtle text-warning'
                    }`}>
                      ● {booking.status || 'Pending'}
                    </span>
                  </div>

                  {/* Lab Test Target Profile Indicators */}
                  <h5 className="fw-bold text-dark mb-0 text-truncate">{booking.labTest?.name || 'Diagnostic Panel'}</h5>
                  <span className="badge bg-info-subtle text-info border border-info-subtle rounded py-0.5 px-2 mb-3" style={{ fontSize: '11px' }}>
                    {booking.labTest?.category || 'Pathology Check'}
                  </span>

                  {/* Patient Profile Account Metadata Card Box */}
                  <div className="bg-light p-2.5 rounded mb-3" style={{ fontSize: '13px' }}>
                    <div className="fw-bold text-dark mb-1"><i className="bi bi-person me-2"></i>Patient Account Info</div>
                    <div className="text-dark ps-3 fw-medium">{booking.user?.name || 'Guest User'}</div>
                    <div className="text-muted ps-3 text-truncate">{booking.user?.email || '—'}</div>
                  </div>

                  {/* Core tracking specifications matching entity object attributes keys */}
                  <div className="small text-muted mb-2" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                    <div><i className="bi bi-calendar3 me-2"></i>Slotted Date: <strong>{booking.appointmentDate || 'Unscheduled'}</strong></div>
                    <div><i className="bi bi-wallet2 me-2"></i>Billing Path: <span className="text-dark fw-medium">{booking.paymentmode || 'Cash Counter'}</span></div>
                    <div>
                      <i className="bi bi-shield-check me-2"></i>Ledger Sync: 
                      <span className={`fw-bold ms-1 ${
                        booking.paymentstatus?.toUpperCase() === 'PAID' ? 'text-success' : 'text-danger'
                      }`}>{booking.paymentstatus || 'Unpaid'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Payment Metrics Summary Box */}
                <div className="border-top pt-2 mt-3 text-start">
                  <small className="text-muted d-block" style={{ fontSize: '10px' }}>STATEMENT TOTAL</small>
                  <strong className="text-dark fs-5">${booking.billamount || booking.labTest?.price || '0.00'}</strong>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default AdminViewLabBookings;
