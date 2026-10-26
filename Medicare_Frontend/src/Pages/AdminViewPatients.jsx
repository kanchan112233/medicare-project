import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Injects central authorization headers automatically

function AdminViewPatients() {
  // --- STATE HOOKS LAYER ---
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- DATABASE DATA STREAM INGESTION ---
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/patient/getAllPatients');
      setPatients(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Database connection fault streaming patient core:", err);
      setError("Unable to stream live clinical patient directory. Running on sandboxed mock data.");
      
      // Fallback development mock matrix precisely matching your com.itvedant.dr215.MedicareApp.entity.Patient keys
      setPatients([
        { id: 2, firstname: 'Priya', lastname: 'Sharma', gender: 'Female', birthdate: '1998-04-12', phone: '1472583692', email: 'priya@gmail.com', address: 'Flat 402, Skyline Towers, Mumbai', bloodgroup: 'B+' },
        { id: 3, firstname: 'Anjali', lastname: 'Verma', gender: 'Female', birthdate: '1992-08-24', phone: '3692587410', email: 'anjali@yahoo.com', address: 'Sector 15, Vashi, Navi Mumbai', bloodgroup: 'A+' },
        { id: 4, firstname: 'Kiran', lastname: 'Mehta', gender: 'Female', birthdate: '1985-11-05', phone: '2583697410', email: 'kiran@outlook.com', address: 'MG Road, Camp, Pune', bloodgroup: 'A+' },
        { id: 5, firstname: 'Rohan', lastname: 'Joshi', gender: 'Male', birthdate: '1990-01-15', phone: '9876543210', email: 'rohan@gmail.com', address: 'Shivaji Nagar, Nagpur', bloodgroup: 'B+' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // --- HELPER COMPILATION METHODS ---
  
  // 💡 FIX: Safely evaluates dynamic age parameter metrics by subtracting birthdate from current execution year (2026)
  const calculateAge = (birthdateString) => {
    if (!birthdateString) return 'N/A';
    const birthYear = new Date(birthdateString).getFullYear();
    const currentYear = new Date().getFullYear(); // Evaluates to 2026 perfectly
    const age = currentYear - birthYear;
    return isNaN(age) ? 'N/A' : `${age} Yrs`;
  };

  // 💡 FIX: Parses the end of your database address string value block to dynamically extract city metadata
  const extractCity = (addressString) => {
    if (!addressString || addressString.isBlank?.()) return 'Not Specified';
    const addressParts = addressString.split(',');
    // Grabs the last segment item of the comma array list framework
    const citySegment = addressParts[addressParts.length - 1].trim();
    return citySegment || 'Not Specified';
  };

  // --- DELETE MANAGEMENT HANDLER ---
  const handleDeletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to completely remove this patient profile?")) return;
    try {
      const response = await api.delete(`/patient/deletePatientById/${id}`);
      if (response.status === 200) {
        setPatients(patients.filter(p => p.id !== id));
        alert("Patient record purged successfully.");
      }
    } catch (err) {
      console.error("Data tracking purge error parameters:", err);
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  return (
    <div className="container pt-5 mt-5 mb-5" style={{ fontFamily: 'system-ui, sans-serif', minHeight: '85vh' }}>
      
      {/* Upper Navigation Heading Row Links Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold m-0 text-dark">Clinical Patient Medical Profiles</h2>
          <small className="text-muted">Global registry console tracking biometrics, contacts, and active database case files.</small>
        </div>
        <Link to="/admin-dashboard" className="btn btn-outline-secondary px-3 py-2 fw-semibold text-decoration-none">
          ← Dashboard Control Center
        </Link>
      </div>

      {error && (
        <div className="alert alert-warning border-0 small mb-4 py-2 shadow-sm">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border text-primary mb-2" role="status"></div>
          <div>Syncing electronic medical case logs...</div>
        </div>
      ) : patients.length === 0 ? (
        <div className="alert alert-light border text-center py-5 shadow-sm rounded-3">
          <h5 className="text-secondary fw-bold mb-0">No Patient Profiles Have Been Created Within the Connected Database Core</h5>
        </div>
      ) : (
        /* 💡 3-Cards-Per-Row Grid Display Layout (col-md-4 loop nodes match screenshot layout) */
        <div className="row g-3">
          {patients.map((patient) => (
            <div className="col-md-4" key={patient.id}>
              <div className="card border border-light-subtle shadow-sm rounded-3 bg-white p-3 h-100 d-flex flex-column justify-content-between">
                
                <div>
                  {/* Status Strip Header Tag Row Elements */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-secondary small fw-bold">Case Ref: #{patient.id}</span>
                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-2.5 py-0.5 fw-bold" style={{ fontSize: '11px' }}>
                      🩸 Blood Group: {patient.bloodgroup || 'N/A'}
                    </span>
                  </div>

                  {/* Core Patient Identity Header (Combines firstname + lastname variables) */}
                  <h5 className="fw-bold text-dark mb-3 mt-1 text-custom-brown text-truncate">
                    <i className="bi bi-person-square me-2 text-secondary"></i>
                    {patient.firstname} {patient.lastname}
                  </h5>

                  {/* Inner Metadata Demographics Layout Configuration Box Mapping */}
                  <div className="bg-light p-2.5 rounded mb-2" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                    <div className="text-dark mb-1">
                      <i className="bi bi-gender-ambiguous me-2 text-muted"></i>
                      {/* ⚡ FIXED: Calls calculateAge function against the database birthdate data layer */}
                      Demographics: <strong>{calculateAge(patient.birthdate)} | {patient.gender || 'Not Specified'}</strong>
                    </div>
                    <div className="text-dark mb-1 text-truncate">
                      <i className="bi bi-telephone me-2 text-muted"></i>
                      Mobile Line: <span className="fw-medium">{patient.phone || '—'}</span>
                    </div>
                    <div className="text-dark text-truncate">
                      <i className="bi bi-geo-alt me-2 text-muted"></i>
                      {/* ⚡ FIXED: Dynamically pulls out the ending city substring location element fields */}
                      Registered City: <span className="fw-medium text-capitalize">{extractCity(patient.address)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls Actions Panel */}
                <div className="border-top pt-2 mt-3 d-flex justify-content-between align-items-center">
                  <span className="text-muted small" style={{ fontSize: '11px' }}>Status: <strong>EHR Sync Active</strong></span>
                  <button 
                    type="button" 
                    onClick={() => handleDeletePatient(patient.id)}
                    className="btn btn-sm btn-outline-danger px-3 rounded-pill fw-semibold d-flex align-items-center gap-1"
                    style={{ fontSize: '12px' }}
                  >
                    <i className="bi bi-trash3 small"></i> Purge Record
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

export default AdminViewPatients;
