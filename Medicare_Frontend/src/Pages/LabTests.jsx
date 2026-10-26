// src/Pages/LabTests.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LabTestService from '../services/LabTestService';

export default function LabTests() {
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // 💡 Local state tracking object keeps individual date selectors isolated per card id reference keys
  const [selectedDates, setSelectedDates] = useState({});

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const categories = ['All', 'General Checkup', 'Cardiology', 'Diagnostics', 'Diabetology', 'Vitamin Profiling'];

  useEffect(() => {
    LabTestService.getAllLabTests()
      .then((response) => {
        if (response.data) {
          setLabTests(response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error communicating with LabTestController backend repositories:", error);
        setLoading(false);
      });
  }, []);

  const handleDateChange = (testId, dateStr) => {
    setSelectedDates(prev => ({ ...prev, [testId]: dateStr }));
  };

  const handleBookTest = (test) => {
    const chosenDate = selectedDates[test.id];
    
    if (!user || !user.id) {
      alert("Please login to book a laboratory test.");
      navigate("/login");
      return;
    }

    if (!chosenDate) {
      alert("Please select a preferred appointment date before checking out.");
      return;
    }

    // Passes chosenDate straight into the initial creation payload 
    LabTestService.bookLabTest(test.id, user.id, chosenDate)
      .then((response) => {
        const savedBooking = response.data; 

        // Route instantly down into your secure reusable Payment Gateway layout component 
        navigate("/payment", {
          state: {
            totalAmount: test.price,              
            userId: user.id,                      
            checkoutType: 'labtest',              
            appointmentId: savedBooking.id        
          }
        });
      })
      .catch((error) => {
        console.error("Booking Error:", error);
        alert("Could not initialize lab test booking request on server.");
      });
  };

  const filteredTests = activeCategory.toLowerCase() === 'all' 
    ? labTests 
    : labTests.filter(test => {
        const itemCategory = test.category ? String(test.category).trim().toLowerCase() : '';
        const targetCategory = activeCategory.trim().toLowerCase();
        return itemCategory === targetCategory;
      });

  return (
    <div className="container py-5" style={{ minHeight: '80vh', maxWidth: '1440px' }}>
      
      <div className="text-center text-md-start mb-5 px-2">
        <h2 className="fw-black text-gray-900 display-5 mb-2">Diagnostic Lab Testing</h2>
        <p className="text-secondary fs-4">Select your preferred date and book health profiles instantly</p>
      </div>

      <div className="d-flex flex-wrap gap-3 mb-5 px-2">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategory(cat)}
            className={`btn fw-bold px-4 py-2 rounded-pill fs-5 transition-all text-uppercase shadow-sm ${
              activeCategory.toLowerCase() === cat.toLowerCase() ? 'btn-dark-brown' : 'btn-outline-dark-brown'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark-brown" style={{ width: '3.5rem', height: '3.5rem' }} role="status"></div>
          <p className="mt-3 text-muted fw-bold fs-4">Loading laboratory testing menus...</p>
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="alert bg-light-amber text-center p-5 border border-amber-100 rounded-4 shadow-sm mx-2">
          <i className="bi bi-flask fs-2 text-warning d-block mb-3" style={{ fontSize: '3rem' }}></i>
          <h4 className="fw-bold text-gray-800 mb-2">No Lab Tests Found</h4>
          <p className="mb-0 text-muted fs-5">We couldn't locate any dynamic laboratory rows in the "{activeCategory}" category tier right now.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredTests.map((test) => {
            const isDateSelected = !!selectedDates[test.id];
            
            return (
              <div key={test.id} className="col p-2">
                <div className="card h-100 border border-light-brown/10 p-4 shadow-sm rounded-4 bg-white d-flex flex-column justify-content-between" style={{ minHeight: '420px' }}>
                  
                  <div>
                    <span className="badge bg-light-brown text-dark-brown px-3 py-1.5 rounded-pill mb-3 small text-uppercase fw-bold border border-amber-200/40">
                      {test.category}
                    </span>
                    <h3 className="fw-bold text-gray-800 fs-2 mb-2 text-truncate" title={test.name}>
                      {test.name}
                    </h3>
                    <p className="text-muted fs-5 leading-relaxed text-line-clamp-3 mb-3" style={{ display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {test.description}
                    </p>
                  </div>

                  {/* 💡 NEW: Inline Date picker element forces user engagement before checkout trigger actions */}
                  <div className="mb-4 p-3 bg-light rounded-3 border border-gray-100">
                    <label className="form-label small text-uppercase fw-bold text-secondary mb-1" style={{ fontSize: '0.75rem' }}>
                      Select Appointment Date
                    </label>
                    <input 
                      type="date"
                      min={new Date().toISOString().split('T')[0]} // Blocks choosing historical dates
                      value={selectedDates[test.id] || ""}
                      onChange={(e) => handleDateChange(test.id, e.target.value)}
                      className="form-control form-control-sm border-gray-300 fw-semibold"
                      required
                    />
                  </div>

                  <div className="pt-3 border-top border-light-brown/20 d-flex align-items-center justify-content-between gap-3">
                    <div>
                      <span className="text-muted small d-block mb-0 fw-semibold">Test Price</span>
                      <span className="fs-2 fw-black text-success">₹{test.price}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleBookTest(test)}
                      disabled={!isDateSelected} // Visual defense helper forces validation checks upfront
                      className={`btn rounded-pill py-2.5 px-4 fw-bold fs-5 text-uppercase shadow-sm ${
                        isDateSelected ? 'btn-dark-brown' : 'btn-secondary opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <i className="bi bi-calendar-plus me-1"></i> Book Test
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
