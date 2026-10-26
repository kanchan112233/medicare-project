// src/Pages/Mediciens.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MedicineService from '../services/MedicineService';
import CartItemService from '../services/CartService';

function Mediciens() {
  const navigate = useNavigate();
  const [medicinesList, setMedicinesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    MedicineService.getAllMedicines()
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setMedicinesList(response.data);
        } else {
          setMedicinesList([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error communicating with Medicine API:", error);
        setMedicinesList([]);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (medicineId) => {
    // 1. Audit check: Direct fallback extraction from local storage session profiles
    const sessionData = localStorage.getItem("user");
    const activeUser = sessionData ? JSON.parse(sessionData) : null;

    // 2. Security guard: If user profile or token is missing, redirect to login page instantly
    if (!activeUser || !activeUser.token || !activeUser.id) {
      alert("🔐 Authentication Required! Please log in to your patient account to purchase prescription medications.");
      navigate('/login');
      return;
    }

    console.log(`Dispatched item: Med ID ${medicineId} for User ID ${activeUser.id}`);

    // 3. Authenticated block: Dispatches network payload securely via interceptors mapping
    CartItemService.addToCart(activeUser.id, medicineId, 1)
      .then(() => {
        alert("🎉 Success! Medicine added to your cart.");
      })
      .catch((error) => {
        console.error("Cart item insertion rejected:", error);
        alert(
          error.response?.data?.message || 
          "Could not append item to database session. Verify security filters."
        );
      });
  };

  const filteredItems = medicinesList.filter(item => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-5" style={{ minHeight: '80vh', maxWidth: '1440px' }}>
      
      {/* Header Catalog Section Title + Live Search Box */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 border-bottom pb-4 mb-5 px-2">
        <div>
          <h2 className="fw-black text-gray-900 display-5 mb-2">Online Pharmacy Storefront</h2>
          <p className="text-secondary fs-4 mb-0">Browse verified treatments and prescription healthcare items online</p>
        </div>
        
        <div className="position-relative" style={{ minWidth: '360px' }}>
          <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-4"></i>
          <input 
            type="text"
            className="form-control rounded-pill ps-5 py-3 fs-5 shadow-sm border border-light-brown/30"
            placeholder="Search medicine brand, formula..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark-brown" style={{ width: '3.5rem', height: '3.5rem' }} role="status"></div>
          <p className="mt-3 text-muted fw-bold fs-4">Querying database medicine records...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="alert bg-light-amber text-center p-5 border border-amber-100 rounded-4 shadow-sm mx-2">
          <i className="bi bi-capsule display-3 text-warning d-block mb-3"></i>
          <h4 className="fw-bold text-gray-800 mb-2">No Medicines Found In Database</h4>
          <p className="mb-0 text-muted fs-5">Please ensure your Spring Boot server is online and database rows are populated.</p>
        </div>
      ) : (
        /* Perfectly Balanced 3 Cards Per Row Grid */
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-5">
          {filteredItems.map((med) => (
            <div key={med.id} className="col p-2">
              <div className="card h-100 border border-light-brown/10 p-4 shadow-sm rounded-4 transition-card bg-white d-flex flex-column justify-content-between" style={{ minHeight: '460px' }}>
                
                <div>
                  <div className="w-100 bg-light-amber rounded-3 mb-4 d-flex align-items-center justify-content-center text-danger position-relative overflow-hidden" style={{ height: '220px' }}>
                    <i className="bi bi-capsule text-danger" style={{ fontSize: '4.5rem' }}></i>
                  </div>

                  <div className="px-1">
                    <span className="badge bg-light-brown text-dark-brown px-3 py-1 rounded-pill mb-2 small text-uppercase fw-bold border border-amber-200/40">
                      {med.category || 'Medication'}
                    </span>
                    <h3 className="fw-bold text-gray-900 mb-2 fs-2 text-truncate" title={med.name}>{med.name}</h3>
                    <p className="text-muted fs-5 leading-relaxed text-line-clamp-3 mb-0" style={{ display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {med.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-top border-light-brown/20 d-flex align-items-center justify-content-between gap-3">
                  <div>
                    <span className="text-muted fs-6 d-block mb-1 font-medium fw-semibold">Retail Price</span>
                    <span className="fs-2 fw-black text-success">₹{med.price || 0.00}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(med.id)}
                    className="btn btn-dark-brown rounded-pill py-2.5 px-4 fw-bold fs-5 text-uppercase shadow-sm d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-cart-plus-fill fs-4"></i> Add to Cart
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Mediciens;
