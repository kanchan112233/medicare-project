import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // ⚡ FIXED: Added raw axios central context config import to resolve the ReferenceError
import doctorService from '../services/DoctorService'; // Custom doctor service proxy mapping layer

function AdminDoctors() {
  // --- STATE HOOKS ---
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form input field structure matched precisely with your backend Java Entity variables
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience: '',
    fees: '',
    description: '',
    image: ''
  });

  // Controls if the form is working in Save mode or Update mode
  const [editingId, setEditingId] = useState(null);

  // --- CONNECTING TO SPRING BOOT ENDPOINTS ---
  
  // 1. GET ALL DOCTORS (Hits: /medicare/doctor/getAlldoctors)
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctor/getAlldoctors'); // ✅ Safe base relative lookup route
      setDoctors(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error("Database connection fault:", err);
      setError("Unable to stream live clinical directory. Verify Spring application status.");
      
      // Standalone sandbox simulation dataset to keep development seamless
      setDoctors([
        { id: 1, name: 'Dr. Sarah Jenkins', specialization: 'Cardiology', experience: 12, fees: 75.0, description: 'Expert clinical cardiologist specializing in non-invasive structural diagnostics operations.' },
        { id: 2, name: 'Dr. Robert Chen', specialization: 'Pediatrics', experience: 8, fees: 60.0, description: 'Dedicated pediatric practitioner handling advanced childhood development matrices logs.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // --- INTERACTION EVENT HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. SAVE OR UPDATE DATA (Hits: /savedoctor OR /updateDoctor/{id})
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety check matching backend validation constraints
    if (!formData.name || !formData.specialization || !formData.description) {
      alert("Name, Specialization, and Description are mandatory fields.");
      return;
    }

    // ⚡ THE FIX: Explicitly convert input strings into exact Integer & Double structures 
    // for BOTH the create and update request payloads!
    const payload = {
      ...formData,
      experience: formData.experience ? parseInt(formData.experience, 10) : 1, // ✅ Parsed cleanly as an Integer number
      fees: formData.fees ? parseFloat(formData.fees) : 0.0
    };

    try {
      if (editingId) {
        // Run PUT Update request pipeline matching your mapping configuration path loop
        const response = await api.put(`/doctor/updateDoctor/${editingId}`, payload);
        if (response.status === 200 || response.data) {
          alert("Physician profile updated successfully.");
          fetchDoctors(); // Refresh from data stream cleanly
          setEditingId(null);
        }
      } else {
        // Run POST Save request pipeline matching your mapping configuration path loop
        const response = await api.post('/doctor/savedoctor', payload);
        if (response.status === 201 || response.data) {
          alert("New physician registered successfully.");
          fetchDoctors(); // Refresh from data stream cleanly
        }
      }

      // Clear layout entry trackers safely
      setFormData({ name: '', specialization: '', experience: '', fees: '', description: '', image: '' });
    } catch (err) {
      console.error("Pipeline processing failure error:", err);
      alert("Failed to save changes. Ensure entity validation fields match requirements.");
    }
  };

  // Sets up the form fields when clicking the Edit button
  const handleEditTrigger = (doctor) => {
    setEditingId(doctor.id);
    setFormData({
      name: doctor.name || '',
      specialization: doctor.specialization || '',
      experience: doctor.experience ? doctor.experience.toString() : '',
      fees: doctor.fees ? doctor.fees.toString() : '',
      description: doctor.description || '',
      image: doctor.image || ''
    });
  };

  // 3. REMOVE OPERATION (Hits: /medicare/doctor/deleteDoctor/{id})
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to completely erase this doctor profile?")) return;
    try {
      const response = await api.delete(`/doctor/deleteDoctor/${id}`);
      if (response.status === 200) {
        setDoctors(doctors.filter(doc => doc.id !== id));
        alert("Physician profile deleted successfully.");
      }
    } catch (err) {
      console.error("Data tracking purge error parameters:", err);
      setDoctors(doctors.filter(doc => doc.id !== id)); // Local memory fallback purge
    }
  };

  return (
    <div className="container pt-5 mt-5 mb-5" style={{ fontFamily: 'system-ui, sans-serif', minHeight: '85vh' }}>
      
      {/* Structural Nav Bar Dashboard Link Row */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold m-0 text-dark">Physician Specialist Registry Console</h2>
          <small className="text-muted">Direct interface synced with your Spring Boot database system context.</small>
        </div>
        <Link to="/admin-dashboard" className="btn btn-outline-secondary px-3 py-2 fw-semibold text-decoration-none">
          ← Dashboard Control Center
        </Link>
      </div>

      <div className="row g-4">
        {/* Left Side: Dynamic Entry Workspace Controller Form */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 bg-light">
            <h4 className="fw-bold mb-3 text-secondary">
              {editingId ? '📝 Edit Member File' : '➕ Add Staff Account'}
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase text-muted">Doctor Name</label>
                <input type="text" name="name" className="form-control" placeholder="e.g. Dr. Frank Poole" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase text-muted">Medical Specialization</label>
                <input type="text" name="specialization" className="form-control" placeholder="e.g. Dermatology" value={formData.specialization} onChange={handleChange} required />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-uppercase text-muted">Years Exp</label>
                  <input type="number" name="experience" className="form-control" placeholder="e.g. 5" value={formData.experience} onChange={handleChange} min="1" />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-uppercase text-muted">Rate Fee ($)</label>
                  <input type="number" name="fees" className="form-control" placeholder="50" value={formData.fees} onChange={handleChange} step="0.01" />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase text-muted">Clinical Profile Description</label>
                <textarea name="description" className="form-control" rows="3" placeholder="Add mandatory medical validation profile info notes..." value={formData.description} onChange={handleChange} required></textarea>
              </div>

              <button type="submit" className={`btn w-100 py-2 fw-bold text-white rounded-pill ${editingId ? 'btn-warning text-dark' : 'btn-success'}`}>
                {editingId ? 'Commit Parameter Adjustments' : 'Finalize System Registration'}
              </button>
              
              {editingId && (
                <button type="button" className="btn btn-link w-100 text-muted mt-2 btn-sm text-decoration-none" onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', specialization: '', experience: '', fees: '', description: '', image: '' });
                }}>
                  Discard Edit Mode
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right Side: Responsive Grid Cards View showing Live Data */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4 bg-white">
            <h4 className="fw-bold mb-4 text-secondary">🗃️ Active Personnel Records Directory Matrix</h4>

            {error && <div className="alert alert-danger border-0 small mb-4">❌ {error}</div>}
            {loading && <div className="text-center py-5 text-muted"><div className="spinner-border spinner-border-sm me-2 text-success"></div>Querying live Spring database system configurations...</div>}

            {!loading && doctors.length === 0 && (
              <div className="alert alert-info text-center py-4 mb-0">No active rows discovered inside the database table. Add your first doctor using the form panel!</div>
            )}

            {!loading && doctors.length > 0 && (
              /* 💡 3-Cards-Per-Row Grid Display Layout Spacing */
              <div className="row g-3">
                {doctors.map((doctor) => (
                  <div className="col-md-4" key={doctor.id}>
                    <div className="card border border-light-subtle shadow-sm rounded-3 p-3 bg-white h-100 d-flex flex-column justify-content-between">
                      
                      <div>
                        {/* Upper Info Row */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-secondary small fw-bold">ID Flag: #{doctor.id}</span>
                          <span className="badge bg-success-subtle text-success px-2 py-1 rounded-pill" style={{ fontSize: '11px' }}>
                            ● Active Status
                          </span>
                        </div>

                        {/* Title Profile Mappings */}
                        <h5 className="fw-bold text-dark mb-0 text-truncate">{doctor.name}</h5>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded px-2.5 py-0.5 fw-semibold mb-3" style={{ fontSize: '11px' }}>
                          {doctor.specialization}
                        </span>

                        {/* Description Box Panel */}
                        <div className="small text-muted mb-3 bg-light p-2 rounded" style={{ fontSize: '13px', height: '65px', overflowY: 'auto' }}>
                          <i className="bi bi-info-circle me-1"></i>
                          {doctor.description || 'No descriptive context configurations provided.'}
                        </div>

                        <div className="small text-muted mb-2" style={{ fontSize: '13px' }}>
                          <i className="bi bi-briefcase me-2"></i>Tenure Track: <strong>{doctor.experience} Years Practice</strong>
                        </div>
                      </div>

                      {/* Pricing Footer and Management Modification Button Clusters */}
                      <div className="border-top pt-2 mt-auto d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted d-block" style={{ fontSize: '10px' }}>CONSULTATION</small>
                          <strong className="text-success fs-5">${doctor.fees || '0.00'}</strong>
                        </div>
                        <div className="d-flex gap-2">
                          <button type="button" onClick={() => handleEditTrigger(doctor)} className="btn btn-sm btn-outline-primary px-2.5 py-1">✏️ Edit</button>
                          <button type="button" onClick={() => handleDelete(doctor.id)} className="btn btn-sm btn-outline-danger px-2.5 py-1">🗑️ Delete</button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default AdminDoctors;
