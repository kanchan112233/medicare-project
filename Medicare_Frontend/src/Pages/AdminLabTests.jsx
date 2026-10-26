import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import labTestService from '../services/LabTestService'; // ⚡ Using your exact customized service script

function AdminLabTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form input field structure matching your exact com.itvedant.dr215.MedicareApp.entity.LabTest variables
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: ''
  });

  const [editingId, setEditingId] = useState(null);

  // 1. GET ALL LAB TESTS (Hits: /labtest/all via your service layer)
  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await labTestService.getAllLabTests();
      setTests(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error("Database connection fault:", err);
      setError("Unable to stream live diagnostic database. Running on fallback sandbox matrix view.");
      setTests([
        { id: 1, name: 'Complete Blood Count (CBC)', category: 'Hematology', price: 45.0, description: 'Evaluates overall health and detects wide range of disorders including anemia and infection.' },
        { id: 2, name: 'Lipid Profile Panel', category: 'Biochemistry', price: 65.0, description: 'Measures cholesterol levels and triglycerides to assess cardiovascular risk profiles.' },
        { id: 3, name: 'HbA1c Diabetic Test', category: 'Endocrinology', price: 55.0, description: 'Tracks average blood glucose concentration over past 3 months for diabetic monitoring.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price || !formData.description) {
      alert("All parameters are absolute validation requirements.");
      return;
    }

    const payload = { ...formData, price: parseFloat(formData.price || 0) };

    try {
      if (editingId) {
        // Optional placeholder mapping logic if you add post/put methods later to your service layer
        alert("Lab test configuration modifications update simulated successfully.");
      } else {
        alert("New lab test packet addition simulated successfully.");
      }
      setEditingId(null);
      setFormData({ name: '', price: '', category: '', description: '' });
      fetchTests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTrigger = (test) => {
    setEditingId(test.id);
    setFormData({
      name: test.name || '',
      category: test.category || '',
      price: test.price ? test.price.toString() : '',
      description: test.description || ''
    });
  };

  return (
    <div className="container pt-5 mt-5 mb-5" style={{ fontFamily: 'system-ui, sans-serif', minHeight: '85vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold m-0 text-dark">Lab Package Diagnostics Manager</h2>
          <small className="text-muted">Configure active analysis parameters, catalog rates, and structural classifications.</small>
        </div>
        <Link to="/admin-dashboard" className="btn btn-outline-secondary fw-semibold">← Dashboard</Link>
      </div>

      <div className="row g-4">
        {/* Left Side: Dynamic Entry Controller Workspace Form */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 bg-light">
            <h4 className="fw-bold mb-3 text-secondary">{editingId ? '📝 Edit Test Spec' : '➕ Mount New Lab Test'}</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase text-muted">Test Panel Name</label>
                <input type="text" name="name" className="form-control" placeholder="e.g. Thyroid Profile" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase text-muted">Clinical Category</label>
                <input type="text" name="category" className="form-control" placeholder="e.g. Biochemistry" value={formData.category} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase text-muted">Rate Cost ($)</label>
                <input type="number" name="price" className="form-control" placeholder="60.00" value={formData.price} onChange={handleChange} step="0.01" required />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase text-muted">Clinical Specifications Summary</label>
                <textarea name="description" className="form-control" rows="3" placeholder="Specify fasting instructions or criteria notes..." value={formData.description} onChange={handleChange} required></textarea>
              </div>
              <button type="submit" className={`btn w-100 py-2 fw-bold text-white rounded-pill ${editingId ? 'btn-warning text-dark' : 'btn-info'}`}>
                {editingId ? 'Commit Parameter Alterations' : 'Register Diagnostic Node'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side Grid Display (3 Cards Per Row) */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4 bg-white">
            <h4 className="fw-bold mb-4 text-secondary">🗂️ Active Laboratory Service Grid Map</h4>
            {error && <div className="alert alert-danger border-0 small mb-3">❌ {error}</div>}
            {loading && <div className="text-center py-5"><div className="spinner-border spinner-border-sm text-info me-2"></div>Accessing registry matrices...</div>}
            
            {!loading && tests.length === 0 && <div className="alert alert-light border text-center py-4">No diagnostic test packages deployed onto system storage nodes.</div>}

            {!loading && tests.length > 0 && (
              <div className="row g-3">
                {tests.map(test => (
                  <div className="col-md-4" key={test.id}>
                    <div className="card border border-light-subtle shadow-sm rounded-3 p-3 bg-white h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-secondary small fw-bold">ID: #{test.id}</span>
                          <span className="badge bg-info-subtle text-info px-2 py-0.5 rounded-pill" style={{ fontSize: '10px' }}>{test.category}</span>
                        </div>
                        <h5 className="fw-bold text-dark mb-1 text-truncate">{test.name}</h5>
                        <div className="small text-muted mb-2 bg-light p-2 rounded" style={{ height: '65px', overflowY: 'auto', fontSize: '12px' }}>
                          <i className="bi bi-info-circle me-1"></i>
                          {test.description}
                        </div>
                      </div>
                      <div className="border-top pt-2 mt-auto d-flex justify-content-between align-items-center">
                        <div><small className="text-muted d-block" style={{ fontSize: '10px' }}>TOTAL COST</small><strong className="text-primary">${test.price}</strong></div>
                        <div className="d-flex gap-1">
                          <button onClick={() => handleEditTrigger(test)} className="btn btn-sm btn-outline-primary px-2.5 py-1">✏️ Edit</button>
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

export default AdminLabTests;
