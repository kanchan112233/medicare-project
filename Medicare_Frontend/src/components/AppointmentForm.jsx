import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppointmentService from "../services/AppointmentService";

export default function AppointmentForm() {

    const location = useLocation();
    const navigate = useNavigate();

    const doctor = location.state?.doctor;
    console.log("Doctor:", doctor);


    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User:", user);
 if (!user) {
    navigate("/login");
    return null;
}

if (!doctor) {
    return (
        <div className="container py-5 text-center">
            <h3>No Doctor Selected</h3>

            <button
                className="btn btn-primary mt-3"
                onClick={() => navigate("/appointments")}
            >
                Back To Doctors
            </button>
        </div>
    );
}

    const [bookingFor, setBookingFor] = useState("self");

    const [appointmentDate, setAppointmentDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [reason, setReason] = useState("");

    const [patient, setPatient] = useState({
        firstname: "",
        lastname: "",
        gender: "",
        birthdate: "",
        phone: "",
        email: "",
        address: "",
        bloodgroup: ""
    });

    const handlePatientChange = (e) => {
        setPatient({
            ...patient,
            [e.target.name]: e.target.value
        });
    };

    const saveAppointment = () => {

        if (!appointmentDate || !timeSlot || !reason) {
            alert("Please fill all appointment details");
            return;
        }

const payload = {

    appointmentdate: appointmentDate,

    timeslot: timeSlot,

    reason: reason,

    status: "PENDING",

    paymentstatus: "UNPAID",

    paymentmode: "",

    billamount: doctor.fees,

    user: {
        id: user.id
    },

    doctor: {
        id: doctor.id || doctor.doc_id
    },

    patient: bookingFor === "other"
        ? patient
        : null
};

console.log(
  "Appointment Payload:",
  JSON.stringify(payload, null, 2)
);


        AppointmentService.addAppointment(payload)
            .then(() => {

                alert("Appointment Booked Successfully");

                navigate("/appointments");

            })
.catch((error) => {

    console.log("FULL ERROR", error);

    console.log("RESPONSE", error.response);

    console.log("RESPONSE DATA", error.response?.data);

    alert(JSON.stringify(error.response?.data));
});
    };

    return (
        <div className="container py-5">

            <div className="row">

                {/* LEFT SECTION */}

                <div className="col-lg-8">

                    <div className="card shadow-sm border-0 rounded-4 p-4">

                        <h2 className="fw-bold mb-4">
                            Book Appointment
                        </h2>

                        {/* Booking Type */}

                        <h5 className="mb-3">
                            Who is this consultation for?
                        </h5>

                        <div className="d-flex gap-3 mb-4">

                            <button
                                type="button"
                                className={`btn ${
                                    bookingFor === "self"
                                        ? "btn-success"
                                        : "btn-outline-secondary"
                                }`}
                                onClick={() => setBookingFor("self")}
                            >
                                Myself
                            </button>

                            <button
                                type="button"
                                className={`btn ${
                                    bookingFor === "other"
                                        ? "btn-success"
                                        : "btn-outline-secondary"
                                }`}
                                onClick={() => setBookingFor("other")}
                            >
                                Someone Else
                            </button>

                        </div>

                        {/* Patient Form */}

                        {bookingFor === "other" && (

                            <div className="border rounded-4 p-4 mb-4">

                                <h5 className="fw-bold mb-3">
                                    Patient Details
                                </h5>

                                <div className="row">

                                    <div className="col-md-6 mb-3">
                                        <input
                                            type="text"
                                            name="firstname"
                                            className="form-control"
                                            placeholder="First Name"
                                            onChange={handlePatientChange}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <input
                                            type="text"
                                            name="lastname"
                                            className="form-control"
                                            placeholder="Last Name"
                                            onChange={handlePatientChange}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <select
                                            name="gender"
                                            className="form-select"
                                            onChange={handlePatientChange}
                                        >
                                            <option value="">
                                                Select Gender
                                            </option>
                                            <option value="Male">
                                                Male
                                            </option>
                                            <option value="Female">
                                                Female
                                            </option>
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <input
                                            type="date"
                                            name="birthdate"
                                            className="form-control"
                                            onChange={handlePatientChange}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <input
                                            type="text"
                                            name="phone"
                                            className="form-control"
                                            placeholder="Phone"
                                            onChange={handlePatientChange}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            placeholder="Email"
                                            onChange={handlePatientChange}
                                        />
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <textarea
                                            name="address"
                                            rows="2"
                                            className="form-control"
                                            placeholder="Address"
                                            onChange={handlePatientChange}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            name="bloodgroup"
                                            className="form-control"
                                            placeholder="Blood Group"
                                            onChange={handlePatientChange}
                                        />
                                    </div>

                                </div>

                            </div>
                        )}

                        {/* Appointment Details */}

                        <h5 className="fw-bold mb-3">
                            Appointment Details
                        </h5>

                        <div className="mb-3">
                            <label className="form-label">
                                Appointment Date
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={appointmentDate}
                                onChange={(e) =>
                                    setAppointmentDate(e.target.value)
                                }
                            />
                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Select Time Slot
                            </label>

                            <select
                                className="form-select"
                                value={timeSlot}
                                onChange={(e) =>
                                    setTimeSlot(e.target.value)
                                }
                            >
                                <option value="">
                                    Select Slot
                                </option>

                                <option value="09:00 AM">
                                    09:00 AM
                                </option>

                                <option value="10:30 AM">
                                    10:30 AM
                                </option>

                                <option value="11:45 AM">
                                    11:45 AM
                                </option>

                                <option value="04:15 PM">
                                    04:15 PM
                                </option>

                                <option value="05:30 PM">
                                    05:30 PM
                                </option>

                                <option value="07:00 PM">
                                    07:00 PM
                                </option>

                            </select>

                        </div>

                        <div className="mb-4">

                            <label className="form-label">
                                Reason for Consultation
                            </label>

                            <textarea
                                rows="4"
                                className="form-control"
                                value={reason}
                                onChange={(e) =>
                                    setReason(e.target.value)
                                }
                            />

                        </div>

                        <button
                            className="btn btn-success btn-lg w-100"
                            onClick={saveAppointment}
                        >
                            Confirm Appointment
                        </button>

                    </div>

                </div>

                {/* RIGHT SUMMARY */}

                <div className="col-lg-4">

                    <div className="card shadow-sm border-0 rounded-4 p-4">

                        <h3 className="fw-bold mb-3">
                            Consultation Summary
                        </h3>

                        <hr />

                        <p>
                            <strong>Doctor</strong>
                            <br />
                            Dr. {doctor?.name}
                        </p>

                        <p>
                            <strong>Specialization</strong>
                            <br />
                            {doctor?.specialization}
                        </p>

                        <p>
                            <strong>Consultation Fee</strong>
                            <br />
                            ₹{doctor?.fees}
                        </p>

                        <p>
                            <strong>Booked For</strong>
                            <br />
                            {bookingFor === "self"
                                ? "Myself"
                                : "Someone Else"}
                        </p>

                        <p>
                            <strong>Date</strong>
                            <br />
                            {appointmentDate || "Not selected"}
                        </p>

                        <p>
                            <strong>Slot</strong>
                            <br />
                            {timeSlot || "Not selected"}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}