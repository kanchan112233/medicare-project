// src/Pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserService from '../services/UserService';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    UserService.loginUser(formData)
      .then((response) => {
        console.log("Login Success:", response.data);

        // Commit authentication profile details natively to your browser's persistence layout
        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );

        console.log(
          "Stored User:",
          localStorage.getItem("user")
        );

        // 💡 UPDATED ROLE GATE ROUTER LAYER
        // Inspects the authorization role string returned from your secure Spring Boot server
        const userRole = response.data?.role?.toUpperCase();

        if (userRole === "ADMIN") {
          // Admins land straight on the comprehensive tracking telemetry dashboard
          navigate("/admin-dashboard");
        } else {
          // Regular patients continue smoothly onto the public marketplace homepage
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Authentication capture trace log:", err);
        setLoading(false);

        // Defensive validation map checker isolates nested JSON string fields safely
        if (err.response && err.response.data) {
          if (typeof err.response.data === 'string') {
            setErrorMessage(err.response.data);
          } else if (err.response.data.message) {
            setErrorMessage(err.response.data.message);
          } else {
            setErrorMessage('Invalid credential email or password combo.');
          }
        } else {
          setErrorMessage('Could not connect to the secure Spring Boot authentication server.');
        }
      });
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-sm border-0 p-5 bg-white w-100" style={{ maxWidth: '500px', borderRadius: '20px' }}>
        
        <div className="text-center mb-4">
          <div className="icon-wrapper mb-2 text-danger bg-danger-light rounded-circle mx-auto" style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-shield-lock-fill fs-2"></i>
          </div>
          <h2 className="fw-black text-gray-900 fs-1">Account Login</h2>
          <p className="text-muted fs-5">Access your clinical dashboard portals</p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger rounded-3 py-2.5 fs-6 font-medium border-0 mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorMessage}
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="form-label fw-bold text-gray-700 fs-5 mb-2">Registered Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              className="form-control rounded-pill p-3 fs-5 border border-light-brown/40" 
              autoComplete="username" 
              placeholder="e.g. admin@medicare.com" 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold text-gray-700 fs-5 mb-2">Security Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange} 
              className="form-control rounded-pill p-3 fs-5 border border-light-brown/40" 
              autoComplete="current-password" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-dark-brown py-3 rounded-pill w-100 fs-4 fw-bold text-uppercase mt-3 shadow-sm tracking-wide"
          >
            {loading ? 'Verifying profile credentials...' : 'Secure Login'}
          </button>
        </form>

        <div className="text-center mt-4 text-muted fs-5 font-medium">
          New to Medicare? <Link to="/register" className="text-primary text-decoration-none fw-bold">Create an account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
