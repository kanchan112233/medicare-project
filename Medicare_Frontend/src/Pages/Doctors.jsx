// src/Pages/Doctor.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Doctor() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Query live backend database records to fetch users marked with the 'DOCTOR' role
    axios.get('http://localhost:8087/medicare/user/role/doctor')
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setDoctors(response.data);
        } else {
          setDoctors([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed downloading doctor records from database:", error);
        setDoctors([]);
        setLoading(false);
      });
  }, []);

  const handleBookRedirect = (doctor) => {
    // Navigates to the appointment form and pushes the doctor metadata via Router state parameters
    navigate('/appointments', { 
      state: { 
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.role || 'General Medicine Specialist'
      } 
    });
  };

  return (
    <div className="container py-5" style={{ minHeight: '80vh', maxWidth: '1440px' }}>
      
      <div className="mb-5 text-center text-md-start px-2 border-bottom pb-4">
        <h2 className="fw-black text-gray-900 display-5 mb-2">All Available Specialized Medical Providers</h2>
        <p className="text-secondary fs-4 mb-0">Browse certified clinical healthcare practitioners and secure an appointment block slot</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark-brown" style={{ width: '3.5rem', height: '3.5rem' }} role="status"></div>
          <p className="mt-3 text-muted fw-bold fs-4">Syncing available medical specialists...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="alert bg-light-amber text-center p-5 rounded-4 shadow-sm mx-2">
          <i className="bi bi-person-x display-3 text-warning d-block mb-3"></i>
          <h4 className="fw-bold text-gray-800 mb-2">No Doctors Found In Database</h4>
          <p className="mb-0 text-muted fs-5">Ensure your database rows are populated with active user profiles having the role 'doctor'.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-5 px-2">
          {doctors.map((doc) => (
            <div key={doc.id} className="col">
              <div className="card h-100 p-4 border border-light-brown/10 shadow-sm rounded-4 bg-white d-flex flex-sm-row align-items-center gap-4">
                
                {/* Doctor Avatar Circle */}
                <div className="bg-light-amber rounded-circle d-flex align-items-center justify-content-center text-danger flex-shrink-0 border" style={{ width: '100px', height: '100px' }}>
                  <i className="bi bi-person-heart fs-1"></i>
                </div>

                {/* Doctor Card Metadata */}
                <div className="flex-grow-1 text-center text-sm-start w-100">
                  <span className="badge bg-light-brown text-dark-brown px-3 py-1 rounded-pill mb-2 small text-uppercase fw-bold border border-amber-200/40">
                    {doc.role || 'Practitioner'}
                  </span>
                  <h3 className="fw-bold text-gray-900 mb-1 fs-2">Dr. {doc.name}</h3>
                  <p className="text-primary small font-bold mb-2 d-flex align-items-center justify-content-center justify-content-sm-start gap-1">
                    <i className="bi bi-patch-check-fill"></i> Certified Medical Practice
                  </p>
                  <p className="text-muted small text-line-clamp-2 mb-3">
                    Contact: {doc.phone || 'N/A'} | Email: {doc.email || 'N/A'}
                  </p>

                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 border-top pt-3 mt-2">
                    <div>
                      <span className="text-muted small d-block mb-0 font-medium">Consultation Fee</span>
                      <span className="fs-3 fw-black text-success">₹800.00</span>
                    </div>
                    
                    <button 
                      onClick={() => handleBookRedirect(doc)}
                      className="btn btn-dark-brown rounded-pill py-2.5 px-4 fw-bold fs-5 text-uppercase shadow-sm"
                    >
                      Book Appointment
                    </button>
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

export default Doctor;