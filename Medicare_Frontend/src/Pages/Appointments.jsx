// src/Pages/Appointments.jsx
import React, { useState, useEffect } from 'react';
import DoctorService from '../services/DoctorService';
import { useNavigate } from "react-router-dom";

export default function Appointments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // The 9 formatted visual layout cards mapping straight onto your exact seeded DB categories
  const specialtiesLayout = [
    { title: "General Physician", dbMatch: "General Physician", desc: "Find the right family doctor in your neighborhood.", icon: "bi-activity", bgClass: "bg-primary-light text-primary" },
    { title: "Pediatrician", dbMatch: "Pediatrician", desc: "Child care specialist and expert care for infants.", icon: "bi-heart-pulse", bgClass: "bg-danger-light text-danger" },
    { title: "Orthopedist", dbMatch: "Orthopedic", desc: "For bone and joints issues, injuries, fractures, and more.", icon: "bi-clipboard-pulse", bgClass: "bg-success-light text-success" },
    { title: "General Surgeon", dbMatch: "General Surgeon", desc: "Need to get operated? Find the right surgical expert.", icon: "bi-shield-plus", bgClass: "bg-info-light text-info" },
    { title: "Dentist", dbMatch: "Dentist", desc: "Teething troubles? Schedule a regular dental checkup.", icon: "bi-brightness-high", bgClass: "bg-warning-light text-warning" },
    { title: "Gynecologist", dbMatch: "Gynecologist", desc: "Explore for women's health, pregnancy, and treatments.", icon: "bi-gender-female", bgClass: "bg-primary-light text-purple" },
    { title: "Cardiologist", dbMatch: "Cardiologist", desc: "Heart specialist with top-tier cardiac surgical experience.", icon: "bi-heart", bgClass: "bg-danger-light text-danger" },
    { title: "Dermatologist", dbMatch: "Dermatologist", desc: "Skin allergy, acne, hair treatment, and laser care expert.", icon: "bi-person-circle", bgClass: "bg-warning-light text-warning" },
    { title: "Gastroenterologist", dbMatch: "Gastroenterologist", desc: "For issues related to the digestive system, stomach, and liver.", icon: "bi-droplet", bgClass: "bg-info-light text-primary" }
  ];

  // Fetch initial full directory from backend database row mapping
  useEffect(() => {
    fetchInitialDoctors();
  }, []);

  const fetchInitialDoctors = () => {
    setLoading(true);
    DoctorService.getAllDoctors()
      .then((response) => {
        if (response.data) setDoctorsList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error connecting with DoctorController data layers:", error);
        setLoading(false);
      });
  };

  // Handle Book Appointment button click, navigating to the booking page with the selected doctor's ID
const handleBookAppointment = (doctor) => {

    const user = localStorage.getItem("user");

    console.log("Current User:", user);

    if (!user) {

        alert("Please Login First");

        navigate("/login");

        return;
    }

    navigate("/appointment-form", {
        state: { doctor }
    });
};

  // Triggers filtering strictly using your database column keys
  const handleSpecialtyClick = (dbMatchKey) => {
    setSearchQuery(dbMatchKey);
    setLoading(true);

    DoctorService.getDoctorsBySpecialty(dbMatchKey)
      .then((response) => {
        if (response.data) {
          setDoctorsList(response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.warn("Direct specialty endpoint mapping failed, executing exact query array loop fallback...");
        
        // Accurate client-side filter fallback using the database fields if names differ slightly
        DoctorService.getAllDoctors().then((res) => {
          if (res.data) {
            const matched = res.data.filter(d => String(d.specialization).trim().toLowerCase() === dbMatchKey.toLowerCase());
            setDoctorsList(matched);
          }
          setLoading(false);
        }).catch(() => setLoading(false));
      });
  };

  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>

      {/* Directory Headings */}
      <div className="mb-5 text-center text-md-start">
        <h2 className="fw-bold text-gray-900 mb-1">Book an appointment for an in-clinic consultation</h2>
        <p className="text-secondary fs-5">Find experienced doctors across all specialties</p>
      </div>

      {/* 9 Specialty Cards UI Grid - Fixed structure layout matching the design exactly */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
        {specialtiesLayout.map((item, idx) => (
          <div key={idx} className="col">
            <div 
              onClick={() => handleSpecialtyClick(item.dbMatch)}
              className={`card h-100 shadow-sm border p-4 transition-card ${
                searchQuery === item.dbMatch ? 'border-dark-brown bg-light-amber/40' : 'border-light-brown/20 bg-white'
              }`}
              style={{ cursor: 'pointer', borderRadius: '16px' }}
            >
              <div className="d-flex align-items-start gap-3">
                <div className={`icon-wrapper flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center fs-2 ${item.bgClass}`} style={{ width: '60px', height: '60px' }}>
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <div className="flex-grow-1">
                  <h5 className="fw-bold text-gray-800 mb-1">{item.title}</h5>
                  <p className="text-muted small mb-2 leading-normal">{item.desc}</p>
                  <span className="text-primary fw-bold small d-inline-flex align-items-center gap-1">
                    Find Doctors <i className="bi bi-arrow-right-short fs-5"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Results Grid Section — Loads real data directly matching the selected card category */}
      <div className="border-top pt-5 mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-gray-900 mb-0">
            {searchQuery ? `Showing Specialist Results for "${searchQuery}"` : 'All Available Specialized Medical Providers'} 
          </h3>
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); fetchInitialDoctors(); }} className="btn btn-outline-dark-brown btn-sm rounded-pill px-3">
              Clear Filter
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-dark-brown" style={{ width: '3rem', height: '3rem' }} role="status"></div>
            <p className="mt-3 text-muted fw-bold">Querying clinical records...</p>
          </div>
        ) : doctorsList.length === 0 ? (
          <div className="alert bg-light-amber text-center p-5 border border-amber-100 rounded-4 shadow-sm">
            <i className="bi bi-info-circle fs-2 text-warning d-block mb-3"></i>
            <h5 className="fw-bold text-gray-800 mb-1">No Doctors Listed</h5>
            <p className="mb-0 text-muted small px-3">No active records found matching the "{searchQuery}" specialization in the database currently.</p>
          </div>
        ) : (
          /* Live Doctor output grid cleanly showing entries found on your seeded database */
          <div className="row g-4">
            {doctorsList.map((doc) => (
              <div key={doc.doc_id || doc.id} className="col-lg-6 col-sm-12">
                <div className="card p-4 shadow-sm border border-light-brown/10 d-flex flex-sm-row gap-4 align-items-center rounded-4 h-100 bg-white">
                  
                  {doc.image ? (
                    <img src={doc.image} alt={doc.name} className="rounded-circle object-cover shadow-sm border" style={{ width: '95px', height: '95px' }} />
                  ) : (
                    <div className="bg-light-brown text-dark-brown rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm border" style={{ width: '95px', height: '95px' }}>
                      <i className="bi bi-person-fill-gear fs-1"></i>
                    </div>
                  )}
                  
                  <div className="flex-grow-1 text-center text-sm-start w-100">
                    <span className="badge bg-light-brown text-dark-brown px-3 py-1.5 rounded-pill mb-2 small text-uppercase fw-bold border border-amber-200/40">
                      {doc.specialization}
                    </span>
                    <h4 className="fw-bold text-gray-900 mb-1">{doc.name}</h4>
                    <p className="text-primary small fw-bold mb-2">
                      <i className="bi bi-patch-check-fill me-1"></i> {doc.experience} Years Certified Practice
                    </p>
                    <p className="text-muted small mb-3 leading-relaxed text-line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {doc.description}
                    </p>
                    
                    <div className="d-flex flex-wrap align-items-center justify-content-sm-between justify-content-center gap-3 border-top pt-3 mt-2">
                      <span className="fs-5 fw-bold text-gray-800">
                        Consultation Fee: <span className="text-success fw-black">₹{doc.fees}</span>
                      </span>
 <button
    className="btn btn-dark-brown btn-sm py-2 px-4 rounded-pill"
    onClick={() => handleBookAppointment(doc)}
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

    </div>
  );
}
