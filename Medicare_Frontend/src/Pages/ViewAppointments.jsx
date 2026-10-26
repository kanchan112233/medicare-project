import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentService from "../services/AppointmentService";

export default function ViewAppointments() {

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {

        if (!user) {
            navigate("/login");
            return;
        }

        AppointmentService
            .getAppointmentsByUserId(user.id)
            .then((response) => {

                setAppointments(
                    response.data || []
                );

                setLoading(false);

            })
            .catch((error) => {

                console.error(
                    "Appointment Error:",
                    error
                );

                setLoading(false);
            });

    }, [user, navigate]);

    if (loading) {
        return (
            <div className="container py-5 text-center">

                <div
                    className="spinner-border text-success"
                    role="status"
                ></div>

                <p className="mt-3">
                    Loading Appointments...
                </p>

            </div>
        );
    }

    return (

        <div
            className="container py-5"
            style={{ minHeight: "80vh" }}
        >

            <div className="mb-5">

                <h2 className="fw-bold">
                    My Doctor Appointments
                </h2>

                <p className="text-muted">
                    View and manage your booked consultations
                </p>

            </div>

            {
                appointments.length === 0 ? (

                    <div className="card shadow-sm border-0 rounded-4 p-5 text-center">

                        <i className="bi bi-calendar-x display-1 text-warning"></i>

                        <h3 className="mt-3">
                            No Appointments Found
                        </h3>

                        <p className="text-muted">
                            You haven't booked any appointments yet.
                        </p>

                        <button
                            className="btn btn-success rounded-pill px-4"
                            onClick={() =>
                                navigate("/appointments")
                            }
                        >
                            Book Appointment
                        </button>

                    </div>

                ) : (

                    <div className="row g-4">

                        {appointments.map((app) => (

                            <div
                                key={app.id}
                                className="col-lg-6"
                            >

                                <div className="card shadow-sm border-0 rounded-4 h-100">

                                    <div className="card-body p-4">

                                        <div className="d-flex justify-content-between align-items-center">

                                            <h5 className="fw-bold text-success mb-0">

                                                Appointment #{app.id}

                                            </h5>

                                            <span
                                                className={`badge px-3 py-2 ${
                                                    app.status?.toUpperCase() === "BOOKED"
                                                        ? "bg-success"
                                                        : "bg-warning text-dark"
                                                }`}
                                            >
                                                {app.status}
                                            </span>

                                        </div>

                                        <hr />

                                        <div className="mb-3">

                                            <small className="text-muted">
                                                Doctor
                                            </small>

                                            <h5 className="fw-bold mb-0">
                                                {app.doctor?.name}
                                            </h5>

                                            <span className="text-secondary">
                                                {app.doctor?.specialization}
                                            </span>

                                        </div>

                                        <div className="row mb-3">

                                            <div className="col-6">

                                                <small className="text-muted">
                                                    Date
                                                </small>

                                                <div className="fw-bold">
                                                    {app.appointmentdate}
                                                </div>

                                            </div>

                                            <div className="col-6">

                                                <small className="text-muted">
                                                    Time Slot
                                                </small>

                                                <div className="fw-bold">
                                                    {app.timeslot}
                                                </div>

                                            </div>

                                        </div>

                                        <div className="mb-3">

                                            <small className="text-muted">
                                                Reason
                                            </small>

                                            <div>
                                                {app.reason}
                                            </div>

                                        </div>

                                        <hr />

                                        <div className="d-flex justify-content-between">

                                            <div>

                                                <small className="text-muted">
                                                    Consultation Fee
                                                </small>

                                                <h4 className="text-success fw-bold mb-0">
                                                    ₹{app.billamount}
                                                </h4>

                                            </div>

                                            <div className="text-end">

                                                <small className="text-muted">
                                                    Payment
                                                </small>

                                                <div>

                                                    <span
                                                        className={`badge px-3 py-2 ${
                                                            app.paymentstatus?.toUpperCase() === "PAID"
                                                                ? "bg-success"
                                                                : "bg-danger"
                                                        }`}
                                                    >
                                                        {app.paymentstatus}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

{
    app.paymentstatus?.toUpperCase() !== "PAID" && (
        <button
            className="btn btn-success w-100 mt-4 rounded-pill fw-bold shadow-sm"
            onClick={() =>
                navigate(
                    "/payment",
                    {
                        state: {
                            // Extract key properties directly matching Payment.jsx state bindings
                            totalAmount: app.billamount || 800, // Fallback default to 800 if billamount is unassigned yet
                            userId: app.user?.id,               // Pass the logged-in session patient ID 
                            checkoutType: 'appointment',        // Crucial safety routing flag check
                            appointmentId: app.id               // Used dynamically in your Spring Boot PUT URL path parameter
                        }
                    }
                )
            }
        >
            Pay ₹{app.billamount || 800}
        </button>
    )
}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )
            }

        </div>

    );
}