// src/Pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserService from '../services/UserService';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'PATIENT', image: 'default-avatar.png' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.phone.length !== 10) {
      setError("Mobile phone number must be exactly 10 digits long.");
      return;
    }
    if (formData.password.length < 4 || formData.password.length > 20) {
      setError("Password must be between 4 and 20 characters.");
      return;
    }

    setLoading(true);
    
    UserService.registerUser(formData)
   .then((response) => {

  setLoading(false);

  alert("🎉 Registration Successful!");

  navigate('/login');
})
      .catch((err) => {
        console.error("Registration Error Response Logger:", err);
        setLoading(false);

        // FIXED: Added strict defensive evaluation logic to handle network/validation structures cleanly
        if (err.response && err.response.data) {
          if (typeof err.response.data === 'string') {
            setError(err.response.data);
          } else if (err.response.data.message) {
            setError(err.response.data.message);
          } else if (typeof err.response.data === 'object') {
            setError(JSON.stringify(err.response.data));
          } else {
            setError('Account submission rejected due to validation constraints.');
          }
        } else {
          // Gracefully handles raw network timeouts or connection-refused errors without throwing crashes
          setError('Network Error: Cannot connect to the Medicare backend. Verify your Spring Boot server is running on port 8087.');
        }
      });
  };

  return (
    <div className="container d-flex align-items-center justify-content-center py-5" style={{ minHeight: '80vh' }}>
      <div className="card shadow-sm border-0 p-5 bg-white w-100" style={{ maxWidth: '540px', borderRadius: '20px' }}>
        
        <div className="text-center mb-4">
          <div className="icon-wrapper mb-2 text-success bg-success-light rounded-circle mx-auto" style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-person-plus-fill fs-2"></i>
          </div>
          <h2 className="fw-black text-gray-900 fs-1">Register Account</h2>
          <p className="text-muted fs-5">Join the Medicare secure clinical healthcare network</p>
        </div>

        {error && (
          <div className="alert alert-danger rounded-3 py-2.5 fs-6 font-medium border-0 mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold text-gray-700 fs-5 mb-2">Full Profile Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-control rounded-pill p-3 fs-5 border" placeholder="e.g. John Doe" required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-gray-700 fs-5 mb-2">Primary Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-control rounded-pill p-3 fs-5 border" placeholder="e.g. john.doe@email.com" required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-gray-700 fs-5 mb-2">Contact Mobile Number</label>
            <input type="tel" name="phone" maxLength="10" value={formData.phone} onChange={handleInputChange} className="form-control rounded-pill p-3 fs-5 border" placeholder="e.g. 9876543210" required />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold text-gray-700 fs-5 mb-2">Set Security Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="form-control rounded-pill p-3 fs-5 border" placeholder="4 - 20 characters long" required />
          </div>

          <button type="submit" disabled={loading} className="btn btn-dark-brown py-3 rounded-pill w-100 fs-4 fw-bold text-uppercase mt-2 shadow-sm tracking-wide">
            {loading ? 'Processing secure profile registration...' : 'Complete Register'}
          </button>
        </form>

        <div className="text-center mt-4 text-muted fs-5 font-medium">
          Already have an account? <Link to="/login" className="text-primary text-decoration-none fw-bold">Log in here</Link>
        </div>
      </div>
    </div>
  );
}