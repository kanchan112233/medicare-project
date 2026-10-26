// src/Pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import CartItemService from '../services/CartService';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentUserId, setCurrentUserId] = useState(() => {
    const sessionUser = JSON.parse(localStorage.getItem('user'));
    return sessionUser ? Number(sessionUser.id) : null;
  });

  const fallbackMedicines = [
    { id: 1, name: 'Paracetamol 500mg', price: 45.0, description: 'Standard Paracetamol tablets for fast pain relief.' },
    { id: 2, name: 'Ranitidine 150mg', price: 65.0, description: 'Antacid tablets designed to minimize stomach acid production.' },
    { id: 3, name: 'Amoxicillin 500mg', price: 120.0, description: 'Broad-spectrum antibiotic capsules.' }
  ];

  useEffect(() => {
    if (!currentUserId) {
      navigate('/login');
      return;
    }

    setLoading(true);
    
    api.get('/cartitem/getAllCartItems')
      .then((response) => {
        let rawItemsArray = [];

        if (response.data) {
          if (Array.isArray(response.data)) {
            rawItemsArray = response.data;
          } else if (Array.isArray(response.data.content)) {
            rawItemsArray = response.data.content;
          } else {
            const extractedKey = Object.keys(response.data).find(key => Array.isArray(response.data[key]));
            if (extractedKey) {
              rawItemsArray = response.data[extractedKey];
            }
          }
        }

        const userItems = rawItemsArray.filter(item => {
          const itemUserId = item.userid || (item.user && item.user.id);
          return Number(itemUserId) === Number(currentUserId);
        });
        
        const populatedItems = userItems.map(item => {
          if (!item.medicine) {
            const targetMedId = item.medicine_id || item.medicineid;
            const matchedMed = fallbackMedicines.find(m => Number(m.id) === Number(targetMedId));
            return { ...item, medicine: matchedMed };
          }
          return item;
        });

        setCartItems(populatedItems);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed downloading cart data rows from backend system:", error);
        setCartItems([]);
        setLoading(false);
      });
  }, [currentUserId, navigate]);

  const handleQuantityAdjust = (id, newQty) => {
    if (newQty < 1) return;
    CartItemService.updateQuantity(id, newQty)
      .then(() => {
        setCartItems(prev => prev.map(item => (item.id === id || item.cart_id === id) ? { ...item, quantity: newQty } : item));
      })
      .catch(err => console.error("Could not overwrite row quantity levels:", err));
  };

  const handleItemRemoval = (id) => {
    CartItemService.deleteCartItem(id)
      .then(() => {
        setCartItems(prev => prev.filter(item => item.id !== id && item.cart_id !== id));
      })
      .catch(err => console.error("Database rejected item row removal command:", err));
  };

  const calculateTotalBill = () => {
    const total = cartItems.reduce((sum, item) => {
      const price = item.medicine?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    return parseFloat(total.toFixed(2));
  };

  const handleCheckoutSubmit = () => {
    const finalAmount = calculateTotalBill();
    if (finalAmount <= 0) {
      alert("Your total bill amount must be greater than ₹0 to checkout.");
      return;
    }

    navigate('/payment', { 
      state: { 
        totalAmount: finalAmount, 
        userId: currentUserId 
      } 
    });
  };

  return (
    <div className="container py-5" style={{ minHeight: '80vh', maxWidth: '1440px' }}>
      
      <div className="mb-5 text-center text-md-start px-2">
        <h2 className="fw-black text-gray-900 display-5 mb-2">Shopping Pharmacy Cart</h2>
        <p className="text-secondary fs-4">Review your selected items and medical prescription orders before safe checking out</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3.5rem', height: '3.5rem' }} role="status"></div>
          <p className="mt-3 text-muted fw-bold fs-4">Synchronizing database shopping sessions...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="alert bg-light text-center p-5 border rounded-4 shadow-sm mx-2">
          <i className="bi bi-cart-x display-3 text-warning d-block mb-3"></i>
          <h4 className="fw-bold text-gray-800 mb-2">Your Shopping Cart is Empty</h4>
          <p className="mb-0 text-muted fs-5">You haven't attached any prescription compounds to your current shopping session row.</p>
        </div>
      ) : (
        <div className="row g-5">
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-4">
              {cartItems.map((item) => (
                <div key={item.id || item.cart_id} className="card p-4 shadow-sm border rounded-4 bg-white d-flex flex-sm-row gap-4 align-items-center justify-content-between">
                  
                  <div className="d-flex align-items-center gap-4">
                    <div className="bg-light text-danger rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                      <i className="bi bi-capsule text-danger" style={{ fontSize: '2.5rem' }}></i>
                    </div>
                    <div>
                      <h4 className="fw-bold mb-1 text-dark">{item.medicine?.name || "Medicine Item"}</h4>
                      <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '300px' }}>{item.medicine?.description}</p>
                      <span className="text-success fw-bold d-block mt-1">₹{item.medicine?.price}</span>
                    </div>
                  </div>

                  {/* Quantity & Delete Controls */}
                  <div className="d-flex align-items-center gap-4">
                    <div className="d-flex align-items-center border rounded-3 overflow-hidden">
                      <button className="btn btn-sm btn-light px-3 py-2 border-end rounded-0" onClick={() => handleQuantityAdjust(item.id || item.cart_id, item.quantity - 1)}>-</button>
                      <span className="px-3 fw-bold">{item.quantity}</span>
                      <button className="btn btn-sm btn-light px-3 py-2 border-start rounded-0" onClick={() => handleQuantityAdjust(item.id || item.cart_id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="btn btn-outline-danger btn-sm rounded-circle p-2" onClick={() => handleItemRemoval(item.id || item.cart_id)}>
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card p-4 shadow-sm border rounded-4 bg-light">
              <h4 className="fw-bold mb-3 text-gray-800">Order Summary</h4>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Total Price:</span>
                <h3 className="text-primary fw-bold mb-0">₹{calculateTotalBill()}</h3>
              </div>
              <button className="btn btn-primary btn-lg w-100 rounded-3 fw-bold text-uppercase mt-2" onClick={handleCheckoutSubmit}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
