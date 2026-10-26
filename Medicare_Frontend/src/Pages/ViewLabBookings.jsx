// src/Pages/ViewLabBookings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LabTestService from "../services/LabTestService";

export default function ViewLabBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const fetchUserBookings = () => {
        if (!user || !user.id) {
            navigate("/login");
            return;
        }
        LabTestService.getLabBookingsByUserId(user.id)
            .then((response) => {
                setBookings(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading laboratory bookings:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUserBookings();
    }, [navigate]);

    const handleDateChange = (id, selectedDate) => {
        if (!selectedDate) return;
        LabTestService.updateLabBookingDate(id, selectedDate)
            .then(() => {
                // Refresh list on successful database save operation
                fetchUserBookings();
            })
            .catch((err) => {
                console.error("Failed to commit appointment schedule update:", err);
                alert("Could not update appointment schedule parameter on server.");
            });
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toUpperCase()) {
            case "BOOKED": return "bg-success text-white";
            case "PENDING": return "bg-warning text-dark";
            case "CANCELLED": return "bg-danger text-white";
            default: return "bg-secondary text-white";
        }
    };

    const getPaymentBadgeClass = (payStatus) => {
        if (payStatus?.toUpperCase() === "PAID") return "bg-success text-white";
        return "bg-danger text-white";
    };

    if (loading) {
        return (
            <div className="container py-5 text-center" style={{ minHeight: '70vh' }}>
                <div className="spinner-border text-dark-brown" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                <p className="mt-3 fw-bold text-secondary fs-5">Loading laboratory reports list...</p>
            </div>
        );
    }

    return (
        <div className="container py-5" style={{ minHeight: '80vh', maxWidth: '1200px' }}>
            
            <div className="mb-5 text-center text-md-start">
                <h2 className="fw-black text-gray-900 display-5 mb-2">My Diagnostic Lab Bookings</h2>
                <p className="text-secondary fs-4">Track the registration status and transaction details of your medical tests</p>
            </div>

            {bookings.length === 0 ? (
                <div className="card p-5 text-center shadow-sm border rounded-4 bg-white">
                    <h4 className="fw-bold mb-2">No Lab Testing Rows Found</h4>
                    <p className="text-muted mb-4">You have not scheduled any diagnostic lab testing profiles yet.</p>
                    <button className="btn btn-dark-brown btn-lg rounded-pill px-4 fw-bold shadow-sm" onClick={() => navigate("/labtest")}>
                        Browse Lab Checkups
                    </button>
                </div>
            ) : (
                <div className="row g-4">
                    {bookings.map((booking) => (
                        <div className="col-12 col-md-6 col-lg-4" key={booking.id}>
                            <div className="card h-100 shadow-sm border border-light-brown/10 rounded-4 bg-white d-flex flex-column justify-content-between">
                                
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="text-muted small fw-bold text-uppercase tracking-wider">Reg Token #{booking.id}</span>
                                        <span className={`badge px-3 py-2 rounded-pill fw-bold text-uppercase ${getStatusBadgeClass(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <h4 className="fw-bold text-gray-900 mb-2 text-truncate" title={booking.labTest?.name}>
                                        {booking.labTest?.name || "Diagnostic Profiling Checkup"}
                                    </h4>
                                    
                                    <span className="badge bg-light-brown text-dark-brown mb-3 small text-uppercase fw-semibold border border-amber-200/40">
                                        {booking.labTest?.category || "General Testing"}
                                    </span>

                                    <hr className="my-3 opacity-25" />

                                    <div className="row g-3 py-2 bg-light rounded-3 px-1 mx-0 border border-gray-100">
                                        <div className="col-6 border-end">
                                            <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Total Cost</small>
                                            <span className="fs-3 fw-black text-success">₹{booking.billamount}</span>
                                        </div>
                                        <div className="col-6 text-end d-flex flex-column justify-content-center align-items-end">
                                            <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>Payment Status</small>
                                            <span className={`badge px-2.5 py-1.5 rounded fw-bold text-uppercase ${getPaymentBadgeClass(booking.paymentstatus)}`} style={{ fontSize: '0.75rem' }}>
                                                {booking.paymentstatus}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {booking.paymentmode && (
                                        <div className="mt-3 px-1 d-flex justify-content-between align-items-center small text-muted">
                                            <span>Channel Route:</span>
                                            <span className="fw-bold text-uppercase text-dark-brown">{booking.paymentmode === 'CASH' ? 'Pay At Counter' : booking.paymentmode}</span>
                                        </div>
                                    )}
                                </div>

                                {/* 💡 CARD FOOTER: Dynamic interactive appointment date management bar */}
                                <div className="p-3 bg-light border-top border-2 border-white rounded-bottom-4">
                                    <div className="d-flex flex-column gap-1">
                                        <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Scheduled Appointment Date</small>
                                        
                                        {booking.status?.toUpperCase() === "PENDING" ? (
                                            // Allows patients to choose an appointment date if the booking is pending
                                            <input 
                                                type="date" 
                                                value={booking.appointmentDate || ""} 
                                                min={new Date().toISOString().split('T')[0]} // Blocks past historical dates
                                                onChange={(e) => handleDateChange(booking.id, e.target.value)}
                                                className="form-control form-control-sm rounded border-gray-300 fw-medium"
                                            />
                                        ) : (
                                            // Locked text layout block for officially booked appointments
                                            <div className="d-flex align-items-center gap-2 text-dark font-medium fs-5 mt-0.5">
                                                <span>📅</span>
                                                <span className="fw-bold">
                                                    {booking.appointmentDate ? new Date(booking.appointmentDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "Date Unscheduled"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
