// src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MedicineService from '../services/MedicineService';
import UserService from '../services/UserService';

function Home() {
  const [availableMedicines, setAvailableMedicines] = useState(0);

  // Sync with Spring Boot MedicineController back-end on mount
  useEffect(() => {
    MedicineService.getAllMedicines()
      .then((response) => {
        if (response.data) setAvailableMedicines(response.data.length);
      })
      .catch((error) => console.error("Could not fetch database inventory counts:", error));
  }, []);

  return (
    <div className="home-background top-space pb-5">

      {/* Clean Aesthetic Hero Banner */}
      <div className="container mt-4">
        <div className="hero bg-light-amber text-center p-5 rounded-4 shadow-sm border border-amber-100 position-relative overflow-hidden">
          <h1 className="fw-bold hero-title text-gray-900">Your Health, Our Priority</h1>
          <p className="lead mt-3 hero-subtitle text-secondary max-w-2xl mx-auto">
            Book appointments, order medicines, and schedule lab tests — all in one modern, secure place.
          </p>
          <Link to="/appointments" className="btn btn-dark-brown btn-lg mt-3 px-5 py-3 font-semibold shadow-sm">
            Get Started
          </Link>
        </div>
      </div>

      {/* Main Core Service Matrix */}
      <div className="container mt-5">
        <h2 className="text-center mb-5 section-heading fw-bold">Welcome to Medicare</h2>
        <div className="row g-4">

          {/* Book Appointment Module */}
          <div className="col-md-4 col-sm-12">
            <div className="card shadow-sm border-0 p-4 transition-card" style={{ minHeight: '380px' }}>
              <div className="card-body d-flex flex-column justify-content-between align-items-center text-center">
                <div>
                  <div className="icon-wrapper mb-3 text-primary bg-primary-light rounded-circle mx-auto">
                    <i className="bi bi-calendar-check fs-1"></i>
                  </div>
                  <h5 className="fw-bold card-title-custom text-gray-800">Book Appointment</h5>
                  <p className="text-muted small mt-2 px-2">
                    Schedule local in-clinic or face-to-face video consultations with verified specialists.
                  </p>
                </div>
                {/* Perfectly Centered Bottom Button */}
                <Link to="/appointments" className="btn btn-dark-brown px-4 py-2 mt-auto">
                  Book Now
                </Link>
              </div>
            </div>
          </div>

          {/* Order Medicine Module */}
          <div className="col-md-4 col-sm-12">
            <div className="card shadow-sm border-0 p-4 transition-card position-relative" style={{ minHeight: '380px' }}>
              {availableMedicines > 0 && (
                <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-success px-3 py-2 shadow-sm">
                  {availableMedicines} Items Online
                </span>
              )}
              <div className="card-body d-flex flex-column justify-content-between align-items-center text-center">
                <div>
                  <div className="icon-wrapper mb-3 text-danger bg-danger-light rounded-circle mx-auto">
                    <i className="bi bi-capsule fs-1"></i>
                  </div>
                  <h5 className="fw-bold card-title-custom text-gray-800">Order Medicine</h5>
                  <p className="text-muted small mt-2 px-2">
                    Browse catalog medications securely from our pharmacy with immediate cold-chain home delivery.
                  </p>
                </div>
                {/* Perfectly Centered Bottom Button */}
                <Link to="/medicine" className="btn btn-dark-brown px-4 py-2 mt-auto">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>

          {/* Book Lab Test Module */}
          <div className="col-md-4 col-sm-12">
            <div className="card shadow-sm border-0 p-4 transition-card" style={{ minHeight: '380px' }}>
              <div className="card-body d-flex flex-column justify-content-between align-items-center text-center">
                <div>
                  <div className="icon-wrapper mb-3 text-success bg-success-light rounded-circle mx-auto">
                    <i className="bi bi-flask fs-1"></i>
                  </div>
                  <h5 className="fw-bold card-title-custom text-gray-800">Book Lab Test</h5>
                  <p className="text-muted small mt-2 px-2">
                    Reserve comprehensive checkups or sample diagnostic testing packages with trusted lab partners.
                  </p>
                </div>
                {/* Perfectly Centered Bottom Button */}
                <Link to="/labtest" className="btn btn-dark-brown px-4 py-2 mt-auto">
                  Book Test
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Home;
